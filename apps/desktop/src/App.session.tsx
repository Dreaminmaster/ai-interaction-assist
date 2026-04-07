import { FormEvent, useState } from 'react';
import LearningSessionPanel from './components/LearningSessionPanel';
import SessionSummaryCard from './components/SessionSummaryCard';
import { useLearningSession } from './hooks/useLearningSession';
import { useTopics } from './hooks/useTopics';
import type { LearningMode } from './types';

const modes: LearningMode[] = ['补基础模式', '理解模式', '考试模式', '答辩模式', '论文模式', '项目模式'];

function AppSession() {
  const { topics, selectedTopic, selectedTopicId, setSelectedTopicId, addTopic } = useTopics();
  const { activeSession, recentSessions, startSession } = useLearningSession(selectedTopic);

  const [titleInput, setTitleInput] = useState('');
  const [goalInput, setGoalInput] = useState('');
  const [modeInput, setModeInput] = useState<LearningMode>('理解模式');

  function handleCreateTopic(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = titleInput.trim();
    const goal = goalInput.trim();
    if (!title || !goal) return;
    addTopic({ title, goal, mode: modeInput });
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
          <input className="text-input" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} placeholder="主题名称" />
          <textarea className="text-area" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} placeholder="学习目标" />
          <select className="select-input" value={modeInput} onChange={(e) => setModeInput(e.target.value as LearningMode)}>
            {modes.map((mode) => (
              <option key={mode} value={mode}>{mode}</option>
            ))}
          </select>
          <button className="primary-button" type="submit">创建主题</button>
        </form>

        <div className="section-title">最近主题</div>
        <div className="topic-list">
          {topics.map((topic) => (
            <button
              className={`topic-card ${selectedTopicId === topic.id ? 'topic-card-active' : ''}`}
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              type="button"
            >
              <div className="topic-card-title">{topic.title}</div>
              <div className="topic-card-status">{topic.status} · {topic.mode}</div>
              <div className="topic-card-text">{topic.lastSummary}</div>
              <div className="topic-card-next">{topic.nextEntry}</div>
            </button>
          ))}
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
            <h2>最近记录</h2>
            {recentSessions.length ? (
              <div className="session-list">
                {recentSessions.map((session) => (
                  <div className="session-card" key={session.id}>
                    <div className="session-title">{session.title}</div>
                    <div className="session-summary">{session.summary}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">当前主题还没有历史学习记录。</div>
            )}
          </section>
        </div>

        <LearningSessionPanel topic={selectedTopic} session={activeSession} onStartSession={startSession} />
        <SessionSummaryCard session={activeSession} />
      </main>

      <aside className="right-panel">
        <div className="panel-title">AI 交互区</div>
        <div className="chat-card assistant">
          <div className="chat-role">系统</div>
          <div className="chat-text">当前页面已经进入“会话驱动版”。点击开始本轮学习后，中间区域会生成首轮诊断任务。</div>
        </div>
        <div className="chat-card assistant">
          <div className="chat-role">下一步</div>
          <div className="chat-text">后续可以把 activeSession 写回本地存储，并接上真正的 AI 回答与总结生成逻辑。</div>
        </div>
      </aside>
    </div>
  );
}

export default AppSession;
