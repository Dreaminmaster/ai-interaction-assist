import type { SessionRecord, Topic } from '../types';

export interface TopicAnalysisResult {
  summary: string;
  masteredPoints: string[];
  weakPoints: string[];
  nextEntry: string;
  reviewQuestions: string[];
  suggestedNextLesson?: string;
}

export interface TopicAnalysisInput {
  topic: Topic;
  session: SessionRecord;
  answer: string;
}

export interface TopicAnalyzerProvider {
  analyze(input: TopicAnalysisInput): Promise<TopicAnalysisResult>;
}
