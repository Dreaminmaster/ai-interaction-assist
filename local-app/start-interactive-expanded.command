#!/bin/bash
cd "$(dirname "$0")"
if [ ! -f .env ] && [ -f .env.expanded.example ]; then
  cp .env.expanded.example .env
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found. Please install Node.js first."
  read -r -p "Press Enter to exit..."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install || {
    echo "Failed to install dependencies."
    read -r -p "Press Enter to exit..."
    exit 1
  }
fi
echo "Starting expanded interactive local AI learning app..."
npx tsx watch src/server.interactive.expanded.ts
