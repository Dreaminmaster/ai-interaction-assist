import type { TopicAnalyzerProvider, TopicAnalysisInput, TopicAnalysisResult } from '../types';

interface OpenAIResponsesProviderOptions {
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

function buildPrompt(input: TopicAnalysisInput): string {
  return [
    '你是一个交互式学习系统中的学习诊断器。',
    '请根据用户当前主题、当前会话和本轮回答，返回结构化学习分析。',
    '你必须识别：本轮总结、已掌握点、薄弱点、下次入口、复习问题。',
    '',
    `主题：${input.topic.title}`,
    `主题目标：${input.topic.goal}`,
    `当前阶段：${input.topic.currentStage}`,
    `本轮目标：${input.session.objective}`,
    `用户回答：${input.answer}`,
  ].join('\n');
}

function extractJson(text: string): TopicAnalysisResult {
  try {
    return JSON.parse(text) as TopicAnalysisResult;
  } catch {
    throw new Error('OpenAIResponsesProvider: failed to parse JSON analysis result.');
  }
}

export class OpenAIResponsesProvider implements TopicAnalyzerProvider {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;

  constructor(options: OpenAIResponsesProviderOptions) {
    this.apiKey = options.apiKey;
    this.model = options.model ?? 'gpt-5';
    this.baseUrl = options.baseUrl ?? 'https://api.openai.com/v1';
  }

  async analyze(input: TopicAnalysisInput): Promise<TopicAnalysisResult> {
    const response = await fetch(`${this.baseUrl}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
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
                text: '请只返回 JSON。JSON 必须包含 summary、masteredPoints、weakPoints、nextEntry、reviewQuestions、suggestedNextLesson 这几个字段。',
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
      throw new Error(`OpenAIResponsesProvider: ${response.status} ${errorText}`);
    }

    const data = (await response.json()) as { output_text?: string };
    if (!data.output_text) {
      throw new Error('OpenAIResponsesProvider: missing output_text in response.');
    }

    return extractJson(data.output_text);
  }
}
