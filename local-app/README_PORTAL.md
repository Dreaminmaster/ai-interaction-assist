# AI Interactive Learning System Local App

English is the default guide here.

Chinese guide:
- See `README_ZH.md`

English guide:
- See `README_EN.md`

Quick start:
- Windows: `start-interactive.bat`
- macOS: `start-interactive.command`
- Linux: `start-interactive.sh`

This starts the current recommended version:
- `src/server.one-click.backup-import.ts`
- `public/index.i18n.html`
- `public/app.i18n.js`

## Full usage flow

1. Start the local app with one of the launchers above.
2. The browser opens automatically to the local web page.
3. Leave the provider on `mock` for the first test.
4. Create a topic in the left panel.
5. Click “Start Session”.
6. The system generates the first round of diagnosis questions.
7. Write your answer in the answer box.
8. Submit the answer.
9. The current session summary updates.
10. The topic profile is updated at the same time.
11. Your data is saved locally to `data/state.json`.
12. You can export a backup JSON file at any time.
13. You can later import a backup JSON file to restore the state.
14. You can switch the interface language between Chinese and English.
15. After the mock flow feels right, switch to `openai-responses` or `oauth-backend`.

## Provider flow

mock:
- No extra setup
- Best for checking whether the interaction style is right

openai-responses:
- Put `OPENAI_API_KEY` into `.env`
- Restart the launcher
- Switch provider in the UI to `openai-responses`

oauth-backend:
- Put `OAUTH_BACKEND_UPSTREAM` into `.env`
- Restart the launcher
- Switch provider in the UI to `oauth-backend`

## What this version already supports

- One-click local launch
- Auto-open browser
- Interactive learning page
- Topic creation and switching
- Session start and answer submission
- Session summary updates
- Topic profile sync
- Local file persistence
- Export backup
- Import restore
- Chinese / English switching

## Most important files now

- `start-interactive.bat`
- `start-interactive.command`
- `start-interactive.sh`
- `src/server.one-click.backup-import.ts`
- `public/index.i18n.html`
- `public/app.i18n.js`
