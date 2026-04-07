import { useEffect, useMemo, useState } from 'react';
import { getSessions, saveSessions } from '../lib/storage';
import { createInitialSession } from '../lib/session';
import type { SessionRecord, Topic } from '../types';

export function usePersistedLearningSession(topic?: Topic) {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [activeSession, setActiveSession] = useState<SessionRecord | undefined>(undefined);

  useEffect(() => {
    const loaded = getSessions();
    setSessions(loaded);
  }, []);

  useEffect(() => {
    if (!topic) {
      setActiveSession(undefined);
      return;
    }

    const latestForTopic = sessions
      .filter((session) => session.topicId === topic.id)
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    setActiveSession(latestForTopic);
  }, [sessions, topic]);

  const recentSessions = useMemo(() => {
    if (!topic) return [];
    return sessions
      .filter((session) => session.topicId === topic.id)
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  }, [sessions, topic]);

  function startSession() {
    if (!topic) return undefined;

    const session = createInitialSession(topic);
    const nextSessions = [session, ...sessions];
    setSessions(nextSessions);
    setActiveSession(session);
    saveSessions(nextSessions);
    return session;
  }

  function updateActiveSession(patch: Partial<SessionRecord>) {
    if (!activeSession) return;

    const nextActive = { ...activeSession, ...patch };
    const nextSessions = sessions.map((session) =>
      session.id === nextActive.id ? nextActive : session
    );

    setSessions(nextSessions);
    setActiveSession(nextActive);
    saveSessions(nextSessions);
  }

  return {
    sessions,
    activeSession,
    recentSessions,
    startSession,
    updateActiveSession,
  };
}
