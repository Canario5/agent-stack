#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const flags = new Set(process.argv.slice(2));
const scriptDir = path.dirname(fileURLToPath(import.meta.url));

if (!flags.has('--skip-install')) {
  runScript('install-pi.mjs', pickFlags('--dry-run', '--devcontainer'));
}

runScript('sync-pi-config.mjs', pickFlags('--dry-run', '--devcontainer'));
if (flags.has('--devcontainer')) {
  runScript('install-devcontainer-update-command.mjs', pickFlags('--dry-run', '--devcontainer'));
}
console.log('sync-pi complete');

function pickFlags(...allowedFlags) {
  return allowedFlags.filter((flag) => flags.has(flag));
}

function runScript(scriptName, scriptFlags) {
  const { status } = spawnSync(process.execPath, [path.join(scriptDir, scriptName), ...scriptFlags], {
    stdio: 'inherit',
  });

  if (status !== 0) process.exit(status ?? 1);
}
