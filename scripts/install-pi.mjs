#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PI_VERSION = '0.79.1';
const PI_PACKAGE = `@earendil-works/pi-coding-agent@${PI_VERSION}`;
const flags = new Set(process.argv.slice(2));
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = flags.has('--dry-run');
const packageManager = findPackageManager();

installGlobal(PI_PACKAGE);
console.log(`install-pi ${dryRun ? 'dry run ' : ''}complete using ${packageManager}`);

function findPackageManager() {
  return ['pnpm', 'npm'].find(commandExists) ?? fail('Neither pnpm nor npm is available on PATH.');
}

function commandExists(command) {
  if (dryRun) return true;

  const { status } = spawnSync(command, ['--version'], {
    shell: process.platform === 'win32',
    stdio: 'ignore',
  });

  return status === 0;
}

function installGlobal(packageSpec) {
  const args = packageManager === 'pnpm'
    ? ['add', '-g', '--ignore-scripts', packageSpec]
    : ['install', '-g', '--ignore-scripts', packageSpec];

  run(packageManager, args);
}

function run(command, commandArgs) {
  if (dryRun) {
    console.log(`[dry-run] ${[command, ...commandArgs].join(' ')}`);
    return;
  }

  const { status } = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  if (status !== 0) process.exit(status ?? 1);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
