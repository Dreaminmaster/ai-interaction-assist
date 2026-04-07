import type { ProviderKind } from '../ai/providerFactory';
import type { SessionRecord, Topic } from '../types';
import type { TopicAnalysisResult } from '../ai/types';

interface AnalyzeViaServerOptions {
  serverBaseUrl: string;
  provider: ProviderKind;
  accessToken?: string | null;
}

export async function analyzeTopicAnswerViaServer(input: {
  topic: Topic;
  session: SessionRecord;
  answer: string;
  options: AnalyzeViaServerOptions;
}): Promise<TopicAnalysisResult> {
  const response = await fetch(`${input.options.serverBaseUrl}/api/analyze-topic-answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(input.options.accessToken ? { Authorization: `Bearer ${input.options.accessToken}` } : {}),
    },
    body: JSON.stringify({
      provider: input.options.provider,
      topic: input.topic,
      session: input.session,
      answer: input.answer,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Server analyze request failed: ${response.status} ${errorText}`);
  }

  return (await response.json()) as TopicAnalysisResult;
}
