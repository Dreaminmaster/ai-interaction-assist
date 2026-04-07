import type { SessionRecord } from '../types';

interface SessionSummaryCardProps {
  session?: SessionRecord;
}

function SessionSummaryCard({ session }: SessionSummaryCardProps) {
  return (
    <section className="content-card">
      <h2>本轮沉淀</h2>
      {session ? (
        <>
          <div className="session-summary-block">
            <div className="session-focus-label">本轮总结</div>
            <div className="session-focus-text">{session.summary}</div>
          </div>

          <div className="grid-two compact-grid">
            <div className="mini-card">
              <div className="session-focus-label">已掌握</div>
              <ul>
                {(session.masteredPoints.length ? session.masteredPoints : ['当前还没有记录已掌握点。']).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mini-card">
              <div className="session-focus-label">当前薄弱点</div>
              <ul>
                {(session.weakPoints.length ? session.weakPoints : ['当前还没有记录薄弱点。']).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="session-summary-block">
            <div className="session-focus-label">下次入口</div>
            <div className="session-focus-text">{session.nextEntry}</div>
          </div>
        </>
      ) : (
        <div className="empty-state">本轮学习沉淀还没有生成。开始一轮学习后，这里会出现总结、已掌握和薄弱点。</div>
      )}
    </section>
  );
}

export default SessionSummaryCard;
