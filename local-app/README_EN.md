# local-app English README

This is currently the best version in the repository for a one-click local launch experience.

## Recommended entry points
If you want to use it directly, start with:
- Windows: `start-one-click.bat`
- macOS: `start-one-click.command`
- Linux: `start-one-click.sh`

These entry points are intended to run the most complete version:
- `src/server.one-click.backup-import.ts`
- `public/index.i18n.html`
- `public/app.i18n.js`

This version includes:
- Local web interface
- Auto-open browser
- Chinese / English switch
- Export backup
- Import restore
- Local file persistence
- Switchable providers

## Current features
- Create learning topics
- Switch recent topics
- Start a learning session
- Submit an answer and update the current session summary
- Sync the result back to the topic profile
- Persist data locally to `data/state.json`
- Export learning backup
- Import a backup file and restore state
- Chinese / English UI toggle

## Provider notes
### mock
No extra setup required. Best for testing the full flow first.

### openai-responses
Configure these in `.env`:
- `OPENAI_API_KEY`
- optional `OPENAI_MODEL`
- optional `OPENAI_BASE_URL`

### oauth-backend
Configure this in `.env`:
- `OAUTH_BACKEND_UPSTREAM`

## Most important files right now
- `src/server.one-click.backup-import.ts`
- `public/index.i18n.html`
- `public/app.i18n.js`
- `start-one-click.bat`
- `start-one-click.command`
- `start-one-click.sh`

## Suggested first run
Keep the provider on `mock` first, confirm that the interaction flow matches what you want, and then switch to `openai-responses` or `oauth-backend` later.
