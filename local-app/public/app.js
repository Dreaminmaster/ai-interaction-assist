const TOPICS_KEY = 'local-ai-topics';
const SESSIONS_KEY = 'local-ai-sessions';

const seedTopics = [
  {
    id: 'topic-pid',
    title: 'PID 控制',
    goal: '理解 PID 三项各自作用，并能口头解释。',
    mode: '理解模式',
    currentStage: '基础理解',
    status: '进行中',
    lastSummary: '已经理解 P 和 I 的基本作用，D 项还不稳定。',
    nextEntry: '从 D 项的直观作用开始继续。',
    weakPoints: ['微分项的直观作用', '三项配合的口头表达'],
    updatedAt: new Date().toISOString(),
  },
];

const seedSessions = [];

let state = {
  provider: 'mock',
  topics: [],
  sessions: [],
  selectedTopicId: '',
  activeSessionId: '',
  isAnalyzing: false,
};

function $(id) {
  return document.getElementById(id);
}

function readJson(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeedData() {
  if (!localStorage.getItem(TOPICS_KEY)) writeJson(TOPICS_KEY, seedTopics);
  if (!localStorage.getItem(SESSIONS_KEY)) writeJson(SESSIONS_KEY, seedSessions);
}

function loadState() {
  ensureSeedData();
  state.topics = readJson(TOPICS_KEY, seedTopics);
  state.sessions = readJson(SESSIONS_KEY, seedSessions);
  state.selectedTopicId = state.topics[0]?.id || '';
  const latest = getRecentSessions()[0];
  state.activeSessionId = latest?.id || '';
}

function saveTopics() { writeJson(TOPICS_KEY, state.topics); }
function saveSessions() { writeJson(SESSIONS_KEY, state.sessions); }

function getSelectedTopic() {
  return state.topics.find((t) => t.id === state.selectedTopicId) || state.topics[0] || null;
}

function getActiveSession() {
  return state.sessions.find((s) => s.id === state.activeSessionId) || null;
}

function getRecentSessions() {
  const topic = getSelectedTopic();
  if (!topic) return [];
  return state.sessions
    .filter((s) => s.topicId === topic.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
}

function createTopic(title, goal, mode) {
  return {
    id: `topic-${crypto.randomUUID()}`,
    title,
    goal,
    mode,
    currentStage: '刚创建',
    status: '进行中',
    lastSummary: '主题刚刚创建，等待首轮基础诊断。',
    nextEntry: '先做 3 到 5 个基础诊断问题。',
    weakPoints: [],
    updatedAt: new Date().toISOString(),
  };
}

function createInitialSession(topic) {
  return {
    id: `session-${crypto.randomUUID()}`,
    topicId: topic.id,
    title: `${topic.title} · 首轮基础诊断`,
    objective: `围绕“${topic.title}”完成首轮基础判断，并确定学习起点。`,
    summary: '本轮尚未完成，等待用户回答基础诊断问题。',
    masteredPoints: [],
    weakPoints: [],
    reviewQuestions: [
      `你之前接触过“${topic.title}”吗？你会怎么用自己的话解释它？`,
      `围绕“${topic.title}”，你现在最想先解决的一个问题是什么？`,
      `如果让你现在马上开始学“${topic.title}”，你觉得自己最容易卡住的地方是什么？`,
    ],
    nextEntry: '先完成 3 到 5 个基础诊断问题，再生成学习地图。',
    createdAt: new Date().toISOString(),
  };
}

function syncTopicFromSession(topic, session) {
  return {
    ...topic,
    lastSummary: session.summary,
    nextEntry: session.nextEntry,
    weakPoints: session.weakPoints,
    currentStage: session.masteredPoints.length ? `${topic.currentStage} · 已推进` : '基础诊断中',
    updatedAt: new Date().toISOString(),
  };
}

async function analyzeAnswer(topic, session, answer) {
  const response = await fetch('/api/analyze-topic-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: state.provider, topic, session, answer }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || '分析失败');
  }

  return await response.json();
}

function renderTopicList() {
  const wrap = $('topicList');
  wrap.innerHTML = '';
  state.topics.forEach((topic) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `topic-card ${topic.id === state.selectedTopicId ? 'topic-card-active' : ''}`;
    btn.innerHTML = `
      <div class="topic-card-title">${topic.title}</div>
      <div class="topic-card-status">${topic.status} · ${topic.mode}</div>
      <div class="topic-card-text">${topic.lastSummary}</div>
      <div class="topic-card-next">${topic.nextEntry}</div>
    `;
    btn.onclick = () => {
      state.selectedTopicId = topic.id;
      const latest = getRecentSessions()[0];
      state.activeSessionId = latest?.id || '';
      render();
    };
    wrap.appendChild(btn);
  });
}

function setList(id, items, emptyText) {
  const el = $(id);
  el.innerHTML = '';
  const list = items && items.length ? items : [emptyText];
  list.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    el.appendChild(li);
  });
}

