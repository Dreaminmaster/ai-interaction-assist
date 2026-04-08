# AI Interactive Learning System

A one-click local interactive learning web app with topic memory, session flow, local persistence, backup restore, and bilingual UI.

中文说明：
- [查看中文使用说明](local-app/README_ZH.md)

English guide:
- [Read the English guide](local-app/README_EN.md)

---

## Overview

This project is no longer just an idea or a prompt protocol.

It now includes a **local interactive learning app** that can:

- launch locally with one click
- open in your browser automatically
- let you create learning topics
- guide you through session-based interaction
- save your learning state locally
- export backups and restore them later
- switch between Chinese and English
- switch between different providers

The current recommended app lives in:

- `local-app/`

---

## Current Recommended Entry

Use the interactive version under `local-app/`.

### Launchers

- **Windows**: `local-app/start-interactive.bat`
- **macOS**: `local-app/start-interactive.command`
- **Linux**: `local-app/start-interactive.sh`

### Main runtime files

- `local-app/src/server.one-click.backup-import.ts`
- `local-app/public/index.i18n.html`
- `local-app/public/app.i18n.js`

This is the most complete version right now.

---

## Features

### Interactive learning flow
- create and switch topics
- start a learning session
- answer diagnosis questions
- update the current session summary
- sync results back to the topic profile

### Local-first usage
- one-click local launch
- browser opens automatically
- local file persistence
- state saved to `local-app/data/state.json`

### Backup and restore
- export learning state as a JSON backup
- import a backup file to restore topics and sessions

### Bilingual UI
- Chinese / English language switch directly in the page

### Provider switching
- `mock`
- `openai-responses`
- `oauth-backend`

---

## Quick Start

### 1. Open the app folder

Go to:

```text
local-app/