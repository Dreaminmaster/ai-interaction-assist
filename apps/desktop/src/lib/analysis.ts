import { createSessionSummary } from './session';
import type { SessionRecord, Topic } from '../types';

function inferWeakPoints(answer: string, topic: Topic): string[] {
  const text = answer.trim();
  if (!text) return ['当前回答为空，无法判断真实掌握情况'];
  if (text.length < 24) return ['回答过短，可能还没有形成完整理解'];

  const weakPoints: string[] = [];
  if (!/因为|所以|本质|作用|区别/.test(text)) {
    weakPoints.push(`对“${topic.title}”的因果关系表达还不够清楚`);
  }
  if (!/例如|比如|像/.test(text)) {
    weakPoints.push(`对“${topic.title}”还缺少例子或场景说明`);
  }

  return weakPoints;
}

function inferMasteredPoints(answer: string, topic: Topic): string[] {
  const text = answer.trim();
  if (!text) return [];

  const points: string[] = [];
  if (text.length >= 24) {
    points.push(`已经开始尝试用自己的话解释“${topic.title}”`);
  }
  if (/因为|所以|本质|作用|区别/.test(text)) {
    points.push(`已经开始建立“${topic.title}”的因果或关系表达`);
  }
  if (/例如|比如|像/.test(text)) {
    points.push(`已经尝试用例子说明“${topic.title}”`);
  }

  return points;
}

export function applyAnswerToSession(input: {
  topic: Topic;
  session: SessionRecord;
  answer: string;
}): SessionRecord {
  const masteredPoints = inferMasteredPoints(input.answer, input.topic);
  const weakPoints = inferWeakPoints(input.answer, input.topic);
  const nextEntry = weakPoints.length
    ? `优先继续补“${weakPoints[0]}”，然后再进入下一层学习。`
    : `继续围绕“${input.topic.title}”进入下一层学习，开始生成学习地图。`;

  const summaryParts = createSessionSummary({
    topic: input.topic,
    objective: input.session.objective,
    masteredPoints,
    weakPoints,
    nextEntry,
  });

  return {
    ...input.session,
    summary: summaryParts.summary,
    masteredPoints,
    weakPoints,
    reviewQuestions: summaryParts.reviewQuestions,
    nextEntry: summaryParts.nextEntry,
  };
}
