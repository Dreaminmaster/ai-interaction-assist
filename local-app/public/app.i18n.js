const messages = {
  'zh-CN': {
    panel_config_title: '主题与配置',
    continue_learning: '继续上次学习',
    export_backup: '导出学习备份',
    import_backup: '导入学习备份',
    language: '语言',
    create_topic: '新建学习主题',
    title_placeholder: '主题名称，例如 PID 控制',
    goal_placeholder: '学习目标，例如理解 PID 三项作用并能口头解释',
    mode_basic: '补基础模式',
    mode_understand: '理解模式',
    mode_exam: '考试模式',
    mode_defense: '答辩模式',
    mode_paper: '论文模式',
    mode_project: '项目模式',
    create_topic_button: '创建主题',
    recent_topics: '最近主题',
    current_topic: '当前主题',
    topic_profile: '主题档案',
    current_mode: '当前模式',
    current_stage: '当前阶段',
    current_status: '当前状态',
    next_entry: '下次入口',
    current_weak_points: '当前薄弱点',
    no_weak_points: '当前还没有记录薄弱点。',
    current_session: '本轮学习',
    start_session: '开始本轮学习',
    current_questions: '本轮问题',
    start_session_first: '请先开始本轮学习。',
    session_summary_title: '本轮沉淀',
    summary: '本轮总结',
    mastered_points: '已掌握',
    no_mastered_points: '当前还没有记录已掌握点。',
    session_weak_points: '当前薄弱点',
    answer_questions: '回答本轮问题',
    answer_placeholder: '在这里写下你的理解、例子或当前困惑。',
    submit_answer: '提交回答并更新本轮沉淀',
    recent_sessions: '最近记录',
    no_sessions: '当前主题还没有历史学习记录。',
    status: '状态',
    local_web_mode: '本地网页模式',
    local_web_mode_desc: '当前入口带导入恢复和导出备份按钮，学习记录会通过本地服务保存到 data/state.json。',
    waiting: '等待开始本轮学习。',
    provider_label: '当前 provider：',
    analyzing: '正在分析当前回答…',
    import_success: '导入成功，页面已恢复学习状态。',
    import_fail: '导入失败。',
    no_goal_prefix: '目标：',
    no_next_prefix: '下一步：',
    recent_empty: '当前主题还没有历史学习记录。',
    session_summary_default: '开始一轮学习后，这里会出现总结。',
    reading_flow: '段落学习流',
    ask_hint: '可在段落间直接提问',
    ask_between: '在这段后提问…',
    ask_button: '提问',
    inline_loading: 'AI 正在回答…',
    empty_lesson: '开始学习后，这里会生成可交互的正文段落。'
  },
  en: {
    panel_config_title: 'Topics & Settings',
    continue_learning: 'Continue Last Learning',
    export_backup: 'Export Backup',
    import_backup: 'Import Backup',
    language: 'Language',
    create_topic: 'Create Topic',
    title_placeholder: 'Topic title, e.g. PID Control',
    goal_placeholder: 'Learning goal, e.g. explain PID terms in your own words',
    mode_basic: 'Foundation Mode',
    mode_understand: 'Understanding Mode',
    mode_exam: 'Exam Mode',
    mode_defense: 'Defense Mode',
    mode_paper: 'Paper Mode',
    mode_project: 'Project Mode',
    create_topic_button: 'Create Topic',
    recent_topics: 'Recent Topics',
    current_topic: 'Current Topic',
    topic_profile: 'Topic Profile',
    current_mode: 'Current Mode',
    current_stage: 'Current Stage',
    current_status: 'Current Status',
    next_entry: 'Next Entry',
    current_weak_points: 'Current Weak Points',
    no_weak_points: 'No weak points recorded yet.',
    current_session: 'Current Session',
    start_session: 'Start Session',
    current_questions: 'Current Questions',
    start_session_first: 'Start a learning session first.',
    session_summary_title: 'Session Summary',
    summary: 'Summary',
    mastered_points: 'Mastered Points',
    no_mastered_points: 'No mastered points recorded yet.',
    session_weak_points: 'Current Weak Points',
    answer_questions: 'Answer Current Questions',
    answer_placeholder: 'Write your understanding, examples, or current confusion here.',
    submit_answer: 'Submit Answer and Update Summary',
    recent_sessions: 'Recent Sessions',
    no_sessions: 'No learning records for the current topic yet.',
    status: 'Status',
    local_web_mode: 'Local Web Mode',
    local_web_mode_desc: 'This entry includes import and export buttons, and learning records are saved to data/state.json through the local service.',
    waiting: 'Waiting to start a learning session.',
    provider_label: 'Current provider: ',
    analyzing: 'Analyzing the current answer…',
    import_success: 'Import succeeded. Learning state restored.',
    import_fail: 'Import failed.',
    no_goal_prefix: 'Goal: ',
    no_next_prefix: 'Next: ',
    recent_empty: 'No learning records for the current topic yet.',
    session_summary_default: 'A summary will appear here after you start a session.',
    reading_flow: 'Paragraph Learning Flow',
    ask_hint: 'Ask between paragraphs',
    ask_between: 'Ask after this paragraph…',
    ask_button: 'Ask',
    inline_loading: 'AI is responding…',
    empty_lesson: 'After you start learning, interactive paragraphs will appear here.'
  }
};

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
    updatedAt: new Date().toISOString()
  }
];

