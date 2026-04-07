import { useEffect, useMemo, useState } from 'react';
import { createTopic, ensureSeedData, getTopics, saveTopics } from '../lib/storage';
import type { LearningMode, Topic } from '../types';

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  useEffect(() => {
    ensureSeedData();
    const loadedTopics = getTopics();
    setTopics(loadedTopics);
    setSelectedTopicId(loadedTopics[0]?.id ?? '');
  }, []);

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === selectedTopicId) ?? topics[0],
    [selectedTopicId, topics]
  );

  function addTopic(input: { title: string; goal: string; mode: LearningMode }) {
    const newTopic = createTopic(input);
    const nextTopics = [newTopic, ...topics];
    setTopics(nextTopics);
    setSelectedTopicId(newTopic.id);
    saveTopics(nextTopics);
    return newTopic;
  }

  return {
    topics,
    selectedTopic,
    selectedTopicId,
    setSelectedTopicId,
    addTopic,
  };
}
