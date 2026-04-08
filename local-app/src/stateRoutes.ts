import { Router } from 'express';
import { readStateFile, writeStateFile } from './storage';
import type { LocalAppState } from './storage';

export const stateRouter = Router();

stateRouter.get('/state', async (_req, res) => {
  try {
    const state = await readStateFile();
    res.json(state);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to read state file';
    res.status(500).json({ error: message });
  }
});

stateRouter.put('/state', async (req, res) => {
  const body = req.body as LocalAppState;
  if (!body || !Array.isArray(body.topics) || !Array.isArray(body.sessions)) {
    return res.status(400).json({ error: 'Invalid state payload.' });
  }

  try {
    await writeStateFile(body);
    res.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to write state file';
    res.status(500).json({ error: message });
  }
});
