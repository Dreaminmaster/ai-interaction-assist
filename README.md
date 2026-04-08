# AI Interactive Learning System

Chinese version:
- [查看中文说明 / Read Chinese Guide](local-app/README_ZH.md)

English version:
- [Read the English Guide](local-app/README_EN.md)

## What this repository is now

This repository has evolved from an early protocol-style concept into a **one-click local interactive learning web app**.

The current recommended version is under:

- `local-app/`

The current best entry points are:

- Windows: `local-app/start-interactive.bat`
- macOS: `local-app/start-interactive.command`
- Linux: `local-app/start-interactive.sh`

These launchers are intended to run the current recommended stack:

- `local-app/src/server.one-click.backup-import.ts`
- `local-app/public/index.i18n.html`
- `local-app/public/app.i18n.js`

## What this version supports

- One-click local launch
- Auto-open browser
- Interactive learning page
- Topic creation and switching
- Session start and answer submission
- Session summary updates
- Topic profile sync
- Local file persistence to `local-app/data/state.json`
- Export backup
- Import restore
- Chinese / English interface switch
- Switchable providers:
  - `mock`
  - `openai-responses`
  - `oauth-backend`

## Full usage flow

1. Open the `local-app/` folder.
2. Start the app with one of the recommended launchers:
   - `start-interactive.bat`
   - `start-interactive.command`
   - `start-interactive.sh`
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

## Provider usage

### mock
- No extra setup required
- Best for checking whether the interaction style matches what you want

### openai-responses
Put the following into `.env`:

- `OPENAI_API_KEY=your_key`
- optional: `OPENAI_MODEL=gpt-5`
- optional: `OPENAI_BASE_URL=...`

Then restart the launcher and switch the provider in the UI to:

- `openai-responses`

### oauth-backend
Put the following into `.env`:

- `OAUTH_BACKEND_UPSTREAM=your_endpoint`

Then restart the launcher and switch the provider in the UI to:

- `oauth-backend`

## Recommended files to look at

If you only want the current best version, focus on these files:

- `local-app/start-interactive.bat`
- `local-app/start-interactive.command`
- `local-app/start-interactive.sh`
- `local-app/src/server.one-click.backup-import.ts`
- `local-app/public/index.i18n.html`
- `local-app/public/app.i18n.js`
- `local-app/README_ZH.md`
- `local-app/README_EN.md`

## If you only want to use it first

You can ignore most of the earlier prototype files in the repository for now.

The fastest path is:

1. Open `local-app/`
2. Run `start-interactive.*`
3. Keep provider on `mock`
4. Test the full interaction flow
5. Then switch to `openai-responses` or `oauth-backend` later