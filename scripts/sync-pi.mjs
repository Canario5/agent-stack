#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const flags = new Set(process.argv.slice(2));
const scriptDir = path.dirname(fileURLToPath(import.meta.url));

if (flags.has('--help') || flags.has('-h')) {
  console.log('Usage: node scripts/sync-pi.mjs [--dry-run] [--devcontainer] [--skip-install]');
  process.exit(0);
}

if (!flags.has('--skip-install')) {
  runScript('install-pi.mjs', pickFlags('--dry-run', '--devcontainer'));
}

runScript('sync-pi-config.mjs', pickFlags('--dry-run', '--devcontainer'));
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
