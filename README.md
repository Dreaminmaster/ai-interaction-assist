# AI Interactive Learning System

A one-click local interactive learning web app with topic memory, session flow, local persistence, backup restore, and bilingual UI.

中文说明：
- [查看中文使用说明](local-app/README_ZH.md)

English guide:
- [Read the English guide](local-app/README_EN.md)

---

## Overview

This repository has evolved from an early prompt and protocol concept into a local interactive learning app that can actually be launched and used.

The current recommended version is under:

- `local-app/`

It is designed to support a local-first interactive learning workflow:

- launch locally with one click
- open in your browser automatically
- create learning topics
- guide you through session-based interaction
- save your learning state locally
- export backups and restore them later
- switch between Chinese and English
- switch between different providers

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

This is currently the most complete version in the repository.

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
```

### 2. Start the app

Use one of the launchers:

- `start-interactive.bat`
- `start-interactive.command`
- `start-interactive.sh`

### 3. First launch behavior

On first run, the launcher will:

1. create `.env` from `.env.example` if needed
2. install dependencies if needed
3. start the local server
4. open your browser automatically

### 4. First recommended test

For the first test:

- keep the provider on `mock`
- create a topic
- click **Start Session**
- answer the generated questions
- observe how the session summary and topic profile update

---

## Full Usage Flow

1. Open the `local-app/` folder.
2. Start the app with one of the recommended launchers.
3. If `.env` does not exist yet, it will be prepared automatically from `.env.example`.
4. If dependencies are missing, they will be installed automatically.
5. The local service starts.
6. Your browser opens automatically to the local learning page.
7. For the first run, keep the provider on `mock`.
8. Create a topic in the left panel.
9. Click **Start Session**.
10. The system generates the first round of diagnosis questions.
11. Write your answer in the answer box.
12. Submit the answer.
13. The current session summary updates.
14. The topic profile updates at the same time.
15. Your data is saved locally to:
    - `local-app/data/state.json`
16. You can export a backup JSON file from the page.
17. You can later import a backup JSON file to restore the full learning state.
18. You can switch the interface language between Chinese and English.
19. After the interaction flow feels right, switch to a real provider if needed.

---

## Provider Setup

### mock

No extra setup required.

Use this first to verify that the interaction style and workflow match what you want.

### openai-responses

Put the following into `.env`:

```env
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-5
```

Optional:

```env
OPENAI_BASE_URL=https://api.openai.com/v1
```

Then restart the launcher and switch the provider in the UI to:

```text
openai-responses
```

### oauth-backend

Put the following into `.env`:

```env
OAUTH_BACKEND_UPSTREAM=your_endpoint
```

Then restart the launcher and switch the provider in the UI to:

```text
oauth-backend
```

---

## Project Structure

```text
local-app/
├─ start-interactive.bat
├─ start-interactive.command
├─ start-interactive.sh
├─ README_ZH.md
├─ README_EN.md
├─ src/
│  ├─ server.one-click.backup-import.ts
│  ├─ stateRoutes.ts
│  ├─ exportRoutes.ts
│  ├─ importRoutes.ts
│  ├─ storage.ts
│  ├─ providers.ts
│  └─ config.ts
├─ public/
│  ├─ index.i18n.html
│  ├─ app.i18n.js
│  └─ styles.css
└─ data/
   └─ state.json
```

---

## Recommended Files to Read First

If you only care about the current best version, start here:

- `local-app/start-interactive.bat`
- `local-app/start-interactive.command`
- `local-app/start-interactive.sh`
- `local-app/src/server.one-click.backup-import.ts`
- `local-app/public/index.i18n.html`
- `local-app/public/app.i18n.js`
- `local-app/README_ZH.md`
- `local-app/README_EN.md`

---

## Notes

This repository still contains earlier prototype files and design documents from previous iterations.

If your goal is simply to use the current local interactive app, you can ignore most of the older prototype layers and focus on `local-app/`.

---

## Status

Current focus:

- improve the interactive learning page
- make the workflow feel more natural and less tool-like
- keep local usage simple
- preserve state safely with backup and restore
