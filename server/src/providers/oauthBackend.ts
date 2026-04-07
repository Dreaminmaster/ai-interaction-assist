import { env } from '../config/env';
import type { AnalyzeTopicAnswerRequest, TopicAnalysisResult } from '../types/analysis';

export async function analyzeWithOAuthBackend(
  input: AnalyzeTopicAnswerRequest,
  accessToken?: string | null
): Promise<TopicAnalysisResult> {
  if (!env.oauthBackendUpstream) {
    throw new Error('OAUTH_BACKEND_UPSTREAM is missing.');
  }

  const response = await fetch(env.oauthBackendUpstream, {
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
