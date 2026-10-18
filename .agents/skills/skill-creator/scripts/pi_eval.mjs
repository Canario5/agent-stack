#!/usr/bin/env node
// Pi-native candidate/baseline eval runner; no Claude CLI or extra dependencies.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function parseEvents(text, skillFile) {
  const events = text.split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  const assistant = events.filter((e) => e.type === 'message_end' && e.message?.role === 'assistant');
  const answer = (assistant.at(-1)?.message.content ?? [])
    .filter((block) => block.type === 'text').map((block) => block.text ?? '').join('\n');
  const tokens = assistant.reduce((sum, e) => sum + (e.message.usage?.totalTokens ?? 0), 0);
  const skillRead = events.some((e) => e.type === 'tool_execution_start' && e.toolName === 'read' &&
    Object.values(e.args ?? {}).some((value) => typeof value === 'string' && path.resolve(value) === skillFile));
  const error = assistant.some((e) => e.message.stopReason === 'error') ||
    events.some((e) => e.type === 'tool_execution_end' && e.isError);
  return { answer, tokens, skillRead, error };
}

export function grade(answer, assertions = []) {
  return assertions.map((item) => {
    const text = typeof item === 'string' ? item : item.text;
    const passed = answer.includes(text);
    return { text, passed, evidence: passed ? 'Found in answer' : 'Not found in answer' };
  });
}

function runCondition({ pi, skill, test, condition, runDir, model, thinking, timeout }) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-skill-eval-'));
  try {
    for (const file of test.files ?? []) {
      const source = path.resolve(file);
      if (!fs.statSync(source).isFile()) throw new Error(`Input is not a file: ${file}`);
      fs.copyFileSync(source, path.join(cwd, path.basename(source)));
    }
    const args = ['--no-skills', '--no-extensions', '--no-session', '--mode', 'json'];
    if (skill) args.push('--skill', skill);
    if (model) args.push('--model', model);
    if (thinking) args.push('--thinking', thinking);
    args.push(test.prompt);
    const start = Date.now();
    const command = pi.endsWith('.js') || pi.endsWith('.mjs') ? process.execPath : pi;
    const result = spawnSync(command, command === pi ? args : [pi, ...args],
      { cwd, encoding: 'utf8', timeout, maxBuffer: 32 * 1024 * 1024, windowsHide: true });
    const seconds = (Date.now() - start) / 1000;
    fs.mkdirSync(path.join(runDir, 'outputs'), { recursive: true });
    fs.writeFileSync(path.join(runDir, 'eval_metadata.json'), JSON.stringify({ prompt: test.prompt, eval_id: test.id, assertions: test.assertions ?? [] }, null, 2));
    fs.writeFileSync(path.join(runDir, 'events.jsonl'), result.stdout ?? '');
    fs.writeFileSync(path.join(runDir, 'stderr.txt'), result.stderr ?? '');
    if (result.error || result.status !== 0) throw new Error(`${condition}: pi exited ${result.status}: ${result.error?.message ?? (result.stderr ?? '').slice(-500)}`);
    const parsed = parseEvents(result.stdout, skill ? path.join(skill, 'SKILL.md') : '');
    fs.writeFileSync(path.join(runDir, 'transcript.md'), `# Eval prompt\n\n${test.prompt}\n\n# Assistant\n\n${parsed.answer}\n`);
    for (const entry of fs.readdirSync(cwd, { withFileTypes: true })) {
      if (entry.name === 'outputs' || (test.files ?? []).some((file) => path.basename(file) === entry.name)) continue;
      fs.cpSync(path.join(cwd, entry.name), path.join(runDir, 'outputs', entry.name), { recursive: true });
    }
    if (fs.existsSync(path.join(cwd, 'outputs'))) fs.cpSync(path.join(cwd, 'outputs'), path.join(runDir, 'outputs'), { recursive: true });
    fs.writeFileSync(path.join(runDir, 'outputs', 'answer.md'), parsed.answer);
    const expectations = grade(parsed.answer, test.assertions);
    if (expectations.length) {
      const passed = expectations.filter((x) => x.passed).length;
      fs.writeFileSync(path.join(runDir, 'grading.json'), JSON.stringify({
        expectations,
        summary: { passed, failed: expectations.length - passed, total: expectations.length,
          pass_rate: passed / expectations.length },
        timing: { total_tokens: parsed.tokens, total_duration_seconds: seconds },
      }, null, 2));
    }
    const report = { condition, seconds, tokens: parsed.tokens, skillRead: parsed.skillRead, toolError: parsed.error,
      triggerMatched: condition === 'with_skill' && typeof test.should_trigger === 'boolean' ? parsed.skillRead === test.should_trigger : null };
    fs.writeFileSync(path.join(runDir, 'result.json'), JSON.stringify(report, null, 2));
    return report;
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
}

