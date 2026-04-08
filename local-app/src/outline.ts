import { config } from './config';
import type { SessionPayload, TopicPayload } from './providers.expanded';

export interface OutlineItem {
  id: string;
  title: string;
  summary: string;
  state: 'done' | 'active' | 'idle';
  children?: OutlineItem[];
}

export interface OutlineResult {
  title: string;
  summary: string;
  items: OutlineItem[];
}

export interface OutlineRequest {
  provider: 'mock' | 'openai-responses' | 'oauth-backend' | 'local-openai-compatible';
  topic: TopicPayload;
  session?: SessionPayload | null;
}

function buildMockOutline(input: OutlineRequest): OutlineResult {
  const weak = input.session?.weakPoints?.[0] || input.topic.weakPoints?.[0] || '核心理解';
  const masteredCount = input.session?.masteredPoints?.length || 0;

  const items: OutlineItem[] = [
    {
      id: 'chapter-1',
      title: '一、先建立整体认识',
      summary: '知道这个主题是什么、常见在哪里、它解决什么问题。',
      state: masteredCount > 0 ? 'done' : 'active',
      children: [
        {
          id: 'section-1-1',
          title: `${input.topic.title} 是什么`,
          summary: '先用通俗的话说明这个主题的定义与作用。',
          state: masteredCount > 0 ? 'done' : 'active',
        },
        {
          id: 'section-1-2',
          title: '它常出现在哪些场景',
          summary: '把主题放进真实场景里理解，而不是只记定义。',
          state: masteredCount > 1 ? 'done' : 'idle',
        },
      ],
    },
    {
      id: 'chapter-2',
      title: '二、抓当前最关键的小节',
      summary: '围绕当前薄弱点推进，不平均用力。',
      state: 'active',
      children: [
        {
          id: 'section-2-1',
          title: weak,
          summary: `当前系统判断最应该先补的是“${weak}”。`,
          state: 'active',
        },
      ],
    },
    {
      id: 'chapter-3',
      title: '三、做一个例子或应用',
      summary: '把当前理解放进一个例子、题目或项目片段里。',
      state: masteredCount > 1 ? 'done' : 'idle',
      children: [
        {
          id: 'section-3-1',
          title: '例子与应用',
          summary: '通过具体例子判断自己是否真的懂了。',
          state: masteredCount > 1 ? 'done' : 'idle',
        },
      ],
    },
    {
      id: 'chapter-4',
      title: '四、输出表达与复述',
      summary: '能用自己的话讲出来，才算真正掌握。',
      state: masteredCount > 2 ? 'done' : 'idle',
      children: [
        {
          id: 'section-4-1',
          title: '复述当前主题',
          summary: '讲清楚原理、关系和为什么。',
          state: masteredCount > 2 ? 'done' : 'idle',
        },
      ],
    },
  ];

  return {
    title: `${input.topic.title} 学习大纲`,
    summary: `已根据“${input.topic.title}”生成目录驱动的学习大纲。`,
    items,
  };
}

async function generateCompatibleOutline(input: {
  baseUrl: string;
  apiKey?: string;
  model: string;
  topic: TopicPayload;
  session?: SessionPayload | null;
}): Promise<OutlineResult> {
  const prompt = [
    '你是交互式学习系统中的学习大纲生成器。',
    '请根据主题和当前会话，返回结构化 JSON。',
    '必须包含字段：title、summary、items。',
    'items 是树形数组，每一项必须包含：id、title、summary、state。children 可选。',
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
    throw new Error(`Outline compatible error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Outline compatible response missing message content.');
  }

  return JSON.parse(content) as OutlineResult;
}

export async function generateOutline(input: OutlineRequest): Promise<OutlineResult> {
  if (input.provider === 'mock') return buildMockOutline(input);

  if (input.provider === 'openai-responses') {
    if (!config.openAIApiKey) throw new Error('OPENAI_API_KEY is missing.');
    return generateCompatibleOutline({
      baseUrl: config.openAIBaseUrl,
      apiKey: config.openAIApiKey,
      model: config.openAIModel,
      topic: input.topic,
      session: input.session,
    });
  }

  if (input.provider === 'local-openai-compatible') {
    return generateCompatibleOutline({
      baseUrl: process.env.LOCAL_MODEL_BASE_URL || 'http://127.0.0.1:1234/v1',
      apiKey: process.env.LOCAL_MODEL_API_KEY || '',
      model: process.env.LOCAL_MODEL_NAME || 'local-model',
      topic: input.topic,
      session: input.session,
    });
  }

  if (input.provider === 'oauth-backend') {
    if (!config.oauthBackendUpstream) throw new Error('OAUTH_BACKEND_UPSTREAM is missing.');
    const response = await fetch(`${config.oauthBackendUpstream.replace(/\/$/, '')}/outline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: input.topic, session: input.session }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Outline oauth backend error: ${response.status} ${errorText}`);
    }
    return (await response.json()) as OutlineResult;
  }

  return buildMockOutline(input);
}
