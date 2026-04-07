import { config } from './config';

export interface TopicPayload {
  id: string;
  title: string;
  goal: string;
  mode: string;
  currentStage: string;
  status: string;
  lastSummary: string;
  nextEntry: string;
  weakPoints: string[];
  updatedAt: string;
}

export interface SessionPayload {
  id: string;
  topicId: string;
  title: string;
  objective: string;
  summary: string;
  masteredPoints: string[];
  weakPoints: string[];
  reviewQuestions: string[];
  nextEntry: string;
  createdAt: string;
}

export interface AnalyzeTopicAnswerRequest {
  provider: 'mock' | 'openai-responses' | 'oauth-backend';
  topic: TopicPayload;
  session: SessionPayload;
  answer: string;
}

export interface TopicAnalysisResult {
  summary: string;
  masteredPoints: string[];
  weakPoints: string[];
  nextEntry: string;
  reviewQuestions: string[];
  suggestedNextLesson?: string;
}

function analyzeMock(input: AnalyzeTopicAnswerRequest): TopicAnalysisResult {
  const text = input.answer.trim();
  const masteredPoints: string[] = [];
  const weakPoints: string[] = [];

  if (text.length >= 24) {
    masteredPoints.push(`已经开始用自己的话解释“${input.topic.title}”`);
  } else {
    weakPoints.push('回答过短，当前理解可能还不完整');
  }

  if (!/因为|所以|本质|作用|区别/.test(text)) {
    weakPoints.push(`对“${input.topic.title}”的因果关系表达还不够清楚`);
  } else {
    masteredPoints.push(`已经开始表达“${input.topic.title}”中的关系或作用`);
  }

  if (!/例如|比如|像|举个例子/.test(text)) {
    weakPoints.push(`对“${input.topic.title}”还缺少例子或场景说明`);
  } else {
    masteredPoints.push(`已经尝试用例子说明“${input.topic.title}”`);
  }

  const nextEntry = weakPoints.length
    ? `优先继续补“${weakPoints[0]}”，然后再进入下一层学习。`
    : `继续围绕“${input.topic.title}”进入下一层学习，开始生成学习地图。`;

  return {
    summary: `已完成一轮围绕“${input.topic.title}”的学习分析。`,
    masteredPoints,
    weakPoints,
    nextEntry,
    reviewQuestions: [
      `用自己的话复述“${input.topic.title}”这一轮最关键的点。`,
      `这轮里你最容易混淆的地方是什么？`,
      `如果下一轮继续，你应该先补哪个问题？`,
    ],
    suggestedNextLesson: weakPoints[0]
      ? `下一轮先围绕“${weakPoints[0]}”做补充讲解。`
      : `下一轮可以开始为“${input.topic.title}”生成分层学习地图。`,
  };
}

async function analyzeOpenAI(input: AnalyzeTopicAnswerRequest): Promise<TopicAnalysisResult> {
  if (!config.openAIApiKey) {
    throw new Error('OPENAI_API_KEY is missing.');
  }

  const prompt = [
    '你是交互式学习系统中的学习诊断器。',
    '请根据主题、当前会话和用户回答，输出结构化 JSON。',
    '必须包含字段：summary、masteredPoints、weakPoints、nextEntry、reviewQuestions、suggestedNextLesson。',
    '',
    `主题：${input.topic.title}`,
    `主题目标：${input.topic.goal}`,
    `当前阶段：${input.topic.currentStage}`,
    `本轮目标：${input.session.objective}`,
    `用户回答：${input.answer}`,
  ].join('\n');

  const response = await fetch(`${config.openAIBaseUrl}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openAIApiKey}`,
    },
    body: JSON.stringify({
      model: config.openAIModel,
      text: { format: { type: 'json_object' } },
      input: [
        {
          role: 'developer',
          content: [{ type: 'input_text', text: '请只返回 JSON，不要包含额外说明。' }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: prompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI Responses error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as { output_text?: string };
  if (!data.output_text) {
    throw new Error('OpenAI Responses missing output_text.');
  }

  return JSON.parse(data.output_text) as TopicAnalysisResult;
}

async function analyzeOAuthBackend(
  input: AnalyzeTopicAnswerRequest,
  accessToken?: string | null
): Promise<TopicAnalysisResult> {
  if (!config.oauthBackendUpstream) {
    throw new Error('OAUTH_BACKEND_UPSTREAM is missing.');
  }

  const response = await fetch(config.oauthBackendUpstream, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({
      topic: input.topic,
      session: input.session,
      answer: input.answer,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OAuth backend error: ${response.status} ${errorText}`);
  }

  return (await response.json()) as TopicAnalysisResult;
}

export async function analyzeTopicAnswer(
  input: AnalyzeTopicAnswerRequest,
  accessToken?: string | null
): Promise<TopicAnalysisResult> {
  if (input.provider === 'openai-responses') return analyzeOpenAI(input);
  if (input.provider === 'oauth-backend') return analyzeOAuthBackend(input, accessToken);
  return analyzeMock(input);
}
