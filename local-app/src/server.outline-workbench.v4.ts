import cors from 'cors';
import express from 'express';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config';
import { exportRouter } from './exportRoutes';
import { followUpRouter } from './followUpRoutes';
import { importRouter } from './importRoutes';
import { outlineRouter } from './outlineRoutes';
import { analyzeTopicAnswerExpanded } from './providers.expanded';
import { stateRouter } from './stateRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.static(publicDir));
app.use('/api', stateRouter);
app.use('/api', exportRouter);
app.use('/api', importRouter);
app.use('/api', outlineRouter);
app.use('/api', followUpRouter);

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'ai-interaction-assist-local-app-outline-workbench-v4' });
});

app.post('/api/analyze-topic-answer', async (req, res) => {
  try {
    const accessToken = req.headers.authorization?.replace(/^Bearer\s+/i, '') ?? null;
    const result = await analyzeTopicAnswerExpanded(req.body, accessToken);
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown local app error';
    res.status(500).json({ error: message });
  }
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.outline-workbench.v4.html'));
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.outline-workbench.v4.html'));
});

app.listen(config.port, async () => {
  const url = `http://127.0.0.1:${config.port}`;
  console.log(`Outline workbench v4 listening at ${url}`);

  if (config.autoOpenBrowser) {
    try {
      await open(url);
    } catch (error) {
      console.warn('Failed to auto-open browser:', error);
    }
  }
});
