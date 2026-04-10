const messages = {
  'zh-CN': {
    create_topic: '新建学习主题',
    title_placeholder: '主题名称，例如 反脆弱',
    goal_placeholder: '学习目标，例如用自己的案例解释反脆弱',
    mode_basic: '补基础模式',
    mode_understand: '理解模式',
    mode_exam: '考试模式',
    mode_defense: '答辩模式',
    mode_paper: '论文模式',
    mode_project: '项目模式',
    create_topic_button: '创建主题',
    recent_topics: '最近主题',
    export_backup: '导出学习备份',
    import_backup: '导入学习备份',
    provider_config_title: 'Provider 配置',
    save_provider_config: '保存 Provider 配置',
    provider_config_saved: 'Provider 配置已保存。',
    test_provider: '测试当前 Provider 连接',
    provider_test_ok: '连接成功：',
    provider_test_fail: '连接失败：',
    reading_flow: '正文',
    current_questions: '提问环节',
    start_session: '开始本轮学习',
    answer_placeholder: '写你的理解、疑问或例子。',
    submit_answer: '提交并更新进度',
    topic_profile: '学习画像',
    current_mode: '当前模式',
    current_stage: '当前阶段',
    current_status: '当前状态',
    next_entry: '下一步',
    no_weak_points: '当前还没有记录薄弱点。',
    start_session_first: '请先点击“开始本轮学习”。',
    ask_between: '在这段后提问…',
    ask_button: '提问',
    inline_loading: 'AI 正在回答…',
    empty_lesson: '创建主题并开始学习后，这里会出现正文段落。',
    provider_label: '当前 provider：',
    analyzing: '正在分析当前回答…',
    import_success: '导入成功，学习状态已恢复。',
    import_fail: '导入失败。',
    no_goal_prefix: '目标：',
    no_next_prefix: '下一步：',
    session_summary_default: '提交回答后，这里会出现新的学习总结。',
    current_topic: '当前主题'
  },
  en: {
    create_topic: 'Create Topic',
    title_placeholder: 'Topic title, e.g. Antifragile',
    goal_placeholder: 'Goal, e.g. explain antifragility with personal cases',
    mode_basic: 'Foundation Mode',
    mode_understand: 'Understanding Mode',
    mode_exam: 'Exam Mode',
    mode_defense: 'Defense Mode',
    mode_paper: 'Paper Mode',
    mode_project: 'Project Mode',
    create_topic_button: 'Create Topic',
    recent_topics: 'Recent Topics',
    export_backup: 'Export Backup',
    import_backup: 'Import Backup',
    provider_config_title: 'Provider Config',
    save_provider_config: 'Save Provider Config',
    provider_config_saved: 'Provider config saved.',
    test_provider: 'Test Current Provider',
    provider_test_ok: 'Connection OK: ',
    provider_test_fail: 'Connection Failed: ',
    reading_flow: 'Reading',
    current_questions: 'Questioning',
    start_session: 'Start Session',
    answer_placeholder: 'Write your understanding, confusion, or examples.',
    submit_answer: 'Submit and Update',
    topic_profile: 'Learning Profile',
    current_mode: 'Mode',
    current_stage: 'Stage',
    current_status: 'Status',
    next_entry: 'Next',
    no_weak_points: 'No weak points recorded yet.',
    start_session_first: 'Click "Start Session" first.',
    ask_between: 'Ask after this paragraph…',
    ask_button: 'Ask',
    inline_loading: 'AI is responding…',
    empty_lesson: 'Create a topic and start learning to see paragraph flow here.',
    provider_label: 'Current provider: ',
    analyzing: 'Analyzing the current answer…',
    import_success: 'Import succeeded. State restored.',
    import_fail: 'Import failed.',
    no_goal_prefix: 'Goal: ',
    no_next_prefix: 'Next: ',
    session_summary_default: 'A new summary appears here after submission.',
    current_topic: 'Current Topic'
  }
};

