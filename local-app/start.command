#!/bin/bash
cd "$(dirname "$0")"
if [ ! -f .env ]; then
  cp .env.example .env
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
echo "Starting local AI learning app..."
npm run dev
