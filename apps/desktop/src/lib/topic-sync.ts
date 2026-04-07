import type { SessionRecord, Topic } from '../types';

function inferNextStage(topic: Topic, session: SessionRecord): string {
  if (!session.masteredPoints.length) {
    return '基础诊断中';
  }

  if (session.weakPoints.length) {
    return `${topic.currentStage} · 待巩固`;
  }

  return `${topic.currentStage} · 已推进`;
}

export function syncTopicFromSession(topic: Topic, session: SessionRecord): Topic {
  return {
    ...topic,
    lastSummary: session.summary,
    nextEntry: session.nextEntry,
    weakPoints: session.weakPoints,
    currentStage: inferNextStage(topic, session),
    updatedAt: new Date().toISOString(),
  };
}

export function syncTopicsWithSession(topics: Topic[], session: SessionRecord): Topic[] {
  return topics.map((topic) =>
    topic.id === session.topicId ? syncTopicFromSession(topic, session) : topic
  );
}
