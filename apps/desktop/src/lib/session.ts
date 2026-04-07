import type { SessionRecord, Topic } from '../types';

export function buildInitialDiagnosisQuestions(topic: Topic): string[] {
  return [
    `你之前接触过“${topic.title}”吗？你会怎么用自己的话解释它？`,
    `围绕“${topic.title}”，你现在最想先解决的一个问题是什么？`,
    `如果让你现在马上开始学“${topic.title}”，你觉得自己最容易卡住的地方是什么？`,
  ];
}

export function createInitialSession(topic: Topic): SessionRecord {
  const questions = buildInitialDiagnosisQuestions(topic);
  const now = new Date().toISOString();

  return {
    id: `session-${crypto.randomUUID()}`,
    topicId: topic.id,
    title: `${topic.title} · 首轮基础诊断`,
    objective: `围绕“${topic.title}”完成首轮基础判断，并确定学习起点。`,
    summary: '本轮尚未完成，等待用户回答基础诊断问题。',
    masteredPoints: [],
    weakPoints: [],
    reviewQuestions: questions,
    nextEntry: '先完成 3 到 5 个基础诊断问题，再生成学习地图。',
    createdAt: now,
  };
}

export function createSessionSummary(input: {
  topic: Topic;
  objective: string;
  masteredPoints: string[];
  weakPoints: string[];
  nextEntry: string;
}): Pick<SessionRecord, 'summary' | 'reviewQuestions' | 'nextEntry'> {
  const summary = input.masteredPoints.length
    ? `已完成一轮围绕“${input.topic.title}”的学习，当前已掌握 ${input.masteredPoints.join('、')}，仍需继续巩固 ${input.weakPoints.join('、') || '暂无明显薄弱点'}。`
    : `已开始围绕“${input.topic.title}”的学习，但当前仍处在诊断或起步阶段。`;

  const reviewQuestions = [
    `用自己的话解释“${input.topic.title}”当前这一轮最关键的点。`,
    `这轮里你最容易混淆的地方是什么？`,
    `下次继续时，应该先从哪个问题接上？`,
  ];

  return {
    summary,
    reviewQuestions,
    nextEntry: input.nextEntry,
  };
}
