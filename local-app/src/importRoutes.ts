import { Router } from 'express';
import { writeStateFile } from './storage';
import type { LocalAppState } from './storage';

export const importRouter = Router();

importRouter.post('/import-state', async (req, res) => {
  const body = req.body as LocalAppState;

  if (!body || !Array.isArray(body.topics) || !Array.isArray(body.sessions)) {
    return res.status(400).json({ error: 'Invalid state payload.' });
  }

  try {
    await writeStateFile({
      topics: body.topics,
      sessions: body.sessions,
    });
    return res.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to import state';
    return res.status(500).json({ error: message });
  }
});
