import { config } from './config';

export type ProviderType = 'openai-responses' | 'oauth-backend' | 'local-openai-compatible' | 'mock';

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
  inlineThreads?: Array<{
    id: string;
    afterParagraph: number;
    userText: string;
    aiText: string;
    status: string;
  }>;
}

export interface AnalyzeTopicAnswerRequest {
  provider: ProviderType;
  topic: TopicPayload;
  session: SessionPayload;
  answer: string;
}

export interface InlineAskRequest {
  provider: ProviderType;
  topic: TopicPayload;
  session: SessionPayload;
  paragraph: string;
  question: string;
}

export interface TopicAnalysisResult {
  summary: string;
  masteredPoints: string[];
  weakPoints: string[];
  nextEntry: string;
  reviewQuestions: string[];
  suggestedNextLesson?: string;
}

function parseJsonSafely<T>(text: string): T {
  return JSON.parse(text) as T;
}

async function callOpenAIResponsesJson(prompt: string): Promise<TopicAnalysisResult> {
  if (!config.openAIApiKey) {
    throw new Error('OPENAI_API_KEY is missing.');
  }

  const response = await fetch(`${config.openAIBaseUrl}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openAIApiKey}`
    },
    body: JSON.stringify({
      model: config.openAIModel,
      text: { format: { type: 'json_object' } },
      input: [
        {
          role: 'developer',
          content: [{ type: 'input_text', text: '只返回 JSON，不要输出额外说明。' }]
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI Responses error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as { output_text?: string };
  if (!data.output_text) {
    throw new Error('OpenAI Responses missing output_text.');
  }

  return parseJsonSafely<TopicAnalysisResult>(data.output_text);
}

async function callOpenAIResponsesText(prompt: string): Promise<string> {
  if (!config.openAIApiKey) {
    throw new Error('OPENAI_API_KEY is missing.');
  }

  const response = await fetch(`${config.openAIBaseUrl}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openAIApiKey}`
    },
    body: JSON.stringify({
      model: config.openAIModel,
      input: [
        {
          role: 'developer',
          content: [{ type: 'input_text', text: '回答用于学习阅读场景，请简洁清晰。' }]
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI Responses error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as { output_text?: string };
  const text = data.output_text?.trim();
  if (!text) {
    throw new Error('OpenAI Responses missing output_text.');
  }

  return text;
}

async function callOpenAICompatible(baseUrl: string, apiKey: string, model: string, prompt: string): Promise<string> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: '你是学习助手，请清晰、可读地回答。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI-compatible error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error('OpenAI-compatible response missing message content.');
  }

  return content;
}

async function callOAuthBackendJson(payload: object, accessToken?: string | null): Promise<TopicAnalysisResult> {
  if (!config.oauthBackendUpstream) {
    throw new Error('OAUTH_BACKEND_UPSTREAM is missing.');
  }

  const response = await fetch(config.oauthBackendUpstream, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OAuth backend error: ${response.status} ${errorText}`);
  }

  return (await response.json()) as TopicAnalysisResult;
}

async function callOAuthBackendText(payload: object, accessToken?: string | null): Promise<string> {
  if (!config.oauthBackendUpstream) {
    throw new Error('OAUTH_BACKEND_UPSTREAM is missing.');
  }

  const response = await fetch(config.oauthBackendUpstream, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OAuth backend error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as { answer?: string; summary?: string; message?: string };
  return data.answer || data.summary || data.message || 'OAuth backend returned no answer text.';
}

function analyzeMock(input: AnalyzeTopicAnswerRequest): TopicAnalysisResult {
  const text = input.answer.trim();
  const masteredPoints: string[] = [];
  const weakPoints: string[] = [];

  if (text.length >= 24) {
    masteredPoints.push(`已经开始用自己的话解释“${input.topic.title}”`);
  } else {
    weakPoints.push('回答偏短，当前理解可能还不完整。');
  }

  if (!/因为|所以|本质|作用|区别/.test(text)) {
    weakPoints.push(`对“${input.topic.title}”的因果关系表达还不够清楚`);
  } else {
    masteredPoints.push(`已经开始表达“${input.topic.title}”中的关系或作用`);
  }

  if (!/例如|比如|举个例子/.test(text)) {
    weakPoints.push(`对“${input.topic.title}”还缺少例子或场景说明`);
  } else {
    masteredPoints.push(`已经尝试用例子说明“${input.topic.title}”`);
  }

  const nextEntry = weakPoints.length
    ? `优先继续补“${weakPoints[0]}”，然后再进入下一层学习。`
    : `继续围绕“${input.topic.title}”进入下一层学习。`;

  return {
    summary: `已完成一轮围绕“${input.topic.title}”的学习分析。`,
    masteredPoints,
    weakPoints,
    nextEntry,
    reviewQuestions: [
      `用自己的话复述“${input.topic.title}”这一轮最关键的点。`,
      '这轮里你最容易混淆的地方是什么？',
      '如果下一轮继续，你应该先补哪个问题？'
    ],
    suggestedNextLesson: weakPoints[0]
      ? `下一轮先围绕“${weakPoints[0]}”做补充讲解。`
      : `下一轮可以开始为“${input.topic.title}”生成分层学习地图。`
  };
}

function inlineMock(input: InlineAskRequest): string {
  return `你问的是：“${input.question}”。结合这段内容，建议先抓住一个核心概念，再用一个生活场景做例子说明，这样最容易真正学会。`;
}

export async function analyzeTopicAnswer(
  input: AnalyzeTopicAnswerRequest,
  accessToken?: string | null
): Promise<TopicAnalysisResult> {
  if (input.provider === 'openai-responses') {
    const prompt = [
      '你是学习系统里的学习诊断器。',
      '根据主题、会话和用户回答，输出结构化 JSON。',
      '必须包含字段：summary、masteredPoints、weakPoints、nextEntry、reviewQuestions、suggestedNextLesson。',
      '',
      `主题：${input.topic.title}`,
      `主题目标：${input.topic.goal}`,
      `当前阶段：${input.topic.currentStage}`,
      `本轮目标：${input.session.objective}`,
      `用户回答：${input.answer}`
    ].join('\n');

    return callOpenAIResponsesJson(prompt);
  }

  if (input.provider === 'local-openai-compatible') {
    const prompt = [
      '你是学习系统里的学习诊断器。',
      '请输出 JSON，包含 summary、masteredPoints、weakPoints、nextEntry、reviewQuestions、suggestedNextLesson。',
      `主题：${input.topic.title}`,
      `主题目标：${input.topic.goal}`,
      `当前阶段：${input.topic.currentStage}`,
      `本轮目标：${input.session.objective}`,
      `用户回答：${input.answer}`
    ].join('\n');

    const raw = await callOpenAICompatible(
      config.localModelBaseUrl,
      config.localModelApiKey,
      config.localModelName,
      prompt
    );

    return parseJsonSafely<TopicAnalysisResult>(raw);
  }

  if (input.provider === 'oauth-backend') {
    return callOAuthBackendJson(
      {
        mode: 'analyze-topic-answer',
        topic: input.topic,
        session: input.session,
        answer: input.answer
      },
      accessToken
    );
  }

  return analyzeMock(input);
}

export async function askInlineQuestion(
  input: InlineAskRequest,
  accessToken?: string | null
): Promise<{ answer: string }> {
  const prompt = [
    '你是阅读式学习系统中的段落助手。',
    '请围绕给定段落，直接回答用户问题。',
    '输出要求：简洁、准确、可读，最多 6 句话。',
    '',
    `当前主题：${input.topic.title}`,
    `段落内容：${input.paragraph}`,
    `用户问题：${input.question}`
  ].join('\n');

  if (input.provider === 'openai-responses') {
    return { answer: await callOpenAIResponsesText(prompt) };
  }

  if (input.provider === 'local-openai-compatible') {
    return {
      answer: await callOpenAICompatible(
        config.localModelBaseUrl,
        config.localModelApiKey,
        config.localModelName,
        prompt
      )
    };
  }

  if (input.provider === 'oauth-backend') {
    return {
      answer: await callOAuthBackendText(
        {
          mode: 'inline-ask',
          topic: input.topic,
          session: input.session,
          paragraph: input.paragraph,
          question: input.question
        },
        accessToken
      )
    };
  }

  return { answer: inlineMock(input) };
}
