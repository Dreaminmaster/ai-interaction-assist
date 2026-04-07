import type { TopicAnalyzerProvider, TopicAnalysisInput, TopicAnalysisResult } from './types';

function containsAny(text: string, patterns: string[]): boolean {
  return patterns.some((pattern) => text.includes(pattern));
}

export class MockTopicAnalyzer implements TopicAnalyzerProvider {
  async analyze(input: TopicAnalysisInput): Promise<TopicAnalysisResult> {
    const text = input.answer.trim();
    const masteredPoints: string[] = [];
    const weakPoints: string[] = [];

    if (text.length >= 24) {
      masteredPoints.push(`已经开始用自己的话解释“${input.topic.title}”`);
    } else {
      weakPoints.push('回答过短，当前理解可能还不完整');
    }

    if (containsAny(text, ['因为', '所以', '本质', '作用', '区别'])) {
      masteredPoints.push(`已经开始表达“${input.topic.title}”中的关系或作用`);
    } else {
      weakPoints.push(`对“${input.topic.title}”的因果关系表达还不够清楚`);
    }

    if (containsAny(text, ['例如', '比如', '像', '举个例子'])) {
      masteredPoints.push(`已经尝试用例子说明“${input.topic.title}”`);
    } else {
      weakPoints.push(`对“${input.topic.title}”还缺少例子或场景说明`);
    }

    const nextEntry = weakPoints.length
      ? `优先继续补“${weakPoints[0]}”，然后再进入下一层学习。`
      : `继续围绕“${input.topic.title}”进入下一层学习，开始生成学习地图。`;

    const summary = masteredPoints.length
      ? `已完成一轮围绕“${input.topic.title}”的初步学习，当前已形成 ${masteredPoints.join('、')}，后续仍需巩固 ${weakPoints.join('、') || '暂无明显薄弱点'}。`
      : `已开始围绕“${input.topic.title}”的学习，但当前仍处在诊断和起步阶段。`;

    return {
      summary,
      masteredPoints,
      weakPoints,
      nextEntry,
      reviewQuestions: [
        `用自己的话复述“${input.topic.title}”这一轮最关键的点。`,
        `这轮里你最容易混淆的地方是什么？`,
        `如果下一轮继续，你应该先补哪个问题？`,
      ],
      suggestedNextLesson: weakPoints[0]
        ? `下一轮先围绕“${weakPoints[0]}”做补充讲解。`
        : `下一轮可以开始为“${input.topic.title}”生成分层学习地图。`,
    };
  }
}
