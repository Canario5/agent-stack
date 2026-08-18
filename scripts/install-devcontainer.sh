#!/bin/sh
set -eu

if ! command -v mise >/dev/null 2>&1; then
  curl https://mise.run/bash | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

cd "$(dirname "$0")"
exec node sync-pi.mjs --devcontainer
