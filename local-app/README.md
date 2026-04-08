# local-app

这是当前仓库里最适合“一键本地打开”的版本。

## 目标形态
启动一次本地服务后，会自动打开浏览器到本地页面：
- 页面和 API 都来自同一个本地项目
- 所有学习数据保存在浏览器本地存储中
- 可以切换 provider：mock / openai-responses / oauth-backend

## 目录说明
- `src/server.ts`：本地服务入口，会自动打开浏览器
- `src/providers.ts`：三种 provider 的本地服务端实现
- `public/index.html`：主页面
- `public/app.js`：页面逻辑
- `public/styles.css`：页面样式

## 本地启动
1. 进入 `local-app/`
2. 复制 `.env.example` 为 `.env`
3. 安装依赖
4. 运行开发模式

示意命令：

```bash
cd local-app
cp .env.example .env
npm install
npm run dev
```

启动后默认会打开：

```text
http://127.0.0.1:8787
```

## provider 使用说明
### mock
不需要额外配置，适合先看页面和流程。

### openai-responses
需要在 `.env` 中填写：
- `OPENAI_API_KEY`
- 可选 `OPENAI_MODEL`
- 可选 `OPENAI_BASE_URL`

### oauth-backend
需要在 `.env` 中填写：
- `OAUTH_BACKEND_UPSTREAM`

这个地址应由你自己的后端 / proxy 提供。

## 当前已具备能力
- 新建学习主题
- 切换最近主题
- 开始本轮学习
- 生成首轮诊断问题
- 提交回答
- 调本地 `/api/analyze-topic-answer`
- 更新本轮沉淀
- 把结果同步回主题档案

## 下一步建议
如果你要继续往真正可用推进，最值得做的是：
1. 把当前页面再做细一点
2. 给 topic / session 加文件持久化，而不是只用浏览器本地存储
3. 增加真正的 AI 学习地图生成
4. 后续再做双击启动器或桌面打包
