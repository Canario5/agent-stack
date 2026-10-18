import assert from 'node:assert/strict';
import { once } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { grade, parseEvents, run } from './pi_eval.mjs';
import { aggregate, main as writeBenchmark } from './aggregate_benchmark.mjs';
import { findRuns, generateHtml, main as writeViewer, serve } from '../eval-viewer/generate_review.mjs';

const runnerDir = path.dirname(fileURLToPath(import.meta.url));

test('Pi events report reads, tokens and literal assertions', () => {
  const skillFile = path.join(runnerDir, '..', 'SKILL.md');
  const text = [
    JSON.stringify({ type: 'tool_execution_start', toolName: 'read', args: { path: skillFile } }),
    JSON.stringify({ type: 'message_end', message: { role: 'assistant', content: [{ type: 'text', text: 'ready' }], usage: { totalTokens: 12 } } }),
  ].join('\n');
  assert.deepEqual(parseEvents(text, skillFile), { answer: 'ready', tokens: 12, skillRead: true, error: false });
  assert.deepEqual(grade('ready', ['ready', 'missing']).map((x) => x.passed), [true, false]);
});

test('runner produces paired artifacts without a provider', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-eval-test-'));
  try {
    const skill = path.join(dir, 'skill');
    fs.mkdirSync(skill);
    fs.writeFileSync(path.join(skill, 'SKILL.md'), '---\nname: demo\ndescription: demo skill\n---\n');
    const fake = path.join(dir, 'pi.mjs');
    fs.writeFileSync(fake, `const args = process.argv.slice(2);\nconst i = args.indexOf('--skill');\nif (i !== -1) console.log(JSON.stringify({type:'tool_execution_start',toolName:'read',args:{path:args[i+1]+'/SKILL.md'}}));\nconsole.log(JSON.stringify({type:'message_end',message:{role:'assistant',content:[{type:'text',text:i===-1?'baseline':'candidate'}],usage:{totalTokens:5}}}));\n`);
    const evals = path.join(dir, 'evals.json');
    fs.writeFileSync(evals, JSON.stringify({ evals: [{ id: 1, prompt: 'Answer a task', assertions: ['candidate'], should_trigger: true }, { id: 2, prompt: 'Another task', should_trigger: false }] }));
    const workspace = path.join(dir, 'workspace');
    run([skill, evals, workspace, '--pi', fake]);
    const reports = JSON.parse(fs.readFileSync(path.join(workspace, 'results.json'), 'utf8'));
    assert.deepEqual(reports.map((x) => x.skillRead), [true, false, true, false]);
    assert.deepEqual(reports.map((x) => x.triggerMatched), [true, null, false, null]);
    assert.equal(fs.readFileSync(path.join(workspace, 'eval-0/without_skill/run-1/outputs/answer.md'), 'utf8'), 'baseline');
    assert.equal(fs.existsSync(path.join(workspace, 'eval-1/with_skill/run-1/grading.json')), false);
    assert.throws(() => aggregate(workspace, 'demo'), /Missing grading.json/);
    for (const [condition, passed] of [['with_skill', 1], ['without_skill', 0]]) {
      const runDir = path.join(workspace, 'eval-1', condition, 'run-1');
      fs.writeFileSync(path.join(runDir, 'grading.json'), JSON.stringify({
        expectations: [{ text: 'manual quality check', passed: Boolean(passed), evidence: 'Reviewed' }],
        summary: { passed, failed: 1 - passed, total: 1, pass_rate: passed },
      }));
    }
    const benchmark = aggregate(workspace, 'demo');
    assert.equal(benchmark.run_summary.delta.pass_rate, '+1.00');
    assert.equal(benchmark.metadata.runs_per_configuration, 1);
    writeBenchmark([workspace, '--skill-name', 'demo']);
    assert.throws(() => writeBenchmark([workspace, '--unknown', 'value']), /Invalid option/);
    assert.equal(fs.existsSync(path.join(workspace, 'benchmark.md')), true);
    const htmlPath = path.join(workspace, 'review.html');
    writeViewer([workspace, '--skill-name', 'demo', '--benchmark', path.join(workspace, 'benchmark.json'), '--static', htmlPath]);
    assert.throws(() => writeViewer([workspace, '--static']), /Invalid option/);
    assert.equal(findRuns(workspace).length, 4);
    assert.match(fs.readFileSync(htmlPath, 'utf8'), /const EMBEDDED_DATA =/);
    assert.throws(() => run([skill, evals, workspace, '--pi', fake]), /already exists/);
    for (const evalName of ['eval-0', 'eval-1']) {
      fs.renameSync(path.join(workspace, evalName, 'without_skill'), path.join(workspace, evalName, 'old_skill'));
    }
    assert.equal(aggregate(workspace, 'demo').run_summary.delta.pass_rate, '+1.00');
    fs.rmSync(path.join(workspace, 'eval-1/old_skill'), { recursive: true });
    assert.throws(() => aggregate(workspace, 'demo'), /Incomplete or unbalanced/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('viewer embeds previous feedback safely and serves local review feedback', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-review-test-'));
  let server;
  try {
    const prior = path.join(dir, 'prior');
    const current = path.join(dir, 'current');
    for (const root of [prior, current]) {
      const runDir = path.join(root, 'eval-0', 'with_skill', 'run-1');
      fs.mkdirSync(path.join(runDir, 'outputs'), { recursive: true });
      fs.writeFileSync(path.join(runDir, 'eval_metadata.json'), JSON.stringify({ eval_id: 0, prompt: 'Review output' }));
      fs.writeFileSync(path.join(runDir, 'outputs', 'answer.md'), '</script><script>alert(1)</script>');
      fs.writeFileSync(path.join(runDir, 'outputs', 'chart.png'), Buffer.from([137, 80, 78, 71]));
    }
    fs.writeFileSync(path.join(prior, 'feedback.json'), JSON.stringify({ reviews: [{ run_id: 'eval-0-with_skill-run-1', feedback: 'Prior feedback' }] }));
    const html = generateHtml(current, 'demo', prior);
    assert.match(html, /\\u003c\/script>/);
    assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
    assert.match(html, /Prior feedback/);
    assert.match(html, /data:image\/png;base64,/);
    server = serve(current, 'demo', prior, null, 0);
    await once(server, 'listening');
    const base = `http://127.0.0.1:${server.address().port}`;
    const page = await fetch(base);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /Review output/);
    const rejected = await fetch(`${base}/api/feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://evil.example' }, body: '{"reviews":[]}' });
    assert.equal(rejected.status, 403);
    const invalid = await fetch(`${base}/api/feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"reviews":null}' });
    assert.equal(invalid.status, 400);
    const feedback = { reviews: [{ run_id: 'eval-0-with_skill-run-1', feedback: 'Good', timestamp: 'today' }], status: 'complete' };
    const saved = await fetch(`${base}/api/feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(feedback) });
    assert.equal(saved.status, 200);
    assert.deepEqual(await (await fetch(`${base}/api/feedback`)).json(), feedback);
    feedback.reviews[0].feedback = 'Updated';
    const updated = await fetch(`${base}/api/feedback`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(feedback) });
    assert.equal(updated.status, 200);
    assert.deepEqual(await (await fetch(`${base}/api/feedback`)).json(), feedback);
  } finally {
    if (server) await new Promise((resolve) => server.close(resolve));
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
