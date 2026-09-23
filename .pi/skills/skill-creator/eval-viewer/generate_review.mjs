#!/usr/bin/env node
// Embed Pi eval artifacts into Anthropic's review template; optional local feedback server.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const textExtensions = new Set('.txt .md .json .csv .py .js .ts .tsx .jsx .yaml .yml .xml .html .css .sh .rb .go .rs .java .c .cpp .h .hpp .sql .r .toml'.split(' '));
const images = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']);
const mimeTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.pdf': 'application/pdf',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
const skip = new Set(['node_modules', '.git', '__pycache__', 'skill', 'inputs']);
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const exists = (file) => fs.existsSync(file);

function embedFile(file) {
  const name = path.basename(file);
  const ext = path.extname(file).toLowerCase();
  if (textExtensions.has(ext)) return { name, type: 'text', content: fs.readFileSync(file, 'utf8') };
  const b64 = fs.readFileSync(file).toString('base64');
  if (ext === '.xlsx') return { name, type: 'xlsx', data_b64: b64 };
  const mime = mimeTypes[ext] ?? 'application/octet-stream';
  return { name, type: images.has(ext) ? 'image' : ext === '.pdf' ? 'pdf' : 'binary',
    mime, data_uri: `data:${mime};base64,${b64}` };
}

function loadRun(root, dir) {
  let metadata = {};
  for (const candidate of [path.join(dir, 'eval_metadata.json'), path.join(path.dirname(dir), 'eval_metadata.json')]) {
    if (exists(candidate)) { metadata = readJson(candidate); if (metadata.prompt) break; }
  }
  let prompt = metadata.prompt;
  if (!prompt && exists(path.join(dir, 'transcript.md'))) {
    prompt = fs.readFileSync(path.join(dir, 'transcript.md'), 'utf8').match(/## Eval Prompt\n\n([\s\S]*?)(?=\n##|$)/)?.[1]?.trim();
  }
  const outputDir = path.join(dir, 'outputs');
  const outputs = fs.readdirSync(outputDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && !new Set(['transcript.md', 'user_notes.md', 'metrics.json']).has(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name)).map((entry) => embedFile(path.join(outputDir, entry.name)));
  const gradingPath = path.join(dir, 'grading.json');
  return { id: path.relative(root, dir).split(path.sep).join('-'), prompt: prompt || '(No prompt found)',
    eval_id: metadata.eval_id ?? null, outputs, grading: exists(gradingPath) ? readJson(gradingPath) : null };
}

export function findRuns(workspace) {
  const root = path.resolve(workspace);
  const runs = [];
  function walk(dir) {
    if (exists(path.join(dir, 'outputs')) && fs.statSync(path.join(dir, 'outputs')).isDirectory()) {
      runs.push(loadRun(root, dir));
      return;
    }
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && !skip.has(entry.name)) walk(path.join(dir, entry.name));
    }
  }
  walk(root);
  return runs.sort((a, b) => String(a.eval_id ?? '\uffff').localeCompare(String(b.eval_id ?? '\uffff'), undefined, { numeric: true }) || a.id.localeCompare(b.id));
}

export function generateHtml(workspace, skillName, previousWorkspace, benchmarkPath) {
  const runs = findRuns(workspace);
  if (!runs.length) throw new Error(`No runs found in ${workspace}`);
  const previous_feedback = {};
  const previous_outputs = {};
  if (previousWorkspace) {
    const feedbackPath = path.join(previousWorkspace, 'feedback.json');
    if (exists(feedbackPath)) {
      for (const review of readJson(feedbackPath).reviews ?? []) {
        if (typeof review.feedback === 'string' && review.feedback.trim()) previous_feedback[review.run_id] = review.feedback;
      }
    }
    for (const run of findRuns(previousWorkspace)) if (run.outputs.length) previous_outputs[run.id] = run.outputs;
  }
  const embedded = { skill_name: skillName, runs, previous_feedback, previous_outputs };
  if (benchmarkPath && exists(benchmarkPath)) embedded.benchmark = readJson(benchmarkPath);
  const template = fs.readFileSync(path.join(here, 'viewer.html'), 'utf8');
  const marker = '/*__EMBEDDED_DATA__*/';
  if (!template.includes(marker)) throw new Error('Viewer template marker missing');
  // Embedded output can contain </script>; escape it before inserting JSON into an inline script.
  return template.replace(marker, `const EMBEDDED_DATA = ${JSON.stringify(embedded).replace(/</g, '\\u003c')};`);
}

