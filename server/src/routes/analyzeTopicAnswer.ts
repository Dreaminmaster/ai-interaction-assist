import { Router } from 'express';
import { analyzeWithMock } from '../providers/mock';
import { analyzeWithOAuthBackend } from '../providers/oauthBackend';
import { analyzeWithOpenAIResponses } from '../providers/openaiResponses';
import type { AnalyzeTopicAnswerRequest } from '../types/analysis';

export const analyzeTopicAnswerRouter = Router();

analyzeTopicAnswerRouter.post('/', async (req, res) => {
  const body = req.body as AnalyzeTopicAnswerRequest;

  if (!body?.provider || !body?.topic || !body?.session || typeof body?.answer !== 'string') {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  try {
    const accessToken = req.headers.authorization?.replace(/^Bearer\s+/i, '') ?? null;

    const result =
      body.provider === 'openai-responses'
        ? await analyzeWithOpenAIResponses(body)
        : body.provider === 'oauth-backend'
          ? await analyzeWithOAuthBackend(body, accessToken)
          : await analyzeWithMock(body);

    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return res.status(500).json({ error: message });
  }
});