const seedTopics = [
  {
    id: 'topic-antifragile',
    title: '反脆弱',
    goal: '理解反脆弱、杠铃策略、压力与成长的关系。',
    mode: '理解模式',
    currentStage: '初始阅读',
    status: '进行中',
    lastSummary: '先建立核心定义，再通过生活和工作场景理解。',
    nextEntry: '先明确“脆弱/坚韧/反脆弱”的区别。',
    weakPoints: [],
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
  statusMessage: '',
  providerConfig: {
    openaiBaseUrl: '',
    openaiModel: '',
    openaiApiKey: '',
    localModelBaseUrl: '',
    localModelName: '',
    localModelApiKey: '',
    oauthBackendUpstream: '',
    oauthAccessToken: ''
  }
};

const byId = (id) => document.getElementById(id);
const t = (key) => messages[state.lang]?.[key] || key;

async function fetchJson(url, options = {}) {
  const r = await fetch(url, options);
  if (!r.ok) throw new Error((await r.text()) || `Request failed: ${r.status}`);
  return r.json();
}

function setText(id, text) {
  const el = byId(id);
  if (el) el.textContent = text;
}

function setList(id, items, empty) {
  const el = byId(id);
  if (!el) return;
  el.innerHTML = '';
  const data = items?.length ? items : [empty];
  data.forEach((x) => {
    const li = document.createElement('li');
    li.textContent = x;
    el.appendChild(li);
  });
}

function getTopic() {
  return state.topics.find((x) => x.id === state.selectedTopicId) || state.topics[0] || null;
}

function getSession() {
  return state.sessions.find((x) => x.id === state.activeSessionId) || null;
}

function buildAutoSession(topic) {
  return {
    id: `session-${crypto.randomUUID()}`,
    topicId: topic.id,
    title: `${topic.title} · ${state.lang === 'en' ? 'Session' : '学习轮次'}`,
    objective: topic.goal,
    summary: state.lang === 'en' ? 'Session started.' : '已开始学习。',
    masteredPoints: [],
    weakPoints: [],
    reviewQuestions:
      state.lang === 'en'
        ? ['What is the core idea in this section?', 'Give one real-life example.', 'What is still unclear?']
        : ['这一节的核心观点是什么？', '请给一个生活或工作中的例子。', '你还不确定的点是什么？'],
    nextEntry: state.lang === 'en' ? 'Answer current questions.' : '先回答当前问题。',
    createdAt: new Date().toISOString(),
    inlineThreads: []
  };
}

function getRecentSessions(topicId) {
  return state.sessions
    .filter((s) => s.topicId === topicId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function loadState() {
  try {
    const s = await fetchJson('/api/state');
    state.topics = Array.isArray(s.topics) && s.topics.length ? s.topics : seedTopics;
    state.sessions = Array.isArray(s.sessions) ? s.sessions : [];
  } catch {
    state.topics = seedTopics;
    state.sessions = [];
    await syncState();
  }
  state.selectedTopicId = state.topics[0]?.id || '';
  state.activeSessionId = getRecentSessions(state.selectedTopicId)[0]?.id || '';
}

async function syncState() {
  await fetchJson('/api/state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topics: state.topics, sessions: state.sessions })
  });
}

function loadProviderConfig() {
  try {
    const raw = localStorage.getItem('provider-config-v1');
    if (!raw) return;
    state.providerConfig = { ...state.providerConfig, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
}

function saveProviderConfig() {
  localStorage.setItem('provider-config-v1', JSON.stringify(state.providerConfig));
}

function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
  document.documentElement.lang = state.lang === 'en' ? 'en' : 'zh-CN';
}

function splitParagraphs(text) {
  if (!text) return [];
  return String(text)
    .replace(/\r\n/g, '\n')
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[。！？!?])\s*/))
    .map((x) => x.trim())
    .filter(Boolean);
}

function lessonParagraphs(topic, session) {
  const out = [];
  if (topic?.goal) out.push(`${t('no_goal_prefix')}${topic.goal}`);
  if (session?.summary) out.push(...splitParagraphs(session.summary));
  if (session?.nextEntry) out.push(`${t('no_next_prefix')}${session.nextEntry}`);
  return out;
}

function ensureInlineThreads(session) {
  if (!Array.isArray(session.inlineThreads)) session.inlineThreads = [];
  return session.inlineThreads;
}

function createComposer(afterParagraph) {
  const wrap = document.createElement('div');
  wrap.className = 'inline-composer';
  wrap.innerHTML = `
    <textarea class="inline-input" rows="1" data-after-paragraph="${afterParagraph}" placeholder="${t('ask_between')}"></textarea>
    <div class="inline-actions"><button type="button" class="inline-send" data-after-paragraph="${afterParagraph}">${t('ask_button')}</button></div>
  `;
  return wrap;
}

function createMsg(text, cls, loading = false) {
  const div = document.createElement('div');
  div.className = `inline-message ${cls}${loading ? ' inline-message-loading' : ''}`;
  div.textContent = text;
  return div;
}

