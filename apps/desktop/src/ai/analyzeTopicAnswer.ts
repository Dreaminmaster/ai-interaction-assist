import type { SessionRecord, Topic } from '../types';
import { MockTopicAnalyzer } from './mockTopicAnalyzer';
import type { TopicAnalyzerProvider } from './types';

const defaultProvider: TopicAnalyzerProvider = new MockTopicAnalyzer();

export async function analyzeTopicAnswer(input: {
  topic: Topic;
  session: SessionRecord;
  answer: string;
  provider?: TopicAnalyzerProvider;
}): Promise<SessionRecord> {
  const provider = input.provider ?? defaultProvider;
  const result = await provider.analyze({
    topic: input.topic,
    session: input.session,
    answer: input.answer,
  });

  return {
    ...input.session,
    summary: result.summary,
    masteredPoints: result.masteredPoints,
    weakPoints: result.weakPoints,
    reviewQuestions: result.reviewQuestions,
    nextEntry: result.nextEntry,
  };
}