let state = {
  lang: 'zh-CN',
  provider: 'local-openai-compatible',
  topics: [],
  sessions: [],
  selectedTopicId: '',
  activeSessionId: '',
  isAnalyzing: false,
  statusMessage: ''
};

const $ = (id) => document.getElementById(id);
const t = (key) => messages[state.lang][key] || key;

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error((await response.text()) || `Request failed: ${response.status}`);
  }
  return response.json();
}

async function loadStateFromFile() {
  try {
    const fileState = await fetchJson('/api/state');
    state.topics = Array.isArray(fileState.topics) && fileState.topics.length ? fileState.topics : seedTopics;
    state.sessions = Array.isArray(fileState.sessions) ? fileState.sessions : [];
  } catch {
    state.topics = seedTopics;
    state.sessions = [];
    await syncStateToFile();
  }

  state.selectedTopicId = state.topics[0]?.id || '';
  state.activeSessionId = getRecentSessions()[0]?.id || '';
}

async function syncStateToFile() {
  await fetchJson('/api/state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topics: state.topics, sessions: state.sessions })
  });
}

function setStatus(message) {
  state.statusMessage = message;
}

function getSelectedTopic() {
  return state.topics.find((topic) => topic.id === state.selectedTopicId) || state.topics[0] || null;
}

function getActiveSession() {
  return state.sessions.find((session) => session.id === state.activeSessionId) || null;
}

