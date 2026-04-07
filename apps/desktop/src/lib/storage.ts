import { seedSessions, seedTopics } from '../data/seed';
import type { SessionRecord, Topic } from '../types';

const TOPICS_KEY = 'ai-learning-topics';
const SESSIONS_KEY = 'ai-learning-sessions';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function ensureSeedData(): void {
  if (typeof window === 'undefined') return;

  const topics = window.localStorage.getItem(TOPICS_KEY);
  const sessions = window.localStorage.getItem(SESSIONS_KEY);

  if (!topics) {
    writeJson(TOPICS_KEY, seedTopics);
  }

  if (!sessions) {
    writeJson(SESSIONS_KEY, seedSessions);
  }
}

export function getTopics(): Topic[] {
  return readJson<Topic[]>(TOPICS_KEY, seedTopics);
}

export function saveTopics(topics: Topic[]): void {
  writeJson(TOPICS_KEY, topics);
}

export function getSessions(): SessionRecord[] {
  return readJson<SessionRecord[]>(SESSIONS_KEY, seedSessions);
}

export function saveSessions(sessions: SessionRecord[]): void {
  writeJson(SESSIONS_KEY, sessions);
}

export function createTopic(input: {
  title: string;
  goal: string;
  mode: Topic['mode'];
}): Topic {
  const now = new Date().toISOString();

  return {
    id: `topic-${crypto.randomUUID()}`,
    title: input.title,
    goal: input.goal,
    mode: input.mode,
    currentStage: '刚创建',
    status: '进行中',
    lastSummary: '主题刚刚创建，等待首轮基础诊断。',
    nextEntry: '先做 3 到 5 个基础诊断问题。',
    weakPoints: [],
    updatedAt: now,
  };
}
