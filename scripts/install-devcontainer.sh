#!/bin/sh
set -eu

cd "$(dirname "$0")"
exec node sync-pi.mjs --devcontainer
