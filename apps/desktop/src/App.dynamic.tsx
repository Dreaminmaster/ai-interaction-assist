import { FormEvent, useEffect, useMemo, useState } from 'react';
import { createTopic, ensureSeedData, getSessions, getTopics, saveTopics } from './lib/storage';
import type { LearningMode, Topic } from './types';

const modes: LearningMode[] = ['补基础模式', '理解模式', '考试模式', '答辩模式', '论文模式', '项目模式'];

function AppDynamic() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [titleInput, setTitleInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [modeInput, setModeInput] = useState<LearningMode>('理解模式');

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

  const recentSessions = useMemo(() => {
    const sessions = getSessions();
    return selectedTopic ? sessions.filter((session) => session.topicId === selectedTopic.id).slice(-3).reverse() : [];
  }, [selectedTopic]);

  function handleCreateTopic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = titleInput.trim();
    const goal = goalInput.trim();
    if (!title || !goal) return;

    const newTopic = createTopic({ title, goal, mode: modeInput });
    const nextTopics = [newTopic, ...topics];
    setTopics(nextTopics);
    setSelectedTopicId(newTopic.id);
    saveTopics(nextTopics);
    setTitleInput('');
    setGoalInput('');
    setModeInput('理解模式');
  }

  return (
    <div className="app-shell">
      <aside className="left-panel">
        <div className="panel-title">主题与资料</div>
        <button className="primary-button" onClick={() => selectedTopic && setSelectedTopicId(selectedTopic.id)}>
          继续上次学习
        </button>
        <button className="secondary-button">进入复习模式</button>

        <div className="section-title">新建学习主题</div>
        <form className="topic-form" onSubmit={handleCreateTopic}>
          <input
            className="text-input"
            value={titleInput}
            onChange={(event) => setTitleInput(event.target.value)}
            placeholder="主题名称，例如 PID 控制"
          />
          <textarea
            className="text-area"
            value={goalInput}
            onChange={(event) => setGoalInput(event.target.value)}
            placeholder="学习目标，例如理解 PID 三项作用并能口头解释"
          />
          <select className="select-input" value={modeInput} onChange={(event) => setModeInput(event.target.value as LearningMode)}>
            {modes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          <button className="primary-button" type="submit">
            创建主题
          </button>
        </form>

        <div className="section-title">最近主题</div>
        <div className="topic-list">
          {topics.map((topic) => {
            const isActive = selectedTopic?.id === topic.id;
            return (
              <button
                className={`topic-card ${isActive ? 'topic-card-active' : ''}`}
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                type="button"
              >
                <div className="topic-card-title">{topic.title}</div>
                <div className="topic-card-status">{topic.status} · {topic.mode}</div>
                <div className="topic-card-text">{topic.lastSummary}</div>
                <div className="topic-card-next">{topic.nextEntry}</div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="center-panel">
        <div className="hero-card">
          <div className="eyebrow">当前主题</div>
          <h1>{selectedTopic?.title ?? 'AI 交互式学习系统'}</h1>
          <p>{selectedTopic?.goal ?? '本地一键打开的长期学习工作台。'}</p>
        </div>

        <div className="grid-two">
          <section className="content-card">
            <h2>主题档案</h2>
            <div className="meta-row"><span>当前模式</span><strong>{selectedTopic?.mode ?? '-'}</strong></div>
            <div className="meta-row"><span>当前阶段</span><strong>{selectedTopic?.currentStage ?? '-'}</strong></div>
            <div className="meta-row"><span>当前状态</span><strong>{selectedTopic?.status ?? '-'}</strong></div>
            <div className="meta-row"><span>下次入口</span><strong>{selectedTopic?.nextEntry ?? '-'}</strong></div>
          </section>

          <section className="content-card">
            <h2>当前薄弱点</h2>
            <ul>
              {(selectedTopic?.weakPoints.length ? selectedTopic.weakPoints : ['还没有记录薄弱点。']).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="content-card">
          <h2>最近学习记录</h2>
          {recentSessions.length ? (
            <div className="session-list">
              {recentSessions.map((session) => (
                <div className="session-card" key={session.id}>
                  <div className="session-title">{session.title}</div>
                  <div className="session-objective">本轮目标：{session.objective}</div>
                  <div className="session-summary">{session.summary}</div>
                  <div className="session-next">下次入口：{session.nextEntry}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">这个主题还没有学习记录，适合先做首轮基础诊断。</div>
          )}
        </section>

        <section className="content-card">
          <h2>模式预览</h2>
          <div className="mode-list">
            {modes.map((mode) => (
              <span className={`mode-pill ${selectedTopic?.mode === mode ? 'mode-pill-active' : ''}`} key={mode}>
                {mode}
              </span>
            ))}
          </div>
        </section>
      </main>

      <aside className="right-panel">
        <div className="panel-title">AI 交互区</div>
        <div className="chat-card assistant">
          <div className="chat-role">系统</div>
          <div className="chat-text">当前已从本地存储读取主题档案和最近学习记录。下一步可以把这里升级成真正的单轮学习流程面板。</div>
        </div>
        <div className="chat-card user">
          <div className="chat-role">你</div>
          <div className="chat-text">我希望它能记住我学到哪里，并直接接着教。</div>
        </div>
        <div className="chat-card assistant">
          <div className="chat-role">AI 教练</div>
          <div className="chat-text">
            当前选中主题：{selectedTopic?.title ?? '未选择主题'}。建议下一步实现“开始本轮学习”按钮，以及本轮结束后的自动沉淀卡片。
          </div>
        </div>
      </aside>
    </div>
  );
}

export default AppDynamic;
