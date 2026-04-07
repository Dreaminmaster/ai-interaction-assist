import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { analyzeTopicAnswerRouter } from './routes/analyzeTopicAnswer';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'ai-interaction-assist-server' });
});

app.use('/api/analyze-topic-answer', analyzeTopicAnswerRouter);

app.listen(env.port, () => {
  console.log(`AI interaction assist server listening on port ${env.port}`);
});
