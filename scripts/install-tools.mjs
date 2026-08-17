#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PI_PACKAGE = '@earendil-works/pi-coding-agent@0.84.2';
const flags = new Set(process.argv.slice(2));
const dryRun = flags.has('--dry-run');
const devcontainer = flags.has('--devcontainer');
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const home = os.homedir();
const prefix = devcontainer ? path.join(home, '.pi') : null;
const env = prefix
  ? { ...process.env, PATH: `${path.join(prefix, 'bin')}${path.delimiter}${process.env.PATH ?? ''}` }
  : process.env;

const settings = JSON.parse(fs.readFileSync(path.join(
  repoRoot,
  devcontainer ? 'settings.devcontainer.json' : 'settings.json',
), 'utf8'));

const requiredTools = [
  { package: PI_PACKAGE, ignoreScripts: true },
  // The same package Pi loads as an extension also provides the MCP CLI.
  { package: npmPackageFromSettings(settings, 'context-mode') },
];

if (!npmAvailable()) fail('npm is required to install tools.');
if (devcontainer) ensureDevcontainerPath();
for (const tool of requiredTools) ensureInstalled(tool);

function ensureInstalled(tool) {
  const prefixArgs = prefix ? ['--prefix', prefix] : [];
  const installed = !dryRun && spawnCommand('npm', [
    'list', '-g', ...prefixArgs, '--depth=0', tool.package,
  ], { stdio: 'ignore', env }).status === 0;

  if (installed) return console.log(`${tool.package} is already installed.`);

  runNpm([
    'install', '-g', ...prefixArgs,
    ...(tool.ignoreScripts ? ['--ignore-scripts'] : []),
    tool.package,
  ]);
}

function npmPackageFromSettings(settings, name) {
  const prefix = `npm:${name}@`;
  const source = settings.packages.find((value) => value.startsWith(prefix));
  return source ? source.slice(4) : fail(`${name} is missing from Pi settings.`);
}

function npmAvailable() {
  if (dryRun) return true;
  return spawnCommand('npm', ['--version'], { stdio: 'ignore' }).status === 0;
}

function ensureDevcontainerPath() {
  const bashrc = path.join(home, '.bashrc');
  const line = 'export PATH="$HOME/.pi/bin:$PATH"';
  const current = fs.existsSync(bashrc) ? fs.readFileSync(bashrc, 'utf8') : '';

  if (current.includes(line)) return;
  if (dryRun) return console.log(`[dry-run] append Pi PATH to ${bashrc}`);

  fs.appendFileSync(bashrc, `${current.endsWith('\n') || current.length === 0 ? '' : '\n'}${line}\n`);
}

function runNpm(args) {
  if (dryRun) return console.log(`[dry-run] npm ${args.join(' ')}`);

  const { status } = spawnCommand('npm', args, { stdio: 'inherit', env });
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
