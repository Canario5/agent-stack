## Mise

Repository: https://github.com/jdx/mise  
Docs: https://mise.jdx.dev/

### Purpose in this stack

Mise installs and pins executable developer tools across Windows, macOS, Linux, and devcontainers. It does not replace npm/pnpm project dependencies or Pi's settings/package loader.

`mise.toml` is the tracked source of truth for:

- the Pi CLI
- the `context-mode` MCP CLI
- OpenSpec
- hashline helper CLIs (`ast-grep`, Nu, `fd`, difftastic, ShellCheck, and `yq`)

`scripts/sync-pi.mjs` applies the `[tools]` entries from tracked `mise.toml` with `mise use --global`, then syncs Pi settings, MCP config, and skills. It updates only tools declared by this stack. Use `mise current` to see the versions currently selected for these tools, and `mise cfg` to inspect the active configuration. The usual global config path is platform- and environment-dependent.

### Install Mise once

Windows:

```powershell
winget install --id jdx.mise --exact
```

macOS:

```bash
brew install mise
```

Linux and other methods: follow the [official installation guide](https://mise.jdx.dev/installing-mise.html).

The stack deliberately does not install its own package manager. If Mise is absent, the sync command stops with installation guidance.
Mise itself is the bootstrap exception: this repository and Renovate do not manage its version. Update it through Winget, Homebrew, the devcontainer feature, or the installation method you chose.


### Activate the tools

**Important:** activation is required after installing with Mise. `mise install` downloads the pinned tools, but does not automatically add their executable directories to your shell's `PATH`! Run the activation command below once, then restart the terminal.

PowerShell:

```powershell
echo '(&mise activate pwsh) | Out-String | Invoke-Expression' >> $PROFILE
```

Bash:

```bash
echo 'eval "$(mise activate bash)"' >> ~/.bashrc
```

Zsh (the macOS default):

```zsh
echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
```

For `cmd.exe` or non-interactive launchers on Windows, add `%LOCALAPPDATA%\mise\shims` to the user `PATH`. Devcontainer setup configures Bash activation automatically.

After activation, `pi`, `openspec`, `difft`, `nu`, and the other managed commands work from any repository.

Run `mise current` again after activation if you want to verify the selected tool versions.