function getRecentSessions() {
  const topic = getSelectedTopic();
  if (!topic) return [];

  return state.sessions
    .filter((session) => session.topicId === topic.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
}

function createTopic(title, goal, mode) {
  return {
    id: `topic-${crypto.randomUUID()}`,
    title,
    goal,
    mode,
    currentStage: state.lang === 'en' ? 'Just created' : '刚创建',
    status: state.lang === 'en' ? 'In Progress' : '进行中',
    lastSummary: state.lang === 'en' ? 'Topic created. Waiting for first diagnosis.' : '主题刚刚创建，等待首轮基础诊断。',
    nextEntry: state.lang === 'en' ? 'Answer 3 to 5 basic diagnosis questions first.' : '先做 3 到 5 个基础诊断问题。',
    weakPoints: [],
    updatedAt: new Date().toISOString()
  };
}

function createInitialSession(topic) {
  return {
    id: `session-${crypto.randomUUID()}`,
    topicId: topic.id,
    title: `${topic.title} · ${state.lang === 'en' ? 'Initial Diagnosis' : '首轮基础诊断'}`,
    objective:
      state.lang === 'en'
        ? `Complete the first diagnosis around "${topic.title}" and find the learning entry point.`
        : `围绕“${topic.title}”完成首轮基础判断，并确定学习起点。`,
    summary: state.lang === 'en' ? 'Session started. Waiting for your answers.' : '本轮尚未完成，等待用户回答基础诊断问题。',
    masteredPoints: [],
    weakPoints: [],
    reviewQuestions:
      state.lang === 'en'
        ? [
            `Have you learned "${topic.title}" before? How would you explain it in your own words?`,
            `What is the one problem you want to solve first about "${topic.title}"?`,
            `If you start learning "${topic.title}" now, where do you think you would get stuck first?`
          ]
        : [
            `你之前接触过“${topic.title}”吗？你会怎么用自己的话解释它？`,
            `围绕“${topic.title}”，你现在最想先解决的一个问题是什么？`,
            `如果让你现在马上开始学“${topic.title}”，你觉得自己最容易卡住的地方是什么？`
          ],
    nextEntry:
      state.lang === 'en'
        ? 'Finish 3 to 5 diagnosis questions first, then generate a learning map.'
        : '先完成 3 到 5 个基础诊断问题，再生成学习地图。',
    createdAt: new Date().toISOString(),
    inlineThreads: []
  };
}

function syncTopicFromSession(topic, session) {
  return {
    ...topic,
    lastSummary: session.summary,
    nextEntry: session.nextEntry,
    weakPoints: session.weakPoints,
    currentStage: session.masteredPoints.length
      ? `${topic.currentStage} · ${state.lang === 'en' ? 'Advanced' : '已推进'}`
      : state.lang === 'en'
      ? 'Diagnosing'
      : '基础诊断中',
    updatedAt: new Date().toISOString()
  };
}

async function analyzeAnswer(topic, session, answer) {
  return fetchJson('/api/analyze-topic-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: state.provider, topic, session, answer })
  });
}

async function askInline(topic, session, paragraph, question) {
  return fetchJson('/api/ask-inline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: state.provider,
      topic,
      session,
      paragraph,
      question
    })
  });
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });

  document.documentElement.lang = state.lang === 'en' ? 'en' : 'zh-CN';
  document.title = state.lang === 'en' ? 'AI Interactive Learning System' : 'AI 交互式学习系统';
}

function renderTopicList() {
  const wrap = $('topicList');
  wrap.innerHTML = '';

  state.topics.forEach((topic) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `topic-card ${topic.id === state.selectedTopicId ? 'topic-card-active' : ''}`;
    button.innerHTML = `
      <div class="topic-card-title">${topic.title}</div>
      <div class="topic-card-status">${topic.status} · ${topic.mode}</div>
      <div class="topic-card-text">${topic.lastSummary}</div>
      <div class="topic-card-next">${topic.nextEntry}</div>
    `;

    button.onclick = () => {
      state.selectedTopicId = topic.id;
      state.activeSessionId = getRecentSessions()[0]?.id || '';
      render();
    };

    wrap.appendChild(button);
  });
}

function setList(id, items, emptyText) {
  const el = $(id);
  el.innerHTML = '';

  (items && items.length ? items : [emptyText]).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    el.appendChild(li);
  });
}

function renderTopicMeta() {
  const topic = getSelectedTopic();

  $('topicTitle').textContent = topic?.title || (state.lang === 'en' ? 'AI Interactive Learning System' : 'AI 交互式学习系统');
  $('topicGoal').textContent = topic?.goal || (state.lang === 'en' ? 'A one-click local long-term learning web app.' : '本地一键打开的长期学习网页应用。');
  $('topicMode').textContent = topic?.mode || '-';
  $('topicStage').textContent = topic?.currentStage || '-';
  $('topicStatus').textContent = topic?.status || '-';
  $('topicNext').textContent = topic?.nextEntry || '-';

  setList('weakPointList', topic?.weakPoints || [], t('no_weak_points'));

  $('sessionTopicTitle').textContent = topic?.title || '-';
  $('sessionTopicGoal').textContent = topic ? `${t('no_goal_prefix')}${topic.goal}` : '-';
  $('sessionTopicNext').textContent = topic ? `${t('no_next_prefix')}${topic.nextEntry}` : '-';
}

