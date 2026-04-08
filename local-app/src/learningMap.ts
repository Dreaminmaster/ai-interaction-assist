import { config } from './config';
import type { SessionPayload, TopicPayload } from './providers.expanded';

export interface LearningMapNode {
  id: string;
  stage: string;
  title: string;
  description: string;
  state: 'done' | 'active' | 'idle';
}

export interface LearningMapResult {
  title: string;
  summary: string;
  nodes: LearningMapNode[];
}

export interface LearningMapRequest {
  provider: 'mock' | 'openai-responses' | 'oauth-backend' | 'local-openai-compatible';
  topic: TopicPayload;
  session?: SessionPayload | null;
}

function buildMockLearningMap(input: LearningMapRequest): LearningMapResult {
  const weakPoints = input.session?.weakPoints?.length
    ? input.session.weakPoints
    : input.topic.weakPoints || [];
  const masteredCount = input.session?.masteredPoints?.length || 0;

  const nodes: LearningMapNode[] = [
    {
      id: 'foundation',
      stage: 'Foundation',
      title: input.topic.title,
      description: '先知道这个主题是什么、在哪些地方会出现，以及它解决什么问题。',
      state: masteredCount > 0 ? 'done' : 'active',
    },
    {
      id: 'understanding',
      stage: 'Understanding',
      title: weakPoints[0] || '核心理解',
      description: weakPoints[0]
        ? `优先围绕“${weakPoints[0]}”继续解释和追问。`
        : '围绕当前主题最关键的原理和关系继续推进。',
      state: weakPoints.length > 0 ? 'active' : masteredCount > 1 ? 'done' : 'idle',
    },
    {
      id: 'application',
      stage: 'Application',
      title: '应用举例',
      description: '把这个主题放进一个例子、题目或者项目场景中。',
      state: masteredCount > 1 ? 'done' : 'idle',
    },
    {
      id: 'output',
      stage: 'Output',
      title: '输出表达',
      description: '能用自己的话讲清楚原理、关系和为什么。',
      state: masteredCount > 2 ? 'done' : 'idle',
    },
  ];

  return {
    title: `${input.topic.title} Learning Map`,
    summary: `已为“${input.topic.title}”生成当前学习地图。`,
    nodes,
  };
}

async function generateCompatibleLearningMap(input: {
  baseUrl: string;
  apiKey?: string;
  model: string;
  topic: TopicPayload;
  session?: SessionPayload | null;
}): Promise<LearningMapResult> {
  const prompt = [
    '你是交互式学习系统中的学习地图生成器。',
    '请根据主题和当前会话，返回结构化 JSON。',
    '必须包含字段：title、summary、nodes。',
    'nodes 数组中的每一项必须包含：id、stage、title、description、state。',
    'state 只能是 done、active、idle。',
    '',
    `主题：${input.topic.title}`,
    `学习目标：${input.topic.goal}`,
    `当前阶段：${input.topic.currentStage}`,
    `当前状态：${input.topic.status}`,
    `薄弱点：${(input.session?.weakPoints || input.topic.weakPoints || []).join('、') || '无'}`,
    `已掌握点：${(input.session?.masteredPoints || []).join('、') || '无'}`,
  ].join('\n');

  const response = await fetch(`${input.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(input.apiKey ? { Authorization: `Bearer ${input.apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: input.model,
      messages: [
        { role: 'system', content: '请只返回 JSON，不要包含额外说明。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Learning map compatible error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Learning map compatible response missing message content.');
  }

  return JSON.parse(content) as LearningMapResult;
}

export async function generateLearningMap(input: LearningMapRequest): Promise<LearningMapResult> {
  if (input.provider === 'mock') return buildMockLearningMap(input);

  if (input.provider === 'openai-responses') {
    if (!config.openAIApiKey) throw new Error('OPENAI_API_KEY is missing.');
    return generateCompatibleLearningMap({
      baseUrl: config.openAIBaseUrl,
      apiKey: config.openAIApiKey,
      model: config.openAIModel,
      topic: input.topic,
      session: input.session,
    });
  }

  if (input.provider === 'local-openai-compatible') {
    return generateCompatibleLearningMap({
      baseUrl: process.env.LOCAL_MODEL_BASE_URL || 'http://127.0.0.1:1234/v1',
      apiKey: process.env.LOCAL_MODEL_API_KEY || '',
      model: process.env.LOCAL_MODEL_NAME || 'local-model',
      topic: input.topic,
      session: input.session,
    });
  }

  if (input.provider === 'oauth-backend') {
    if (!config.oauthBackendUpstream) throw new Error('OAUTH_BACKEND_UPSTREAM is missing.');
    const response = await fetch(`${config.oauthBackendUpstream.replace(/\/$/, '')}/learning-map`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: input.topic, session: input.session }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Learning map oauth backend error: ${response.status} ${errorText}`);
    }
    return (await response.json()) as LearningMapResult;
  }

  return buildMockLearningMap(input);
}