function renderTopicList() {
  const list = byId('topicList');
  if (!list) return;
  list.innerHTML = '';
  state.topics.forEach((topic) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `topic-card ${topic.id === state.selectedTopicId ? 'topic-card-active' : ''}`;
    btn.innerHTML = `<div class="topic-card-title">${topic.title}</div><div class="topic-card-status">${topic.mode}</div><div class="topic-card-text">${topic.lastSummary || ''}</div><div class="topic-card-next">${topic.nextEntry || ''}</div>`;
    btn.onclick = () => {
      state.selectedTopicId = topic.id;
      state.activeSessionId = getRecentSessions(topic.id)[0]?.id || '';
      render();
    };
    list.appendChild(btn);
  });
}

function renderMeta(topic, session) {
  setText('topicTitle', topic?.title || 'AI 交互式学习系统');
  setText('topicGoal', topic?.goal || '');
  setText('breadcrumbText', `Learning / ${topic?.title || '-'} / ${session?.title || '01-开始'}`);
  setText('topicMode', topic?.mode || '-');
  setText('topicStage', topic?.currentStage || '-');
  setText('topicStatus', topic?.status || '-');
  setText('topicNext', topic?.nextEntry || '-');
  setList('weakPointList', topic?.weakPoints || [], t('no_weak_points'));
  setText('sessionSummary', session?.summary || t('session_summary_default'));
  setText('sessionNext', session?.nextEntry || '-');
}

function renderQuestions(session) {
  const q = byId('questionList');
  if (!q) return;
  q.innerHTML = '';
  const arr = session?.reviewQuestions?.length ? session.reviewQuestions : [t('start_session_first')];
  arr.forEach((x) => {
    const li = document.createElement('li');
    li.textContent = x;
    q.appendChild(li);
  });
}

function renderLessonFlow(topic, session) {
  const wrap = byId('lessonFlow');
  if (!wrap) return;
  wrap.innerHTML = '';

  const paragraphs = lessonParagraphs(topic, session);
  if (!paragraphs.length) {
    wrap.innerHTML = `<div>${t('empty_lesson')}</div>`;
    return;
  }

  const threads = session ? ensureInlineThreads(session) : [];
  const frag = document.createDocumentFragment();

  paragraphs.forEach((text, idx) => {
    const p = document.createElement('article');
    p.className = 'lesson-paragraph';
    p.textContent = text;
    frag.appendChild(p);

    const gap = document.createElement('div');
    gap.className = 'inline-gap';
    threads.filter((tItem) => Number(tItem.afterParagraph) === idx).forEach((tItem) => {
      gap.appendChild(createMsg(tItem.userText, 'inline-message-user'));
      gap.appendChild(createMsg(tItem.aiText || t('inline_loading'), 'inline-message-ai', tItem.status === 'loading'));
    });
    gap.appendChild(createComposer(idx));
    frag.appendChild(gap);
  });

  wrap.appendChild(frag);
}

async function analyzeAnswer(topic, session, answer) {
  return fetchJson('/api/analyze-topic-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: state.provider, topic, session, answer, providerConfig: state.providerConfig })
  });
}

async function askInline(topic, session, paragraph, question) {
  return fetchJson('/api/ask-inline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: state.provider, topic, session, paragraph, question, providerConfig: state.providerConfig })
  });
}

async function testProvider() {
  return fetchJson('/api/test-provider', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: state.provider, providerConfig: state.providerConfig })
  });
}

function validateProviderConfig(provider, cfg) {
  if (provider === 'openai-responses' && !cfg.openaiApiKey) {
    return 'openai-responses 需要填写 OPENAI_API_KEY。';
  }
  if (provider === 'local-openai-compatible' && (!cfg.localModelBaseUrl || !cfg.localModelName)) {
    return 'local-openai-compatible 需要填写 Local Model Base URL 和 Local Model Name。';
  }
  if (provider === 'oauth-backend' && !cfg.oauthBackendUpstream) {
    return 'oauth-backend 需要填写 OAuth Backend Upstream URL。';
  }
  return '';
}

function renderStatus() {
  const base = state.isAnalyzing ? t('analyzing') : `${t('provider_label')}${state.provider}`;
  setText('statusText', state.statusMessage || base);
  const submit = byId('submitAnswerBtn');
  const answer = byId('answerInput');
  if (submit) submit.disabled = state.isAnalyzing;
  if (answer) answer.disabled = state.isAnalyzing;
}