function renderSession() {
  const session = getActiveSession();
  const questions = session?.reviewQuestions?.length ? session.reviewQuestions : [t('start_session_first')];
  const qWrap = $('questionList');
  qWrap.innerHTML = '';

  questions.forEach((question) => {
    const li = document.createElement('li');
    li.textContent = question;
    qWrap.appendChild(li);
  });

  $('sessionSummary').textContent = session?.summary || t('session_summary_default');
  $('sessionNext').textContent = session?.nextEntry || '-';
  setList('masteredList', session?.masteredPoints || [], t('no_mastered_points'));
  setList('sessionWeakList', session?.weakPoints || [], t('no_weak_points'));
}

function renderRecentSessions() {
  const wrap = $('recentSessionList');
  const sessions = getRecentSessions();
  wrap.innerHTML = '';

  if (!sessions.length) {
    wrap.innerHTML = `<div class="empty-state">${t('recent_empty')}</div>`;
    return;
  }

  sessions.forEach((session) => {
    const div = document.createElement('div');
    div.className = 'session-card';
    div.innerHTML = `
      <div class="session-title">${session.title}</div>
      <div class="session-summary">${session.summary}</div>
      <div class="session-next">${t('next_entry')}：${session.nextEntry}</div>
    `;
    wrap.appendChild(div);
  });
}

function splitParagraphs(text) {
  if (!text) return [];
  const normalized = String(text).replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  const chunks = normalized
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[。！？!?])\s*/))
    .map((line) => line.trim())
    .filter(Boolean);

  return chunks;
}

function getLessonParagraphs(topic, session) {
  const paragraphs = [];

  if (topic?.goal) {
    paragraphs.push(state.lang === 'en' ? `Learning Goal: ${topic.goal}` : `学习目标：${topic.goal}`);
  }

  if (session?.summary) {
    paragraphs.push(...splitParagraphs(session.summary));
  }

  if (Array.isArray(session?.masteredPoints) && session.masteredPoints.length) {
    paragraphs.push(
      state.lang === 'en'
        ? `Current Mastered Points: ${session.masteredPoints.join(' ; ')}`
        : `当前已掌握：${session.masteredPoints.join('；')}`
    );
  }

  if (Array.isArray(session?.weakPoints) && session.weakPoints.length) {
    paragraphs.push(
      state.lang === 'en'
        ? `Current Weak Points: ${session.weakPoints.join(' ; ')}`
        : `当前薄弱点：${session.weakPoints.join('；')}`
    );
  }

  if (session?.nextEntry) {
    paragraphs.push(state.lang === 'en' ? `Next Step: ${session.nextEntry}` : `下一步建议：${session.nextEntry}`);
  }

  return paragraphs;
}

function getSessionThreads(session) {
  if (!session) return [];
  if (!Array.isArray(session.inlineThreads)) session.inlineThreads = [];
  return session.inlineThreads;
}

function updateSessionById(sessionId, updater) {
  state.sessions = state.sessions.map((session) => (session.id === sessionId ? updater(session) : session));
}

function createThreadElement(text, type, loading = false) {
  const div = document.createElement('div');
  div.className = `inline-message ${type === 'user' ? 'inline-message-user' : 'inline-message-ai'}${loading ? ' inline-message-loading' : ''}`;
  div.textContent = text;
  return div;
}

function createComposer(paragraphIndex) {
  const wrapper = document.createElement('div');
  wrapper.className = 'inline-composer';
  wrapper.innerHTML = `
    <textarea class="inline-input" rows="1" data-after-paragraph="${paragraphIndex}" placeholder="${t('ask_between')}"></textarea>
    <div class="inline-actions">
      <button type="button" class="inline-send" data-after-paragraph="${paragraphIndex}">${t('ask_button')}</button>
    </div>
  `;
  return wrapper;
}

