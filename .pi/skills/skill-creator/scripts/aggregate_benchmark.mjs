#!/usr/bin/env node
// Aggregate Pi eval artifacts for the bundled review viewer, without Python.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const entries = (dir) => fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
const stats = (values) => {
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.length > 1 ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / (values.length - 1) : 0;
  const round = (value) => Math.round(value * 1e4) / 1e4;
  return { mean: round(mean), stddev: round(Math.sqrt(variance)), min: round(Math.min(...values)), max: round(Math.max(...values)) };
};

export function aggregate(workspace, skillName = '', skillPath = '') {
  const root = path.resolve(workspace);
  const search = fs.existsSync(path.join(root, 'runs')) ? path.join(root, 'runs') : root;
  const evalDirs = entries(search).filter((name) => /^eval-\d+$/.test(name));
  if (!evalDirs.length) throw new Error(`No eval directories in ${search}`);
  const runs = [];
  for (const evalDir of evalDirs) {
    const evalPath = path.join(search, evalDir);
    const evalId = fs.existsSync(path.join(evalPath, 'eval_metadata.json'))
      ? readJson(path.join(evalPath, 'eval_metadata.json')).eval_id ?? Number(evalDir.slice(5)) : Number(evalDir.slice(5));
    for (const config of entries(evalPath)) {
      const configPath = path.join(evalPath, config);
      for (const runName of entries(configPath).filter((name) => /^run-\d+$/.test(name))) {
        const runPath = path.join(configPath, runName);
        const gradingPath = path.join(runPath, 'grading.json');
        if (!fs.existsSync(gradingPath)) throw new Error(`Missing grading.json: ${runPath}. Grade every run before aggregating.`);
        const grading = readJson(gradingPath);
        const { passed, failed, total, pass_rate: passRate } = grading.summary ?? {};
        if (![passed, failed, total, passRate].every(Number.isFinite) || total < 1 || passed + failed !== total || Math.abs(passRate - passed / total) > 1e-6) {
          throw new Error(`Invalid or ungraded summary: ${gradingPath}`);
        }
        const timingPath = path.join(runPath, 'timing.json');
        const timing = fs.existsSync(timingPath) ? readJson(timingPath) : grading.timing ?? {};
        const metrics = grading.execution_metrics ?? {};
        const expectations = grading.expectations ?? [];
        if (!Array.isArray(expectations) || expectations.some((item) => typeof item.text !== 'string' || typeof item.passed !== 'boolean')) {
          throw new Error(`Invalid expectations: ${gradingPath}`);
        }
        const notes = grading.user_notes_summary ?? {};
        runs.push({ eval_id: evalId, configuration: config, run_number: Number(runName.slice(4)),
          result: { pass_rate: passRate, passed, failed, total,
            time_seconds: timing.total_duration_seconds ?? 0, tokens: timing.total_tokens ?? 0,
            tool_calls: metrics.total_tool_calls ?? 0, errors: metrics.errors_encountered ?? 0 },
          expectations, notes: [...(notes.uncertainties ?? []), ...(notes.needs_review ?? []), ...(notes.workarounds ?? [])] });
      }
    }
  }
  if (!runs.length) throw new Error(`No graded runs in ${search}`);
  const configs = [...new Set(runs.map((run) => run.configuration))].sort((a, b) =>
    (a === 'with_skill' ? -1 : b === 'with_skill' ? 1 : a.localeCompare(b)));
  if (configs.length !== 2 || !configs.includes('with_skill')) throw new Error('Benchmark needs with_skill and one baseline configuration');
  for (const evalId of new Set(runs.map((run) => run.eval_id))) {
    const counts = configs.map((config) => runs.filter((run) => run.eval_id === evalId && run.configuration === config).length);
    if (!counts[0] || counts[0] !== counts[1]) throw new Error(`Incomplete or unbalanced paired runs for eval ${evalId}`);
  }
  runs.sort((a, b) => configs.indexOf(a.configuration) - configs.indexOf(b.configuration)
    || String(a.eval_id).localeCompare(String(b.eval_id), undefined, { numeric: true })
    || a.run_number - b.run_number);
  const summary = {};
  for (const config of configs) {
    const data = runs.filter((run) => run.configuration === config).map((run) => run.result);
    summary[config] = { pass_rate: stats(data.map((item) => item.pass_rate)),
      time_seconds: stats(data.map((item) => item.time_seconds)), tokens: stats(data.map((item) => item.tokens)) };
  }
  if (configs.length >= 2) {
    const [candidate, baseline] = configs;
    summary.delta = {
      pass_rate: (summary[candidate].pass_rate.mean - summary[baseline].pass_rate.mean).toFixed(2).replace(/^(?!-)/, '+'),
      time_seconds: (summary[candidate].time_seconds.mean - summary[baseline].time_seconds.mean).toFixed(1).replace(/^(?!-)/, '+'),
      tokens: (summary[candidate].tokens.mean - summary[baseline].tokens.mean).toFixed(0).replace(/^(?!-)/, '+'),
    };
  }
  const evalIds = [...new Set(runs.map((run) => run.eval_id))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
  const counts = configs.map((config) => runs.filter((run) => run.configuration === config).length / evalIds.length);
  return { metadata: { skill_name: skillName || '<skill-name>', skill_path: skillPath || '<path/to/skill>',
    executor_model: '<model-name>', analyzer_model: '<model-name>', timestamp: new Date().toISOString(),
    evals_run: evalIds, runs_per_configuration: counts.every((n) => n === counts[0]) ? counts[0] : 'varies' },
    runs, run_summary: summary, notes: [] };
}

export function markdown(benchmark) {
  const { metadata, run_summary: summary } = benchmark;
  const configs = Object.keys(summary).filter((key) => key !== 'delta');
  const [a, b] = configs;
  const label = (name) => name ? name.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '—';
  const mean = (config, metric) => summary[config]?.[metric]?.mean ?? 0;
  const deviation = (config, metric) => summary[config]?.[metric]?.stddev ?? 0;
  return [`# Skill Benchmark: ${metadata.skill_name}`, '', `**Model**: ${metadata.executor_model}`,
    `**Date**: ${metadata.timestamp}`, `**Evals**: ${metadata.evals_run.join(', ')} (${metadata.runs_per_configuration} runs each per configuration)`,
    '', '## Summary', '', `| Metric | ${label(a)} | ${label(b)} | Delta |`, '|---|---|---|---|',
    `| Pass Rate | ${(mean(a, 'pass_rate') * 100).toFixed(0)}% ± ${(deviation(a, 'pass_rate') * 100).toFixed(0)}% | ${(mean(b, 'pass_rate') * 100).toFixed(0)}% ± ${(deviation(b, 'pass_rate') * 100).toFixed(0)}% | ${summary.delta?.pass_rate ?? '—'} |`,
    `| Time | ${mean(a, 'time_seconds').toFixed(1)}s ± ${deviation(a, 'time_seconds').toFixed(1)}s | ${mean(b, 'time_seconds').toFixed(1)}s ± ${deviation(b, 'time_seconds').toFixed(1)}s | ${summary.delta?.time_seconds ?? '—'}s |`,
    `| Tokens | ${mean(a, 'tokens').toFixed(0)} ± ${deviation(a, 'tokens').toFixed(0)} | ${mean(b, 'tokens').toFixed(0)} ± ${deviation(b, 'tokens').toFixed(0)} | ${summary.delta?.tokens ?? '—'} |`,
    ...(benchmark.notes.length ? ['', '## Notes', '', ...benchmark.notes.map((note) => `- ${note}`)] : []), ''].join('\n');
}

export function main(args = process.argv.slice(2)) {
  const [workspace, ...options] = args;
  if (!workspace) throw new Error('Usage: node aggregate_benchmark.mjs <workspace> [--skill-name <name>] [--skill-path <path>] [--output <benchmark.json>]');
  for (let i = 0; i < options.length; i += 2) {
    if (!new Set(['--skill-name', '--skill-path', '--output']).has(options[i]) || !options[i + 1] || options[i + 1].startsWith('--'))
      throw new Error(`Invalid option or missing value: ${options[i]}`);
  }
  const option = (name, fallback) => { const index = options.indexOf(name);
    if (index < 0) return fallback;
    if (!options[index + 1] || options[index + 1].startsWith('--')) throw new Error(`Missing value for ${name}`);
    return options[index + 1]; };
  const result = aggregate(workspace, option('--skill-name', ''), option('--skill-path', ''));
  const output = path.resolve(option('--output', path.join(workspace, 'benchmark.json')));
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
  fs.writeFileSync(output.replace(/\.json$/i, '') + '.md', markdown(result));
  console.log(`Generated: ${output}`);
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
