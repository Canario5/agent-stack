#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const PI_VERSION = '0.84.2';
const PI_PACKAGE = `@earendil-works/pi-coding-agent@${PI_VERSION}`;

const flags = new Set(process.argv.slice(2));
const dryRun = flags.has('--dry-run');

if (flags.has('--devcontainer')) {
  installInDevcontainer();
} else {
  installOnMachine();
}

function installInDevcontainer() {
  const home = process.env.HOME || fail('HOME is not set; cannot install Pi.');
  const prefix = path.join(home, '.pi');
  const binDir = path.join(prefix, 'bin');
  const env = { PATH: `${binDir}${path.delimiter}${process.env.PATH ?? ''}` };

  if (!commandExists('npm')) fail('npm is required for devcontainer install.');

  if (getInstalledPiVersion(env) === PI_VERSION) {
    console.log(`pi ${PI_VERSION} is already installed; skipping install.`);
    return;
  }

  console.log(`Installing pi ${PI_VERSION} in devcontainer using npm prefix ${prefix}.`);
  ensureDevcontainerPath();
  if (!dryRun) fs.mkdirSync(prefix, { recursive: true });
  run('npm', ['install', '-g', '--prefix', prefix, '--ignore-scripts', PI_PACKAGE], env);
}

function installOnMachine() {
  const installedVersion = getInstalledPiVersion();
  if (installedVersion === PI_VERSION) {
    console.log(`pi ${PI_VERSION} is already installed; skipping install.`);
    return;
  }

  const packageManager = commandExists('pnpm') ? 'pnpm' : commandExists('npm') ? 'npm' : null;
  if (!packageManager) fail('Neither pnpm nor npm is available on PATH.');

  console.log(installedVersion
    ? `pi ${installedVersion} is installed; syncing to ${PI_VERSION}.`
    : `pi is not installed; installing ${PI_VERSION}.`);

  run(packageManager, packageManager === 'pnpm'
    ? ['add', '-g', '--ignore-scripts', PI_PACKAGE]
    : ['install', '-g', '--ignore-scripts', PI_PACKAGE]);
}

function getInstalledPiVersion(extraEnv = {}) {
  const { status, stdout } = spawnCommand('pi', ['--version'], {
    encoding: 'utf8',
    env: { ...process.env, ...extraEnv },
  });

  return status === 0 ? stdout.trim() : null;
}

function commandExists(command) {
  if (dryRun) return true;
  return spawnCommand(command, ['--version'], { stdio: 'ignore' }).status === 0;
}

function ensureDevcontainerPath() {
  const bashrc = path.join(process.env.HOME, '.bashrc');
  const line = 'export PATH="$HOME/.pi/bin:$PATH"';
  const current = fs.existsSync(bashrc) ? fs.readFileSync(bashrc, 'utf8') : '';

  if (current.includes(line)) return;
  if (dryRun) return console.log(`[dry-run] append Pi PATH to ${bashrc}`);

  fs.appendFileSync(bashrc, `${current.endsWith('\n') || current.length === 0 ? '' : '\n'}${line}\n`);
}

function run(command, args, extraEnv = {}) {
  if (dryRun) {
    console.log(`[dry-run] ${command} ${args.join(' ')}`);
    return;
  }

  const { status } = spawnCommand(command, args, {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });

  if (status !== 0) process.exit(status ?? 1);
}

function spawnCommand(command, args, options) {
  const windows = process.platform === 'win32';
  return spawnSync(
    windows ? process.env.ComSpec || 'cmd.exe' : command,
    windows ? ['/d', '/s', '/c', command, ...args] : args,
    options,
  );
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