function renderTopicMeta() {
  const topic = getSelectedTopic();
  $('topicTitle').textContent = topic?.title || 'AI 交互式学习系统';
  $('topicGoal').textContent = topic?.goal || '本地一键打开的长期学习网页应用。';
  $('topicMode').textContent = topic?.mode || '-';
  $('topicStage').textContent = topic?.currentStage || '-';
  $('topicStatus').textContent = topic?.status || '-';
  $('topicNext').textContent = topic?.nextEntry || '-';
  setList('weakPointList', topic?.weakPoints || [], '当前还没有记录薄弱点。');
  $('sessionTopicTitle').textContent = topic?.title || '-';
  $('sessionTopicGoal').textContent = topic ? `目标：${topic.goal}` : '-';
  $('sessionTopicNext').textContent = topic ? `下一步：${topic.nextEntry}` : '-';
}

function renderSession() {
  const session = getActiveSession();
  const questions = session?.reviewQuestions?.length ? session.reviewQuestions : ['请先开始本轮学习。'];
  const qWrap = $('questionList');
  qWrap.innerHTML = '';
  questions.forEach((q) => {
    const li = document.createElement('li');
    li.textContent = q;
    qWrap.appendChild(li);
  });

  $('sessionSummary').textContent = session?.summary || '开始一轮学习后，这里会出现总结。';
  $('sessionNext').textContent = session?.nextEntry || '-';
  setList('masteredList', session?.masteredPoints || [], '当前还没有记录已掌握点。');
  setList('sessionWeakList', session?.weakPoints || [], '当前还没有记录薄弱点。');
}

function renderRecentSessions() {
  const wrap = $('recentSessionList');
  const sessions = getRecentSessions();
  wrap.innerHTML = '';
  if (!sessions.length) {
    wrap.innerHTML = '<div class="empty-state">当前主题还没有历史学习记录。</div>';
    return;
  }
  sessions.forEach((session) => {
    const div = document.createElement('div');
    div.className = 'session-card';
    div.innerHTML = `
      <div class="session-title">${session.title}</div>
      <div class="session-summary">${session.summary}</div>
      <div class="session-next">下次入口：${session.nextEntry}</div>
    `;
    wrap.appendChild(div);
  });
}

function renderStatus(message) {
  $('statusText').textContent = message;
  $('submitAnswerBtn').disabled = state.isAnalyzing;
  $('answerInput').disabled = state.isAnalyzing;
}

function render() {
  renderTopicList();
  renderTopicMeta();
  renderSession();
  renderRecentSessions();
  renderStatus(state.isAnalyzing ? '正在分析当前回答…' : `当前 provider：${state.provider}`);
  $('providerSelect').value = state.provider;
}

function bindEvents() {
  $('providerSelect').addEventListener('change', (e) => {
    state.provider = e.target.value;
    render();
  });

  $('topicForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = $('titleInput').value.trim();
    const goal = $('goalInput').value.trim();
    const mode = $('modeInput').value;
    if (!title || !goal) return;
    const topic = createTopic(title, goal, mode);
    state.topics.unshift(topic);
    state.selectedTopicId = topic.id;
    saveTopics();
    $('titleInput').value = '';
    $('goalInput').value = '';
    render();
  });

  $('continueBtn').addEventListener('click', () => render());

  $('startSessionBtn').addEventListener('click', () => {
    const topic = getSelectedTopic();
    if (!topic) return;
    const session = createInitialSession(topic);
    state.sessions.unshift(session);
    state.activeSessionId = session.id;
    saveSessions();
    render();
  });

  $('answerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const topic = getSelectedTopic();
    const session = getActiveSession();
    const answer = $('answerInput').value.trim();
    if (!topic || !session || !answer) return;

    state.isAnalyzing = true;
    renderStatus('正在分析当前回答…');

    try {
      const result = await analyzeAnswer(topic, session, answer);
      const updatedSession = {
        ...session,
        summary: result.summary,
        masteredPoints: result.masteredPoints,
        weakPoints: result.weakPoints,
        nextEntry: result.nextEntry,
        reviewQuestions: result.reviewQuestions,
      };
      state.sessions = state.sessions.map((s) => s.id === session.id ? updatedSession : s);
      state.topics = state.topics.map((t) => t.id === topic.id ? syncTopicFromSession(t, updatedSession) : t);
      saveSessions();
      saveTopics();
      $('answerInput').value = '';
    } catch (error) {
      renderStatus(error instanceof Error ? error.message : '分析失败');
    } finally {
      state.isAnalyzing = false;
      render();
    }
  });
}

loadState();
bindEvents();
render();
