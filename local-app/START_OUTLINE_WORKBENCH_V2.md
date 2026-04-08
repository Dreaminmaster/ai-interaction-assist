# START OUTLINE WORKBENCH V2

如果你更想要的是“左边目录树更重要，当前小节主要通过左侧高亮体现，右边更像当前小节内容页”的结构，请直接使用 Outline Workbench V2。

## 推荐入口

### Windows
- `start-outline-workbench-v2.bat`

### macOS
- `start-outline-workbench-v2.command`

### Linux
- `start-outline-workbench-v2.sh`

## 它会启动什么

- 服务入口：`src/server.outline-workbench.v2.ts`
- 页面入口：`public/index.outline-workbench.v2.html`
- 前端逻辑：`public/app.outline-workbench.v2.js`

## 这一版更接近什么

这一版更接近“目录驱动的交互式学习系统”，而不是聊天式学习界面：

- 左边是学习目录树
- 当前小节通过左侧节点高亮体现
- 右边更像当前小节内容页
- 右边重点是这一节的解释、问题和推进，而不是把“当前小节”再重复做成主视觉

## 这一版已经具备

- 目录树 / 大纲生成
- 当前节点选择
- 当前小节内容区
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
- `src/server.outline-workbench.v2.ts`
- `public/index.outline-workbench.v2.html`
- `public/app.outline-workbench.v2.js`

## 如果你只想测试这一版流程

1. 先运行 `start-outline-workbench-v2.*`
2. provider 先保持 `mock`
3. 创建一个主题
4. 观察左侧目录树是否生成
5. 在左侧点选某个小节
6. 点击“开始本轮学习”
7. 回答当前问题
8. 观察右侧当前小节内容与引导如何更新

## 它和其他版本的区别

### Outline Workbench V2
更偏：
- 左边目录树更强
- 当前节点高亮
- 右边小节内容页
- 更接近课程式结构

### Outline Workbench V1
更偏：
- 左边目录 + 右边当前小节卡片
- 目录感已出现，但还没把“当前小节”尽量收回到左侧

### Full V2
更偏：
- 学习地图
- 连续追问
- 多轮问答轨迹
- 更强的交互过程感

## 当前还可以继续加强的地方

- 左侧目录树的节点状态可以更明显
- 父章节展开 / 收起还可以更清楚
- 当前小节完成后自动推进下一节
- 右侧当前小节内容区可以继续做得更像“课程页”