export function run(argv = process.argv.slice(2)) {
  const [skillArg, evalArg, workspaceArg, ...flags] = argv;
  if (!skillArg || !evalArg || !workspaceArg) throw new Error('Usage: node pi_eval.mjs <skill-dir> <evals.json> <new-workspace> [--baseline <old-skill-dir>] [--model <id>] [--thinking <level>] [--pi <executable>] [--timeout <ms>]');
  const option = (key, fallback) => { const i = flags.indexOf(key); if (i < 0) return fallback;
    if (!flags[i + 1] || flags[i + 1].startsWith('--')) throw new Error(`Missing value for ${key}`);
    return flags[i + 1]; };
  const skill = path.resolve(skillArg);
  const baseline = option('--baseline', null);
  if (baseline && path.resolve(baseline) === skill) throw new Error('Baseline must differ from candidate');
  if (process.platform === 'win32' && (option('--pi', 'pi') === 'pi' || option('--pi', 'pi').toLowerCase().endsWith('.cmd'))) throw new Error('On Windows pass the Pi cli.js file via --pi, not a .cmd shim');
  const workspace = path.resolve(workspaceArg);
  const evals = JSON.parse(fs.readFileSync(evalArg, 'utf8'));
  if (!fs.existsSync(path.join(skill, 'SKILL.md'))) throw new Error(`No SKILL.md in ${skill}`);
  if (baseline && !fs.existsSync(path.join(baseline, 'SKILL.md'))) throw new Error(`No baseline SKILL.md in ${baseline}`);
  if (!Array.isArray(evals.evals) || !evals.evals.length) throw new Error('evals.json needs a nonempty evals array');
  if (fs.existsSync(workspace)) throw new Error(`Workspace already exists: ${workspace}`);
  const timeout = Number(option('--timeout', '120000'));
  if (!Number.isSafeInteger(timeout) || timeout < 1000) throw new Error('Invalid timeout');
  fs.mkdirSync(workspace, { recursive: true });
  const reports = [];
  for (const [index, test] of evals.evals.entries()) {
    if (typeof test.prompt !== 'string' || !test.prompt.trim()) throw new Error(`Missing prompt for eval ${index}`);
    const dir = path.join(workspace, `eval-${index}`);
    fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, 'eval_metadata.json'), JSON.stringify({ eval_id: test.id ?? index, prompt: test.prompt, assertions: test.assertions ?? [] }, null, 2));
    for (const [condition, selected] of [['with_skill', skill], [baseline ? 'old_skill' : 'without_skill', baseline && path.resolve(baseline)]]) {
      const report = runCondition({ pi: option('--pi', 'pi'), skill: selected, test, condition,
        runDir: path.join(dir, condition, 'run-1'), model: option('--model', null),
        thinking: option('--thinking', null), timeout });
      reports.push({ eval: test.id ?? index, ...report });
      console.log(JSON.stringify(reports.at(-1)));
    }
  }
  fs.writeFileSync(path.join(workspace, 'results.json'), JSON.stringify(reports, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { run(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
