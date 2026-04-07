import type { SessionRecord, Topic } from '../types';

export const seedTopics: Topic[] = [
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
    updatedAt: '2026-04-08T10:00:00.000Z',
  },
  {
    id: 'topic-plc',
    title: 'PLC 抢答系统',
    goal: '梳理抢答流程、违规状态和评分逻辑，并能用于论文和答辩。',
    mode: '论文模式',
    currentStage: '流程梳理',
    status: '进行中',
    lastSummary: '已梳理主持人开始、提前抢答、超时未抢答三个状态。',
    nextEntry: '从答题倒计时和评分流程继续。',
    weakPoints: ['答题阶段状态流转', '排名更新表达'],
    updatedAt: '2026-04-08T11:30:00.000Z',
  },
];

export const seedSessions: SessionRecord[] = [
  {
    id: 'session-pid-1',
    topicId: 'topic-pid',
    title: 'PID 第一轮基础理解',
    objective: '理解 P、I、D 三项分别在做什么。',
    summary: 'P 和 I 已经基本理解，D 还缺少直观认识。',
    masteredPoints: ['比例项会随当前误差立即响应', '积分项会逐步消除稳态误差'],
    weakPoints: ['微分项为什么能抑制超调'],
    reviewQuestions: ['P 项主要看什么量？', '为什么 I 项会累积历史误差？', 'D 项最直观的作用是什么？'],
    nextEntry: '继续学习 D 项和三项配合。',
    createdAt: '2026-04-08T10:00:00.000Z',
  },
  {
    id: 'session-plc-1',
    topicId: 'topic-plc',
    title: 'PLC 抢答流程梳理',
    objective: '先把抢答流程里的核心状态串起来。',
    summary: '开始抢答、提前抢答、超时未抢答三种情况已经能区分。',
    masteredPoints: ['主持人按下开始键后进入抢答窗口', '抢答前按键会被判为提前抢答'],
    weakPoints: ['答题倒计时后的评分和排名更新'],
    reviewQuestions: ['什么情况下判为提前抢答？', '无人按键时系统怎么处理？', '正常抢答成功后下一步进入什么状态？'],
    nextEntry: '进入答题倒计时与评分逻辑。',
    createdAt: '2026-04-08T11:30:00.000Z',
  },
];
