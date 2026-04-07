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
  provider: 'openai-responses' | 'oauth-backend' | 'mock';
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
