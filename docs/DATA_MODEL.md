# 数据模型

## 1. 设计目标
数据模型需要支持以下能力：
- 主题长期档案
- 多轮学习记录
- 薄弱点跟踪
- 全局学习画像
- 本地资料挂载
- 后续复习与统计

第一版建议使用 SQLite。

## 2. topics 表
用于保存长期主题档案。

字段建议：
- id
- title
- goal
- mode
- current_stage
- status
- created_at
- updated_at
- last_summary
- next_entry

字段说明：
- title：主题名称
- goal：学习目标
- mode：当前默认模式
- current_stage：当前阶段
- status：进行中 / 已暂停 / 已完成
- last_summary：最近学习摘要
- next_entry：下次继续入口

## 3. sessions 表
用于保存每一轮学习记录。

字段建议：
- id
- topic_id
- session_title
- mode
- objective
- summary
- mastered_points
- weak_points
- review_questions
- next_entry
- created_at

字段说明：
- session_title：本轮标题
- objective：本轮目标
- summary：本轮总结
- mastered_points：本轮已掌握内容
- weak_points：本轮薄弱点
- review_questions：复习问题
- next_entry：下一轮入口

## 4. messages 表
用于保存本轮详细对话内容。

字段建议：
- id
- session_id
- role
- content
- created_at

说明：
- role：user / assistant / system
- content：消息正文

## 5. weak_points 表
用于长期维护薄弱点和错误类型。

字段建议：
- id
- topic_id
- point_name
- category
- description
- frequency
- status
- last_seen_at

category 可选值建议：
- 概念没懂
- 关系没理清
- 不会表达
- 不会应用
- 记忆不稳
- 前置缺失

字段说明：
- point_name：薄弱点名称
- description：具体说明
- frequency：出现次数
- status：活跃 / 已缓解 / 已掌握
- last_seen_at：最近一次出现时间

## 6. assets 表
用于挂载学习资料。

字段建议：
- id
- topic_id
- asset_type
- title
- path
- note
- created_at

asset_type 可选值示例：
- markdown
- pdf
- image
- spreadsheet
- webpage
- note

## 7. profile_memory 表
用于保存全局学习画像。

字段建议：
- id
- key
- value
- updated_at

可保存内容示例：
- preferred_explanation_style
- common_problem_pattern
- default_mode
- common_scene
- preferred_output_format

## 8. relationships
建议关系如下：
- 一个 topic 对应多条 sessions
- 一个 session 对应多条 messages
- 一个 topic 对应多条 weak_points
- 一个 topic 对应多条 assets

## 9. 第一版实现建议
第一版可以先简化：
- mastered_points、weak_points、review_questions 用 JSON 字段保存
- profile_memory 用 key-value 结构保存
- 后续再逐步拆成更细颗粒的数据表

## 10. 示例数据结构
### topic 示例
```json
{
  "title": "PID 控制",
  "goal": "理解 PID 三项各自作用，并能口头解释",
  "mode": "理解模式",
  "current_stage": "基础理解",
  "status": "进行中",
  "last_summary": "已经理解 P 和 I 的基本作用，D 仍然模糊",
  "next_entry": "从 D 项和三项配合开始继续"
}
```

### weak_point 示例
```json
{
  "point_name": "微分项的直观作用",
  "category": "概念没懂",
  "description": "知道 D 是微分，但不会解释它为什么能抑制超调",
  "frequency": 3,
  "status": "活跃"
}
```

## 11. 后续扩展方向
第二版可增加：
- 复习调度表
- 自动提醒记录
- 输出资产表
- 主题知识树节点表
- 标签系统
- 学习时长统计

这样可以支撑更强的复习和可视化能力。