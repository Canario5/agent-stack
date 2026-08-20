#!/usr/bin/env node
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const flags = new Set(process.argv.slice(2));
const dryRun = flags.has('--dry-run');
const devcontainer = flags.has('--devcontainer');
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceConfig = path.join(repoRoot, 'mise.toml');
const managedTools = readManagedTools();

validateContextModeVersion();
if (!dryRun && !commandAvailable('mise')) fail(miseInstallHelp());
if (dryRun) {
  console.log(`[dry-run] mise use --global ${managedTools.map(({ name, version }) => `${name}@${version}`).join(' ')}`);
  console.log('[dry-run] mise reshim');
} else {
  run('mise', ['use', '--global', ...managedTools.map(({ name, version }) => `${name}@${version}`)]);
  run('mise', ['reshim']);
}

if (devcontainer) ensureDevcontainerActivation();
else printActivationHelp();

function validateContextModeVersion() {
  const match = fs.readFileSync(sourceConfig, 'utf8').match(/"npm:context-mode"\s*=\s*"([^"]+)"/);
  if (!match) fail('context-mode is missing from mise.toml.');

  for (const file of ['settings.json', 'settings.devcontainer.json']) {
    const settings = JSON.parse(fs.readFileSync(path.join(repoRoot, file), 'utf8'));
    const expected = `npm:context-mode@${match[1]}`;
    if (!settings.packages.some((entry) => entry === expected || entry?.source === expected)) {
      fail(`${file} must use ${expected} to match mise.toml.`);
    }
  }
}

function readManagedTools() {
  let inTools = false;
  const tools = [];

  for (const line of fs.readFileSync(sourceConfig, 'utf8').split(/\r?\n/)) {
    const section = line.match(/^\[([^\]]+)\]\s*$/);
    if (section) {
      inTools = section[1] === 'tools';
      continue;
    }
    if (!inTools || /^\s*(?:#.*)?$/.test(line)) continue;

    const match = line.match(/^\s*(?:"([^"]+)"|([\w-]+))\s*=\s*"([^"]+)"\s*(?:#.*)?$/);
    if (!match) fail(`Unsupported [tools] entry in mise.toml: ${line}`);
    tools.push({ name: match[1] ?? match[2], version: match[3] });
  }

  if (tools.length === 0) fail('mise.toml must declare at least one [tools] entry.');
  return tools;
}


function ensureDevcontainerActivation() {
  const home = os.homedir();
  appendOnce(path.join(home, '.profile'), 'eval "$(mise activate bash --shims)"');
  appendOnce(path.join(home, '.bashrc'), 'eval "$(mise activate bash)"');
  appendOnce(path.join(home, '.bashrc'), 'export PATH="$HOME/.pi/bin:$PATH"');
}

function appendOnce(file, line) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (current.split(/\r?\n/).includes(line)) return;
  if (dryRun) return console.log(`[dry-run] append to ${file}: ${line}`);

  fs.appendFileSync(file, `${current.endsWith('\n') || current.length === 0 ? '' : '\n'}${line}\n`);
}

function printActivationHelp() {
  if (process.platform === 'win32') {
    console.log('Activate Mise in PowerShell so Pi and its tools are on PATH:');
    console.log("  echo '(&mise activate pwsh) | Out-String | Invoke-Expression' >> $PROFILE");
    console.log('For cmd.exe, add %LOCALAPPDATA%\\mise\\shims to your user PATH.');
    return;
  }

  console.log('Activate Mise in your shell so Pi and its tools are on PATH, for example:');
  if (process.platform === 'darwin' || path.basename(process.env.SHELL ?? '') === 'zsh') {
    console.log(`  echo 'eval "$(mise activate zsh)"' >> ~/.zshrc`);
  } else {
    console.log(`  echo 'eval "$(mise activate bash)"' >> ~/.bashrc`);
  }
}


function commandAvailable(command) {
  return spawnSync(command, ['--version'], { stdio: 'ignore' }).status === 0;
}

function run(command, args) {
  const { status, error } = spawnSync(command, args, { cwd: os.homedir(), stdio: 'inherit' });
  if (error) fail(error.message);
  if (status !== 0) process.exit(status ?? 1);
}

function miseInstallHelp() {
  if (process.platform === 'win32') return 'Mise is required. Install it with: winget install --id jdx.mise --exact';
  if (process.platform === 'darwin') return 'Mise is required. Install it with: brew install mise';
  return 'Mise is required. Install it from https://mise.jdx.dev/installing-mise.html';
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
