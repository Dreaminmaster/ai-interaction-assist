# START FULL V2

如果你现在只想看当前最完整、最接近成品的一套，请直接使用 Full v2。

## 推荐入口

### Windows
- `start-learning-workbench-full-v2.bat`

### macOS
- `start-learning-workbench-full-v2.command`

### Linux
- `start-learning-workbench-full-v2.sh`

## 它会启动什么

- 服务入口：`src/server.learning-workbench.full.v2.ts`
- 页面入口：`public/index.learning-workbench.full.v2.html`
- 前端逻辑：`public/app.learning-workbench.full.v2.js`

## 这一版已经具备

- provider 扩展
- 本地模型入口
- 学习地图生成
- 连续追问生成
- 当前任务原因 / 完成标准
- 多轮问答轨迹
- 本地文件持久化
- 导入恢复 / 导出备份

## 当前最重要的相关文件

- `src/learningMap.ts`
- `src/learningMapRoutes.ts`
- `src/followUp.ts`
- `src/followUpRoutes.ts`
- `src/providers.expanded.ts`
- `src/server.learning-workbench.full.v2.ts`
- `public/index.learning-workbench.full.v2.html`
- `public/app.learning-workbench.full.v2.js`

## 如果你只想测试流程

1. 先运行 `start-learning-workbench-full-v2.*`
2. provider 先保持 `mock`
3. 创建一个主题
4. 点击“开始本轮学习”
5. 回答当前追问
6. 观察学习地图、当前追问和对话轨迹如何联动更新

## 现在和更完整成品相比还差什么

- 当前 active 节点与追问节奏的联动还可以更强
- 对话轨迹还可以做成更像聊天卡片的样子
- 工作台的视觉层级还可以继续优化
