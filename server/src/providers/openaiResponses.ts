import { env } from '../config/env';
import type { AnalyzeTopicAnswerRequest, TopicAnalysisResult } from '../types/analysis';

function buildPrompt(input: AnalyzeTopicAnswerRequest): string {
  return [
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
}

export async function analyzeWithOpenAIResponses(
  input: AnalyzeTopicAnswerRequest
): Promise<TopicAnalysisResult> {
  if (!env.openAIApiKey) {
    throw new Error('OPENAI_API_KEY is missing.');
  }

  const response = await fetch(`${env.openAIBaseUrl}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.openAIApiKey}`,
    },
    body: JSON.stringify({
      model: env.openAIModel,
      text: {
        format: {
          type: 'json_object',
        },
      },
      input: [
        {
          role: 'developer',
          content: [
            {
              type: 'input_text',
              text: '请只返回 JSON，不要包含额外说明。',
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: buildPrompt(input),
            },
          ],
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
