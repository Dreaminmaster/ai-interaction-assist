#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
if [ ! -f .env ] && [ -f .env.expanded.example ]; then
  cp .env.expanded.example .env
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Please install Node.js first."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi
echo "Starting outline workbench UI..."
npx tsx watch src/server.outline-workbench.ts
