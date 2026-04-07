import { useMemo, useState } from 'react';
import { getSessions } from '../lib/storage';
import { createInitialSession } from '../lib/session';
import type { SessionRecord, Topic } from '../types';

export function useLearningSession(topic?: Topic) {
  const [activeSession, setActiveSession] = useState<SessionRecord | undefined>(undefined);

  const recentSessions = useMemo(() => {
    const sessions = getSessions();
    return topic ? sessions.filter((session) => session.topicId === topic.id).slice(-3).reverse() : [];
  }, [topic]);

  function startSession() {
    if (!topic) return undefined;
    const session = createInitialSession(topic);
    setActiveSession(session);
    return session;
  }

  return {
    activeSession,
    setActiveSession,
    recentSessions,
    startSession,
  };
}
