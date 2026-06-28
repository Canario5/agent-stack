#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const flags = new Set(process.argv.slice(2));
const dryRun = flags.has('--dry-run');
const devcontainer = flags.has('--devcontainer');
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const binDir = path.join(os.homedir(), '.pi', 'bin');
const commandPath = path.join(binDir, 'update-pi-stack');

const script = `#!/usr/bin/env sh
set -eu
cd ${shellQuote(repoRoot)}
git pull --ff-only
node scripts/sync-pi.mjs${devcontainer ? ' --devcontainer' : ''}
`;

if (dryRun) {
  console.log(`[dry-run] write ${commandPath}`);
  if (devcontainer) console.log(`[dry-run] ensure ~/.pi/bin is on PATH`);
  process.exit(0);
}

fs.mkdirSync(binDir, { recursive: true });
fs.writeFileSync(commandPath, script, { mode: 0o755 });
fs.chmodSync(commandPath, 0o755);

if (devcontainer) ensureDevcontainerPath();
console.log(`installed update-pi-stack at ${commandPath}`);

function ensureDevcontainerPath() {
  const bashrc = path.join(os.homedir(), '.bashrc');
  const line = 'export PATH="$HOME/.pi/bin:$PATH"';
  const current = fs.existsSync(bashrc) ? fs.readFileSync(bashrc, 'utf8') : '';

  if (!current.includes(line)) {
    fs.appendFileSync(bashrc, `${current.endsWith('\n') || current.length === 0 ? '' : '\n'}${line}\n`);
  }
}

function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}