export function serve(workspace, skillName, previousWorkspace, benchmarkPath, port = 3117) {
  const feedbackPath = path.join(workspace, 'feedback.json');
  const server = http.createServer((request, response) => {
    const send = (code, body, type = 'application/json') => { response.writeHead(code, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' }); response.end(body); };
    const host = request.headers.host;
    const authority = `(?:localhost|127\\.0\\.0\\.1):${server.address()?.port}`;
    if (!host || !new RegExp(`^${authority}$`).test(host)) return send(403, '{"error":"Forbidden host"}');
    const origin = request.headers.origin;
    if (origin && !new RegExp(`^http://${authority}$`).test(origin)) return send(403, '{"error":"Forbidden origin"}');
    try {
      if (request.method === 'GET' && (request.url === '/' || request.url === '/index.html'))
        return send(200, generateHtml(workspace, skillName, previousWorkspace, benchmarkPath), 'text/html');
      if (request.url === '/api/feedback' && request.method === 'GET')
        return send(200, exists(feedbackPath) ? fs.readFileSync(feedbackPath, 'utf8') : '{}');
      if (request.url === '/api/feedback' && request.method === 'POST') {
        if (!request.headers['content-type']?.startsWith('application/json')) return send(415, '{"error":"JSON required"}');
        let body = '';
        let tooLarge = false;
        request.on('data', (chunk) => {
          if (tooLarge) return;
          body += chunk;
          if (body.length > 1024 * 1024) { tooLarge = true; send(413, '{"error":"Feedback too large"}'); }
        });
        request.on('end', () => {
          if (tooLarge) return;
          try {
            const data = JSON.parse(body);
            if (!Array.isArray(data.reviews) || data.reviews.some((review) => typeof review.run_id !== 'string' || typeof review.feedback !== 'string'))
              return send(400, '{"error":"Invalid reviews"}');
            const temporary = `${feedbackPath}.tmp`;
            fs.writeFileSync(temporary, `${JSON.stringify(data, null, 2)}\n`);
            fs.renameSync(temporary, feedbackPath);
            send(200, '{"ok":true}');
          } catch (error) { send(400, JSON.stringify({ error: error.message })); }
        });
        return;
      }
      send(404, '{"error":"Not found"}');
    } catch (error) { send(500, JSON.stringify({ error: error.message })); }
  });
  server.listen(port, '127.0.0.1');
  return server;
}

export function main(args = process.argv.slice(2)) {
  const [workspaceArg, ...options] = args;
  if (!workspaceArg) throw new Error('Usage: node generate_review.mjs <workspace> [--skill-name <name>] [--previous-workspace <path>] [--benchmark <path>] [--static <file> | --port <port>]');
  const allowed = new Set(['--skill-name', '--previous-workspace', '--benchmark', '--static', '--port']);
  for (let i = 0; i < options.length; i += 2) {
    if (!allowed.has(options[i]) || !options[i + 1] || options[i + 1].startsWith('--'))
      throw new Error(`Invalid option or missing value: ${options[i]}`);
  }
  const option = (name, fallback) => { const index = options.indexOf(name);
    if (index < 0) return fallback;
    if (!options[index + 1] || options[index + 1].startsWith('--')) throw new Error(`Missing value for ${name}`);
    return options[index + 1]; };
  const workspace = path.resolve(workspaceArg);
  if (!exists(workspace) || !fs.statSync(workspace).isDirectory()) throw new Error(`Workspace not found: ${workspace}`);
  const skillName = option('--skill-name', path.basename(workspace).replace(/-workspace$/, ''));
  const previous = option('--previous-workspace', null);
  const benchmark = option('--benchmark', null);
  const staticPath = option('--static', null);
  if (staticPath) {
    const html = generateHtml(workspace, skillName, previous, benchmark);
    fs.mkdirSync(path.dirname(path.resolve(staticPath)), { recursive: true });
    fs.writeFileSync(staticPath, html);
    console.log(`Static viewer written to: ${path.resolve(staticPath)}`);
  } else {
    const port = Number(option('--port', '3117'));
    if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid port');
    const server = serve(workspace, skillName, previous, benchmark, port);
    server.on('listening', () => console.log(`Eval viewer: http://127.0.0.1:${server.address().port} (Ctrl+C to stop)`));
    server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
