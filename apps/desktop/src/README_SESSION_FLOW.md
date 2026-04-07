# 本轮学习流程接入说明

当前仓库已经补齐以下与“开始本轮学习”有关的文件：

- `src/lib/session.ts`
- `src/components/LearningSessionPanel.tsx`
- `src/components/SessionSummaryCard.tsx`

## 这些文件的作用

### session.ts
提供本轮学习最小逻辑：
- 生成首轮基础诊断问题
- 创建首轮学习记录
- 生成本轮总结结构

### LearningSessionPanel.tsx
这是学习页的主要流程卡片，负责展示：
- 当前主题
- 当前本轮目标
- 开始本轮学习按钮
- 本轮建议先回答的问题

### SessionSummaryCard.tsx
这是本轮沉淀卡片，负责展示：
- 本轮总结
- 已掌握
- 当前薄弱点
- 下次入口

## 建议的接入顺序

1. 在 `App.dynamic.tsx` 中引入：
   - `createInitialSession`
   - `LearningSessionPanel`
   - `SessionSummaryCard`

2. 增加一个 `activeSession` 状态，用来保存当前本轮学习记录。

3. 点击“开始本轮学习”时：
   - 根据当前主题调用 `createInitialSession(topic)`
   - 把返回的 session 放进页面状态

4. 在中间主区域中：
   - 用 `LearningSessionPanel` 展示当前本轮学习
   - 用 `SessionSummaryCard` 展示当前本轮沉淀

5. 后续再把 session 写入 `localStorage`，让它变成真正可持续的学习记录。

## 接入完成后的效果

完成后，页面会具备下面这个基本流程：

- 选择主题
- 点击“开始本轮学习”
- 系统生成首轮基础诊断问题
- 页面显示本轮学习任务
- 页面预留本轮沉淀区域

这一步虽然还没有真正接 AI，但已经把“学习流程页面”搭出来了，不再只是静态主题展示。
