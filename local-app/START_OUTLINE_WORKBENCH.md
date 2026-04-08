# START OUTLINE WORKBENCH

如果你更想要的是“左边目录 / 大纲树，右边当前小节内容与引导”的结构，而不是聊天感更强的界面，请直接使用 Outline Workbench。

## 推荐入口

### Windows
- `start-outline-workbench.bat`

### macOS
- `start-outline-workbench.command`

### Linux
- `start-outline-workbench.sh`

## 它会启动什么

- 服务入口：`src/server.outline-workbench.ts`
- 页面入口：`public/index.outline-workbench.html`
- 前端逻辑：`public/app.outline-workbench.js`

## 这一版更像什么

这一版更接近“目录驱动的交互式学习系统”：

- 左边是学习目录树
- 当前小节通过左侧节点高亮体现
- 右边展示当前小节的内容、问题和学习调整
- AI 在当前目录节点中动态推进，而不是以聊天窗口为主视觉

## 这一版已经具备

- 目录树 / 大纲生成
- 当前小节选择
- 连续追问生成
- 回答分析
- 本地文件持久化
- 导入恢复 / 导出备份
- provider 扩展
- 本地模型入口

## 当前最重要的相关文件

- `src/outline.ts`
- `src/outlineRoutes.ts`
- `src/followUp.ts`
- `src/followUpRoutes.ts`
- `src/providers.expanded.ts`
- `src/server.outline-workbench.ts`
- `public/index.outline-workbench.html`
- `public/app.outline-workbench.js`

## 如果你只想测试这一版流程

1. 先运行 `start-outline-workbench.*`
2. provider 先保持 `mock`
3. 创建一个主题
4. 观察左侧目录树是否生成
5. 选择一个小节
6. 点击“开始本轮学习”
7. 回答当前问题
8. 观察右侧当前小节内容与引导如何更新

## 它和 Full v2 的区别

### Outline Workbench
更偏：
- 目录树
- 小节推进
- 当前节点学习
- 课程式结构

### Full v2
更偏：
- 学习地图
- 连续追问
- 多轮问答轨迹
- 更强的交互过程感

## 当前还可以继续加强的地方

- 左侧目录树的节点状态可以更明显
- 当前小节完成后自动推进下一节
- 右侧当前小节区可以再更像“课程页”而不是工具卡片
