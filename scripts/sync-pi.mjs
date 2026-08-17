#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const flags = new Set(process.argv.slice(2));
const dryRun = flags.has('--dry-run');
const devcontainer = flags.has('--devcontainer');
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const childFlags = ['--dry-run', '--devcontainer'].filter((flag) => flags.has(flag));

if (!flags.has('--skip-install')) runScript('install-tools.mjs');
runScript('sync-pi-config.mjs');
if (devcontainer) installUpdateCommand();
console.log('sync-pi complete');

function runScript(scriptName) {
  const { status } = spawnSync(process.execPath, [path.join(scriptDir, scriptName), ...childFlags], {
    stdio: 'inherit',
  });
  if (status !== 0) process.exit(status ?? 1);
}

function installUpdateCommand() {
  const commandPath = path.join(os.homedir(), '.pi', 'bin', 'update-pi-stack');
  const script = `#!/usr/bin/env sh
set -eu
cd ${shellQuote(repoRoot)}
git pull --ff-only
node scripts/sync-pi.mjs --devcontainer
`;

  if (dryRun) return console.log(`[dry-run] write ${commandPath}`);

  fs.mkdirSync(path.dirname(commandPath), { recursive: true });
  fs.writeFileSync(commandPath, script, { mode: 0o755 });
  fs.chmodSync(commandPath, 0o755);
  console.log(`installed update-pi-stack at ${commandPath}`);
}

function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}
