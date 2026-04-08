import { Router } from 'express';
import { generateFollowUpTurn } from './followUp';

export const followUpRouter = Router();

followUpRouter.post('/follow-up', async (req, res) => {
  try {
    const result = await generateFollowUpTurn(req.body);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate follow-up';
    res.status(500).json({ error: message });
  }
});
