#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PI_VERSION = '0.79.1';
const PI_PACKAGE = `@earendil-works/pi-coding-agent@${PI_VERSION}`;
const flags = new Set(process.argv.slice(2));
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dryRun = flags.has('--dry-run');
const devcontainer = flags.has('--devcontainer');
const installedPiVersion = getInstalledPiVersion();

if (installedPiVersion === PI_VERSION) {
  console.log(`pi ${PI_VERSION} is already installed; skipping install.`);
  process.exit(0);
}

const installMessage = installedPiVersion
  ? `pi ${installedPiVersion} is installed; syncing to ${PI_VERSION}.`
  : `pi is not installed; installing ${PI_VERSION}.`;
console.log(installMessage);

if (devcontainer) {
  installInDevcontainer(PI_PACKAGE);
  console.log(`install-pi ${dryRun ? 'dry run ' : ''}complete using npm user prefix`);
  process.exit(0);
}

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

function getInstalledPiVersion() {
  const { status, stdout } = spawnSync('pi', ['--version'], {
    shell: process.platform === 'win32',
    encoding: 'utf8',
  });

  if (status !== 0) return null;

  return stdout.trim() || null;
}

function installGlobal(packageSpec) {
  const args = packageManager === 'pnpm'
    ? ['add', '-g', '--ignore-scripts', packageSpec]
    : ['install', '-g', '--ignore-scripts', packageSpec];

  run(packageManager, args);
}

function installInDevcontainer(packageSpec) {
  if (!commandExists('npm')) fail('npm is required to install Pi in a devcontainer.');

  const home = process.env.HOME;
  if (!home) fail('HOME is not set; cannot install Pi in a devcontainer.');

  const prefix = process.env.PI_NPM_PREFIX || path.join(home, '.local');

  if (dryRun) {
    console.log(`[dry-run] mkdir -p ${prefix}`);
    console.log(`[dry-run] npm install -g --prefix ${prefix} --ignore-scripts ${packageSpec}`);
    return;
  }

  fs.mkdirSync(prefix, { recursive: true });
  run('npm', ['install', '-g', '--prefix', prefix, '--ignore-scripts', packageSpec]);
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
