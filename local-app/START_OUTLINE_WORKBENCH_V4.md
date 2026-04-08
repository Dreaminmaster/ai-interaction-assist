# START OUTLINE WORKBENCH V4

如果你更想要的是“左边目录树更重要，父章节可以展开/收起，当前小节主要通过左侧高亮体现，回答后自动推进下一节”的结构，请直接使用 Outline Workbench V4。

## 推荐入口

### Windows
- `start-outline-workbench-v4.bat`

### Linux
- `start-outline-workbench-v4.sh`

### macOS
- 当前仓库里其余版本都使用 `.command` 作为启动器。V4 的 macOS 启动器这次被连接器拦了一下，还没写进去，但实际应启动：`src/server.outline-workbench.v4.ts`。

## 它会启动什么

- 服务入口：`src/server.outline-workbench.v4.ts`
- 页面入口：`public/index.outline-workbench.v4.html`
- 前端逻辑：`public/app.outline-workbench.v4.js`

## 这一版更接近什么

这一版更接近“目录驱动的交互式学习系统”，而不是聊天式学习界面：

- 左边目录树是主轴
- 父章节可展开 / 收起
- 当前小节主要通过左侧节点高亮体现
- 右边更像当前小节的内容页
- 回答后会尝试自动推进到下一节

## 这一版已经具备

- 目录树 / 大纲生成
- 当前节点选择
- 父章节展开 / 收起
- 当前小节内容页
- 当前问题与引导
- 回答分析
- 连续追问生成
- 自动推进下一节
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
- `src/server.outline-workbench.v4.ts`
- `public/index.outline-workbench.v4.html`
- `public/app.outline-workbench.v4.js`
- `public/styles.outline-workbench.v3.css`

## 如果你只想测试这一版流程

1. 先运行 `start-outline-workbench-v4.*`
2. provider 先保持 `mock`
3. 创建一个主题
4. 观察左侧目录树是否生成
5. 展开或收起父章节
6. 在左侧点选某个小节
7. 点击“开始本轮学习”
8. 回答当前问题
9. 观察是否自动推进到下一节

## 它和其他版本的区别

### Outline Workbench V4
更偏：
- 左边目录树状态更强
- 父章节可展开 / 收起
- 当前节点高亮更明显
- 回答后自动推进下一节
- 更接近课程式目录系统

### Outline Workbench V3
更偏：
- 左边目录树状态更强
- 当前节点高亮明显
- 但还没有自动推进下一节

### Full V2
更偏：
- 学习地图
- 连续追问
- 多轮问答轨迹
- 更强的交互过程感

## 当前还可以继续加强的地方

- 补上 V4 的 macOS `.command` 启动器
- 右侧内容页继续做成更完整的“课程页”
- 当前节点完成后左侧状态变化可以再更明显
- 继续补“一句话核心结论 / 小练习 / 完成本节按钮”
