#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const flags = new Set(process.argv.slice(2));
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const agentDir = path.join(os.homedir(), '.pi', 'agent');
const dryRun = flags.has('--dry-run');

const repoSettingsFile = flags.has('--devcontainer')
  ? repoPath('settings.devcontainer.json')
  : repoPath('settings.json');

const settings = mergeJson(
  readJson(repoSettingsFile),
  readJson(path.join(agentDir, 'settings.local.json')),
);

write(path.join(agentDir, 'settings.json'), `${JSON.stringify(settings, null, 2)}\n`);
write(path.join(agentDir, 'mcp.json'), fs.readFileSync(repoPath('mcp.json'), 'utf8'));
mirrorDirectory(repoPath('.pi/skills'), path.join(agentDir, 'skills'));
write(path.join(agentDir, 'extensions', 'preset.ts'), fs.readFileSync(repoPath('extensions/preset.ts'), 'utf8'));
write(path.join(agentDir, 'hindsight.jsonc'), fs.readFileSync(repoPath('hindsight.jsonc'), 'utf8'));
write(path.join(agentDir, 'presets.json'), fs.readFileSync(repoPath('presets.json'), 'utf8'));

console.log(`sync-pi-config ${dryRun ? 'dry run ' : ''}complete`);

function repoPath(...segments) {
  return path.join(repoRoot, ...segments);
}

function readJson(file) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

function write(file, text) {
  if (dryRun) return console.log(`[dry-run] write ${file}`);

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function mirrorDirectory(source, target) {
  if (!fs.existsSync(source)) return;
  if (dryRun) return console.log(`[dry-run] mirror ${source} -> ${target}`);

  const staging = `${target}.tmp`;
  // Preserve active skills if copying fails.
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.rmSync(staging, { recursive: true, force: true });
  fs.cpSync(source, staging, { recursive: true, force: true, dereference: true });
  fs.rmSync(target, { recursive: true, force: true });
  fs.renameSync(staging, target);
}

function mergeJson(...objects) {
  return objects.reduce((merged, object) => {
    for (const [key, value] of Object.entries(object)) {
      if (!key.startsWith('//')) merged[key] = mergeValue(merged[key], value);
    }
    return merged;
  }, {});
}

function mergeValue(left, right) {
  if (Array.isArray(left) && Array.isArray(right)) return [...new Set([...left, ...right])];
  if (isPlainObject(left) && isPlainObject(right)) return mergeJson(left, right);
  return right;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}
