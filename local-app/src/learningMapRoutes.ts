import { Router } from 'express';
import { generateLearningMap } from './learningMap';

export const learningMapRouter = Router();

learningMapRouter.post('/learning-map', async (req, res) => {
  try {
    const result = await generateLearningMap(req.body);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate learning map';
    res.status(500).json({ error: message });
  }
});
