import { config } from './config';
import type { SessionPayload, TopicPayload } from './providers.expanded';

export interface FollowUpTurn {
  question: string;
  reason: string;
  doneWhen: string;
}

export interface FollowUpRequest {
  provider: 'mock' | 'openai-responses' | 'oauth-backend' | 'local-openai-compatible';
  topic: TopicPayload;
  session?: SessionPayload | null;
  answer?: string;
}

function buildMockFollowUp(input: FollowUpRequest): FollowUpTurn {
  const weak = input.session?.weakPoints?.[0] || input.topic.weakPoints?.[0];
  if (weak) {
    return {
      question: `请你先只围绕“${weak}”解释一遍，不要扩展到其他内容。`,
      reason: `系统判断你当前最应该先补的是“${weak}”，所以先缩小范围，单点突破。`,
      doneWhen: `当你能用自己的话解释“${weak}”，并举出一个简单例子时，这一轮就算完成。`,
    };
  }

  return {
    question: `请你用自己的话总结“${input.topic.title}”最核心的一点是什么。`,
    reason: `当前没有明确薄弱点，所以先确认你是否真的抓住了主题核心。`,
    doneWhen: `当你能不用照搬定义，也能把核心意思讲清楚时，这一轮就算完成。`,
  };
}

async function generateCompatibleFollowUp(input: {
  baseUrl: string;
  apiKey?: string;
  model: string;
  topic: TopicPayload;
  session?: SessionPayload | null;
  answer?: string;
}): Promise<FollowUpTurn> {
  const prompt = [
    '你是交互式学习系统中的连续追问生成器。',
    '请根据主题、当前会话和上一轮回答，返回结构化 JSON。',
    '必须包含字段：question、reason、doneWhen。',
    '',
    `主题：${input.topic.title}`,
    `目标：${input.topic.goal}`,
    `当前阶段：${input.topic.currentStage}`,
    `薄弱点：${(input.session?.weakPoints || input.topic.weakPoints || []).join('、') || '无'}`,
    `上一轮总结：${input.session?.summary || '无'}`,
    `上一轮回答：${input.answer || '无'}`,
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
    throw new Error(`Follow-up compatible error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Follow-up compatible response missing message content.');
  }

  return JSON.parse(content) as FollowUpTurn;
}

export async function generateFollowUpTurn(input: FollowUpRequest): Promise<FollowUpTurn> {
  if (input.provider === 'mock') return buildMockFollowUp(input);

  if (input.provider === 'openai-responses') {
    if (!config.openAIApiKey) throw new Error('OPENAI_API_KEY is missing.');
    return generateCompatibleFollowUp({
      baseUrl: config.openAIBaseUrl,
      apiKey: config.openAIApiKey,
      model: config.openAIModel,
      topic: input.topic,
      session: input.session,
      answer: input.answer,
    });
  }

  if (input.provider === 'local-openai-compatible') {
    return generateCompatibleFollowUp({
      baseUrl: process.env.LOCAL_MODEL_BASE_URL || 'http://127.0.0.1:1234/v1',
      apiKey: process.env.LOCAL_MODEL_API_KEY || '',
      model: process.env.LOCAL_MODEL_NAME || 'local-model',
      topic: input.topic,
      session: input.session,
      answer: input.answer,
    });
  }

  if (input.provider === 'oauth-backend') {
    if (!config.oauthBackendUpstream) throw new Error('OAUTH_BACKEND_UPSTREAM is missing.');
    const response = await fetch(`${config.oauthBackendUpstream.replace(/\/$/, '')}/follow-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: input.topic, session: input.session, answer: input.answer }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Follow-up oauth backend error: ${response.status} ${errorText}`);
    }
    return (await response.json()) as FollowUpTurn;
  }

  return buildMockFollowUp(input);
}
