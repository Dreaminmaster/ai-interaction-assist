import { Router } from 'express';
import { readStateFile } from './storage';

export const exportRouter = Router();

exportRouter.get('/export-state', async (_req, res) => {
  try {
    const state = await readStateFile();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="ai-learning-state-${timestamp}.json"`);
    res.send(JSON.stringify(state, null, 2));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to export state';
    res.status(500).json({ error: message });
  }
});
