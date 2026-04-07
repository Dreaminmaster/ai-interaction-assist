import type { SessionRecord, Topic } from '../types';

interface LearningSessionPanelProps {
  topic?: Topic;
  session?: SessionRecord;
  onStartSession?: () => void;
}

function LearningSessionPanel({ topic, session, onStartSession }: LearningSessionPanelProps) {
  if (!topic) {
    return (
      <section className="content-card">
        <h2>本轮学习</h2>
        <div className="empty-state">请先选择一个主题，或者先创建一个新主题。</div>
      </section>
    );
  }

  return (
    <section className="content-card">
      <div className="section-header-row">
        <h2>本轮学习</h2>
        <button className="primary-button small-button" onClick={onStartSession} type="button">
          开始本轮学习
        </button>
      </div>

      <div className="session-focus-box">
        <div className="session-focus-label">当前主题</div>
        <div className="session-focus-title">{topic.title}</div>
        <div className="session-focus-text">目标：{topic.goal}</div>
        <div className="session-focus-text">下一步：{topic.nextEntry}</div>
      </div>

      {session ? (
        <div className="session-diagnosis-box">
          <div className="session-focus-label">当前学习任务</div>
          <div className="session-focus-title">{session.title}</div>
          <div className="session-focus-text">{session.objective}</div>

          <div className="section-title">建议先回答这些问题</div>
          <ol className="question-list">
            {session.reviewQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="empty-state">当前还没有本轮学习记录。适合先点击“开始本轮学习”。</div>
      )}
    </section>
  );
}

export default LearningSessionPanel;
