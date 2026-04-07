export type LearningMode =
  | '补基础模式'
  | '理解模式'
  | '考试模式'
  | '答辩模式'
  | '论文模式'
  | '项目模式';

export type TopicStatus = '进行中' | '已暂停' | '已完成';

export interface Topic {
  id: string;
  title: string;
  goal: string;
  mode: LearningMode;
  currentStage: string;
  status: TopicStatus;
  lastSummary: string;
  nextEntry: string;
  weakPoints: string[];
  updatedAt: string;
}

export interface SessionRecord {
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
