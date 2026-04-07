type Mode = '补基础模式' | '理解模式' | '考试模式' | '答辩模式' | '论文模式' | '项目模式';

const modes: Mode[] = ['补基础模式', '理解模式', '考试模式', '答辩模式', '论文模式', '项目模式'];

const recentTopics = [
  {
    title: 'PID 控制',
    status: '进行中',
    summary: '已经理解 P 和 I 的基本作用，D 项还不稳定。',
    next: '从 D 项的直观作用开始继续。',
  },
  {
    title: 'PLC 抢答系统',
    status: '进行中',
    summary: '已梳理主持人开始、提前抢答、超时未抢答三个状态。',
    next: '从答题倒计时和评分流程继续。',
  },
];

function App() {
  return (
    <div className="app-shell">
      <aside className="left-panel">
        <div className="panel-title">主题与资料</div>
        <button className="primary-button">继续上次学习</button>
        <button className="secondary-button">新建学习主题</button>
        <button className="secondary-button">进入复习模式</button>

        <div className="section-title">最近主题</div>
        <div className="topic-list">
          {recentTopics.map((topic) => (
            <div className="topic-card" key={topic.title}>
              <div className="topic-card-title">{topic.title}</div>
              <div className="topic-card-status">{topic.status}</div>
              <div className="topic-card-text">{topic.summary}</div>
              <div className="topic-card-next">{topic.next}</div>
            </div>
          ))}
        </div>
      </aside>

      <main className="center-panel">
        <div className="hero-card">
          <div className="eyebrow">AI 交互式学习系统</div>
          <h1>本地一键打开的长期学习工作台</h1>
          <p>
            这一版先搭建最小可用骨架。后续会在这里接入主题档案、学习流程引擎、薄弱点追踪、复习模式和资料挂载。
          </p>
        </div>

        <div className="grid-two">
          <section className="content-card">
            <h2>当前学习页的目标</h2>
            <ul>
              <li>围绕一个主题持续学习，而不是单轮聊天。</li>
              <li>每轮结束自动沉淀已掌握、薄弱点、复习问题和下次入口。</li>
              <li>支持补基础、理解、考试、答辩、论文、项目六种模式。</li>
            </ul>
          </section>

          <section className="content-card">
            <h2>下一步开发重点</h2>
            <ul>
              <li>接入主题新建与持久化存储。</li>
              <li>补会话记录和本轮学习沉淀模块。</li>
              <li>把右侧交互区升级为真正的学习流程面板。</li>
            </ul>
          </section>
        </div>

        <section className="content-card">
          <h2>模式预览</h2>
          <div className="mode-list">
            {modes.map((mode) => (
              <span className="mode-pill" key={mode}>
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
          <div className="chat-text">
            已读取仓库中的 README 与系统协议。当前建议优先完成主题档案、单轮沉淀和本地保存。
          </div>
        </div>
        <div className="chat-card user">
          <div className="chat-role">你</div>
          <div className="chat-text">我要继续把它做成真正能学习和复习的应用。</div>
        </div>
        <div className="chat-card assistant">
          <div className="chat-role">AI 教练</div>
          <div className="chat-text">
            当前最自然的下一步是：先做主题创建、最近主题列表的真实数据化，以及“本轮学习沉淀”卡片。
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;