function resizeInlineInput(textarea) {
  textarea.style.height = 'auto';
  const nextHeight = Math.min(textarea.scrollHeight, 150);
  textarea.style.height = `${Math.max(nextHeight, 28)}px`;
}

function renderLessonFlow() {
  const lessonFlow = $('lessonFlow');
  const topic = getSelectedTopic();
  const session = getActiveSession();
  const paragraphs = getLessonParagraphs(topic, session);
  const threads = getSessionThreads(session);

  lessonFlow.innerHTML = '';

  if (!paragraphs.length) {
    lessonFlow.innerHTML = `<div class="empty-state">${t('empty_lesson')}</div>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  paragraphs.forEach((paragraph, index) => {
    const p = document.createElement('article');
    p.className = 'lesson-paragraph';
    p.textContent = paragraph;
    fragment.appendChild(p);

    const gap = document.createElement('div');
    gap.className = 'inline-gap';

    threads
      .filter((thread) => Number(thread.afterParagraph) === index)
      .forEach((thread) => {
        gap.appendChild(createThreadElement(thread.userText, 'user'));
        gap.appendChild(
          createThreadElement(thread.aiText || t('inline_loading'), 'ai', thread.status === 'loading')
        );
      });

    gap.appendChild(createComposer(index));
    fragment.appendChild(gap);
  });

  lessonFlow.appendChild(fragment);
}

function renderStatus(message) {
  $('statusText').textContent = message;
  $('submitAnswerBtn').disabled = state.isAnalyzing;
  $('answerInput').disabled = state.isAnalyzing;
}

function render() {
  applyI18n();
  renderTopicList();
  renderTopicMeta();
  renderLessonFlow();
  renderSession();
  renderRecentSessions();

  const defaultStatus = state.isAnalyzing ? t('analyzing') : `${t('provider_label')}${state.provider}`;
  renderStatus(state.statusMessage || defaultStatus);

  $('providerSelect').value = state.provider;
  $('languageSelect').value = state.lang;
}

async function handleInlineAsk(textarea) {
  const topic = getSelectedTopic();
  const session = getActiveSession();
  const question = textarea.value.trim();
  const afterParagraph = Number(textarea.dataset.afterParagraph);

  if (!topic || !session || !question) return;

  const paragraphText = getLessonParagraphs(topic, session)[afterParagraph] || '';
  const threadId = `inline-${crypto.randomUUID()}`;

  updateSessionById(session.id, (s) => {
    const inlineThreads = Array.isArray(s.inlineThreads) ? s.inlineThreads : [];
    return {
      ...s,
      inlineThreads: [...inlineThreads, { id: threadId, afterParagraph, userText: question, aiText: '', status: 'loading' }]
    };
  });

  textarea.value = '';
  textarea.style.height = '28px';
  textarea.closest('.inline-composer')?.classList.remove('inline-composer-expanded');

  render();
  await syncStateToFile();

  try {
    const result = await askInline(topic, session, paragraphText, question);
    const aiReply = result.answer || (state.lang === 'en' ? 'No answer generated.' : '未生成回答。');

    updateSessionById(session.id, (s) => ({
      ...s,
      inlineThreads: (Array.isArray(s.inlineThreads) ? s.inlineThreads : []).map((thread) =>
        thread.id === threadId ? { ...thread, aiText: aiReply, status: 'done' } : thread
      )
    }));

    setStatus('');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Inline ask failed';
    updateSessionById(session.id, (s) => ({
      ...s,
      inlineThreads: (Array.isArray(s.inlineThreads) ? s.inlineThreads : []).map((thread) =>
        thread.id === threadId ? { ...thread, aiText: message, status: 'error' } : thread
      )
    }));
    setStatus(message);
  }

  await syncStateToFile();
  render();
}

function bindLessonFlowEvents() {
  const lessonFlow = $('lessonFlow');

  lessonFlow.addEventListener('focusin', (event) => {
    const textarea = event.target.closest('.inline-input');
    if (!textarea) return;
    textarea.closest('.inline-composer')?.classList.add('inline-composer-expanded');
    resizeInlineInput(textarea);
  });

  lessonFlow.addEventListener('focusout', (event) => {
    const textarea = event.target.closest('.inline-input');
    if (!textarea) return;

    if (!textarea.value.trim()) {
      textarea.style.height = '28px';
      textarea.closest('.inline-composer')?.classList.remove('inline-composer-expanded');
    }
  });

  lessonFlow.addEventListener('input', (event) => {
    const textarea = event.target.closest('.inline-input');
    if (!textarea) return;

    if (textarea.value.trim()) {
      textarea.closest('.inline-composer')?.classList.add('inline-composer-expanded');
    }

    resizeInlineInput(textarea);
  });

  lessonFlow.addEventListener('keydown', async (event) => {
    const textarea = event.target.closest('.inline-input');
    if (!textarea) return;

    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      await handleInlineAsk(textarea);
    }
  });

  lessonFlow.addEventListener('click', async (event) => {
    const button = event.target.closest('.inline-send');
    if (!button) return;

    const parent = button.closest('.inline-composer');
    const textarea = parent?.querySelector('.inline-input');
    if (!textarea) return;

    await handleInlineAsk(textarea);
  });
}

function bindEvents() {
  $('providerSelect').addEventListener('change', (event) => {
    state.provider = event.target.value;
    setStatus('');
    render();
  });

  $('languageSelect').addEventListener('change', (event) => {
    state.lang = event.target.value;
    setStatus('');
    render();
  });

  $('exportBtn').addEventListener('click', () => {
    window.location.href = '/api/export-state';
  });

  $('importFileInput').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      await fetchJson('/api/import-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      await loadStateFromFile();
      setStatus(t('import_success'));
      render();
    } catch {
      setStatus(t('import_fail'));
      render();
    } finally {
      event.target.value = '';
    }
  });

  $('topicForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = $('titleInput').value.trim();
    const goal = $('goalInput').value.trim();
    const mode = $('modeInput').value;

    if (!title || !goal) return;

    const topic = createTopic(title, goal, mode);
    state.topics.unshift(topic);
    state.selectedTopicId = topic.id;

    await syncStateToFile();

    $('titleInput').value = '';
    $('goalInput').value = '';

    setStatus('');
    render();
  });

  $('continueBtn').addEventListener('click', () => {
    setStatus('');
    render();
  });

  $('startSessionBtn').addEventListener('click', async () => {
    const topic = getSelectedTopic();
    if (!topic) return;

    const session = createInitialSession(topic);
    state.sessions.unshift(session);
    state.activeSessionId = session.id;

    await syncStateToFile();
    setStatus('');
    render();
  });

  $('answerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const topic = getSelectedTopic();
    const session = getActiveSession();
    const answer = $('answerInput').value.trim();

    if (!topic || !session || !answer) return;

    state.isAnalyzing = true;
    setStatus(t('analyzing'));
    render();

    try {
      const result = await analyzeAnswer(topic, session, answer);
      const updatedSession = {
        ...session,
        summary: result.summary,
        masteredPoints: result.masteredPoints,
        weakPoints: result.weakPoints,
        nextEntry: result.nextEntry,
        reviewQuestions: result.reviewQuestions,
        inlineThreads: Array.isArray(session.inlineThreads) ? session.inlineThreads : []
      };

      state.sessions = state.sessions.map((s) => (s.id === session.id ? updatedSession : s));
      state.topics = state.topics.map((tp) => (tp.id === topic.id ? syncTopicFromSession(tp, updatedSession) : tp));

      await syncStateToFile();

      $('answerInput').value = '';
      setStatus('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      state.isAnalyzing = false;
      render();
    }
  });

  bindLessonFlowEvents();
}

await loadStateFromFile();
bindEvents();
render();