function render() {
  applyI18n();
  renderTopicList();

  const topic = getTopic();
  const session = getSession();
  renderMeta(topic, session);
  renderQuestions(session);
  renderLessonFlow(topic, session);
  renderStatus();

  const providerSelect = byId('providerSelect');
  const languageSelect = byId('languageSelect');
  const testProviderBtn = byId('testProviderBtn');
  if (providerSelect) providerSelect.value = state.provider;
  if (languageSelect) languageSelect.value = state.lang;
  if (testProviderBtn) testProviderBtn.textContent = t('test_provider');

  const keys = [
    ['openaiBaseUrlInput', 'openaiBaseUrl'],
    ['openaiModelInput', 'openaiModel'],
    ['openaiApiKeyInput', 'openaiApiKey'],
    ['localBaseUrlInput', 'localModelBaseUrl'],
    ['localModelInput', 'localModelName'],
    ['localApiKeyInput', 'localModelApiKey'],
    ['oauthUpstreamInput', 'oauthBackendUpstream'],
    ['oauthAccessTokenInput', 'oauthAccessToken']
  ];
  keys.forEach(([id, key]) => {
    const el = byId(id);
    if (el) el.value = state.providerConfig[key] || '';
  });
}

function resizeInlineInput(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.max(28, Math.min(textarea.scrollHeight, 160))}px`;
}

async function handleInlineAsk(textarea) {
  const topic = getTopic();
  let session = getSession();
  const question = textarea.value.trim();
  if (!topic || !question) return;

  if (!session) {
    session = buildAutoSession(topic);
    state.sessions.unshift(session);
    state.activeSessionId = session.id;
  }

  const afterParagraph = Number(textarea.dataset.afterParagraph);
  const paragraph = lessonParagraphs(topic, session)[afterParagraph] || '';
  const threadId = `inline-${crypto.randomUUID()}`;
  const configError = validateProviderConfig(state.provider, state.providerConfig);
  if (configError) {
    state.statusMessage = configError;
    render();
    return;
  }

  ensureInlineThreads(session).push({ id: threadId, afterParagraph, userText: question, aiText: '', status: 'loading' });
  textarea.value = '';
  textarea.style.height = '28px';
  textarea.closest('.inline-composer')?.classList.remove('inline-composer-expanded');
  render();
  await syncState();

  try {
    const r = await askInline(topic, session, paragraph, question);
    const hit = ensureInlineThreads(session).find((x) => x.id === threadId);
    if (hit) {
      hit.aiText = r.answer || 'No answer';
      hit.status = 'done';
    }
    state.statusMessage = '';
  } catch (e) {
    const hit = ensureInlineThreads(session).find((x) => x.id === threadId);
    const msg = e instanceof Error ? e.message : 'inline ask failed';
    if (hit) {
      hit.aiText = msg;
      hit.status = 'error';
    }
    state.statusMessage = msg;
  }

  await syncState();
  render();
}

function bindLessonFlowEvents() {
  const lessonFlow = byId('lessonFlow');
  if (!lessonFlow) return;

  lessonFlow.addEventListener('focusin', (event) => {
    const textarea = event.target.closest('.inline-input');
    if (!textarea) return;
    textarea.closest('.inline-composer')?.classList.add('inline-composer-expanded');
    resizeInlineInput(textarea);
  });

  lessonFlow.addEventListener('focusout', (event) => {
    const textarea = event.target.closest('.inline-input');
    if (!textarea || textarea.value.trim()) return;
    textarea.closest('.inline-composer')?.classList.remove('inline-composer-expanded');
    textarea.style.height = '28px';
  });

  lessonFlow.addEventListener('input', (event) => {
    const textarea = event.target.closest('.inline-input');
    if (!textarea) return;
    if (textarea.value.trim()) textarea.closest('.inline-composer')?.classList.add('inline-composer-expanded');
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
    const btn = event.target.closest('.inline-send');
    if (!btn) return;
    const textarea = btn.closest('.inline-composer')?.querySelector('.inline-input');
    if (!textarea) return;
    await handleInlineAsk(textarea);
  });
}

function bindEvents() {
  byId('providerSelect')?.addEventListener('change', (event) => {
    state.provider = event.target.value;
    state.statusMessage = '';
    render();
  });

  byId('languageSelect')?.addEventListener('change', (event) => {
    state.lang = event.target.value;
    state.statusMessage = '';
    render();
  });

  byId('saveProviderConfigBtn')?.addEventListener('click', () => {
    state.providerConfig = {
      openaiBaseUrl: byId('openaiBaseUrlInput')?.value.trim() || '',
      openaiModel: byId('openaiModelInput')?.value.trim() || '',
      openaiApiKey: byId('openaiApiKeyInput')?.value.trim() || '',
      localModelBaseUrl: byId('localBaseUrlInput')?.value.trim() || '',
      localModelName: byId('localModelInput')?.value.trim() || '',
      localModelApiKey: byId('localApiKeyInput')?.value.trim() || '',
      oauthBackendUpstream: byId('oauthUpstreamInput')?.value.trim() || '',
      oauthAccessToken: byId('oauthAccessTokenInput')?.value.trim() || ''
    };
    saveProviderConfig();
    state.statusMessage = t('provider_config_saved');
    render();
  });

  byId('testProviderBtn')?.addEventListener('click', async () => {
    const configError = validateProviderConfig(state.provider, state.providerConfig);
    if (configError) {
      state.statusMessage = configError;
      render();
      return;
    }
    state.statusMessage = `${t('test_provider')}...`;
    render();
    try {
      const r = await testProvider();
      state.statusMessage = `${t('provider_test_ok')}${r.detail || 'ok'}`;
    } catch (e) {
      state.statusMessage = `${t('provider_test_fail')}${e instanceof Error ? e.message : 'unknown error'}`;
    }
    render();
  });

  byId('exportBtn')?.addEventListener('click', () => {
    window.location.href = '/api/export-state';
  });

  byId('importFileInput')?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      await fetchJson('/api/import-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      await loadState();
      state.statusMessage = t('import_success');
    } catch {
      state.statusMessage = t('import_fail');
    } finally {
      event.target.value = '';
      render();
    }
  });

  byId('topicForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = byId('titleInput')?.value.trim();
    const goal = byId('goalInput')?.value.trim();
    const mode = byId('modeInput')?.value || '理解模式';
    if (!title || !goal) return;

    const topic = {
      id: `topic-${crypto.randomUUID()}`,
      title,
      goal,
      mode,
      currentStage: state.lang === 'en' ? 'Created' : '已创建',
      status: state.lang === 'en' ? 'In Progress' : '进行中',
      lastSummary: state.lang === 'en' ? 'Topic created.' : '主题已创建。',
      nextEntry: state.lang === 'en' ? 'Start first session.' : '开始第一轮学习。',
      weakPoints: [],
      updatedAt: new Date().toISOString()
    };

    state.topics.unshift(topic);
    state.selectedTopicId = topic.id;
    await syncState();
    byId('titleInput').value = '';
    byId('goalInput').value = '';
    render();
  });

  byId('startSessionBtn')?.addEventListener('click', async () => {
    const topic = getTopic();
    if (!topic) return;
    const session = {
      id: `session-${crypto.randomUUID()}`,
      topicId: topic.id,
      title: `${topic.title} · ${state.lang === 'en' ? 'Session' : '学习轮次'}`,
      objective: topic.goal,
      summary: state.lang === 'en' ? 'Session started.' : '已开始学习。',
      masteredPoints: [],
      weakPoints: [],
      reviewQuestions:
        state.lang === 'en'
          ? ['What is the core idea in this section?', 'Give one real-life example.', 'What is still unclear?']
          : ['这一节的核心观点是什么？', '请给一个生活或工作中的例子。', '你还不确定的点是什么？'],
      nextEntry: state.lang === 'en' ? 'Answer current questions.' : '先回答当前问题。',
      createdAt: new Date().toISOString(),
      inlineThreads: []
    };
    state.sessions.unshift(session);
    state.activeSessionId = session.id;
    await syncState();
    render();
  });

  byId('answerForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const topic = getTopic();
    const session = getSession();
    const answer = byId('answerInput')?.value.trim();
    if (!topic || !session || !answer) return;

    state.isAnalyzing = true;
    state.statusMessage = t('analyzing');
    render();

    try {
      const result = await analyzeAnswer(topic, session, answer);
      session.summary = result.summary || session.summary;
      session.masteredPoints = Array.isArray(result.masteredPoints) ? result.masteredPoints : [];
      session.weakPoints = Array.isArray(result.weakPoints) ? result.weakPoints : [];
      session.nextEntry = result.nextEntry || session.nextEntry;
      session.reviewQuestions = Array.isArray(result.reviewQuestions) ? result.reviewQuestions : session.reviewQuestions;

      topic.lastSummary = session.summary;
      topic.nextEntry = session.nextEntry;
      topic.weakPoints = session.weakPoints;
      topic.updatedAt = new Date().toISOString();

      await syncState();
      byId('answerInput').value = '';
      state.statusMessage = '';
    } catch (e) {
      state.statusMessage = e instanceof Error ? e.message : 'analysis failed';
    } finally {
      state.isAnalyzing = false;
      render();
    }
  });

  bindLessonFlowEvents();
}

await loadState();
loadProviderConfig();
bindEvents();
render();
