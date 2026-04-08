# START OUTLINE WORKBENCH V3

如果你更想要的是“左边目录树状态更明显，当前节点高亮更强，右边更像当前小节内容页”的结构，请直接使用 Outline Workbench V3。

## 推荐入口

### Windows
- `start-outline-workbench-v3.bat`

### macOS
- `start-outline-workbench-v3.command`

### Linux
- `start-outline-workbench-v3.sh`

## 它会启动什么

- 服务入口：`src/server.outline-workbench.v3.ts`
- 页面入口：`public/index.outline-workbench.v3.html`
- 前端逻辑：`public/app.outline-workbench.v3.js`
- 目录样式：`public/styles.outline-workbench.v3.css`

## 这一版更接近什么

这一版更接近“目录驱动的交互式学习系统”，重点不在聊天，而在：

- 左边目录树是主轴
- 当前小节主要通过左侧节点高亮体现
- 左侧节点状态更明显
- 右边更像当前小节的内容页，而不是聊天窗口

## 这一版已经具备

- 目录树 / 大纲生成
- 当前节点选择
- 当前小节内容页
- 当前问题与引导
- 回答分析
- 连续追问生成
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
- `src/server.outline-workbench.v3.ts`
- `public/index.outline-workbench.v3.html`
- `public/app.outline-workbench.v3.js`
- `public/styles.outline-workbench.v3.css`

## 如果你只想测试这一版流程

1. 先运行 `start-outline-workbench-v3.*`
2. provider 先保持 `mock`
3. 创建一个主题
4. 观察左侧目录树是否生成
5. 在左侧点选某个小节
6. 点击“开始本轮学习”
7. 回答当前问题
8. 观察右侧当前小节内容与引导如何更新

## 它和其他版本的区别

### Outline Workbench V3
更偏：
- 左边目录树状态更强
- 当前节点高亮更明显
- 右边更像课程页
- 更接近目录驱动的视频结构

### Outline Workbench V2
更偏：
- 左边目录树已成主轴
- 右边是当前小节内容页
- 但左侧节点状态还不够强

### Full V2
更偏：
- 学习地图
- 连续追问
- 多轮问答轨迹
- 更强的交互过程感

## 当前还可以继续加强的地方

- 左侧父章节展开 / 收起可以更清楚
- 当前小节完成后自动推进下一节
- 右侧内容页可以继续做成更完整的“课程页”
- 当前节点与学习进度的联动还可以更强
