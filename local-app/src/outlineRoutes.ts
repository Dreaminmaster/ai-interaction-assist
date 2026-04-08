import { Router } from 'express';
import { generateOutline } from './outline';

export const outlineRouter = Router();

outlineRouter.post('/outline', async (req, res) => {
  try {
    const result = await generateOutline(req.body);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate outline';
    res.status(500).json({ error: message });
  }
});
