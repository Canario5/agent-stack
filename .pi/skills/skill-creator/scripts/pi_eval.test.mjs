import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { grade, parseEvents, run } from './pi_eval.mjs';

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
    const python = process.platform === 'win32' ? 'py' : 'python3';
    const aggregate = spawnSync(python, [path.join(runnerDir, 'aggregate_benchmark.py'), workspace, '--skill-name', 'demo'], { encoding: 'utf8' });
    assert.equal(aggregate.status, 0, aggregate.stderr);
    assert.equal(fs.existsSync(path.join(workspace, 'benchmark.json')), true);
    const viewer = spawnSync(python, [path.join(runnerDir, '..', 'eval-viewer/generate_review.py'), workspace, '--skill-name', 'demo', '--benchmark', path.join(workspace, 'benchmark.json'), '--static', path.join(workspace, 'review.html')], { encoding: 'utf8' });
    assert.equal(viewer.status, 0, viewer.stderr);
    assert.equal(fs.existsSync(path.join(workspace, 'review.html')), true);
    assert.throws(() => run([skill, evals, workspace, '--pi', fake]), /already exists/);
    assert.equal(fs.existsSync(path.join(workspace, 'eval-1/with_skill/run-1/grading.json')), false);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
