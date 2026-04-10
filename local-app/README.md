# local-app

这是当前仓库里用于本地运行的学习系统入口，界面是白色文档化阅读布局（左侧大纲 + 中间正文）。

## 你关心的关键事实
- Provider 下拉不是假切换。
- 段落提问走 `POST /api/ask-inline`。
- 学习诊断走 `POST /api/analyze-topic-answer`。
- 现在支持页面内填写 Provider 参数并保存到浏览器本地。
- 新增了“测试当前 Provider 连接”按钮：能直接验证是否真的连通。

## 启动
```bash
cd local-app
cp .env.example .env
npm install
npm run dev
```
默认地址：`http://127.0.0.1:8787`

## Provider 说明

### 1) local-openai-compatible
用于接本地模型网关（OpenAI 兼容）。
必填：
- Local Model Base URL
- Local Model Name
可选：
- Local Model API Key

### 2) openai-responses
必填：
- OPENAI_API_KEY
可选：
- OpenAI Base URL
- OpenAI Model

### 3) oauth-backend
必填：
- OAuth Backend Upstream URL
可选：
- OAuth Access Token

### 4) mock
仅用于无模型时验证交互流程。

## 关于 OAuth “扫码登录”
当前版本不内置扫码登录按钮。原因：
- OAuth 授权页、回调域名、client 配置都属于你的 OAuth 服务端体系。
- 本项目现在是“调用你提供的 upstream + 可选 token”的接入方式。

如果你要扫码登录，我们下一步会接完整 OAuth 授权流（authorize/callback/token exchange）。

## 如何判断是不是“真接口”
1. 在左侧填完 Provider 配置并点“保存 Provider 配置”。
2. 点击“测试当前 Provider 连接”。
3. 若成功，状态栏显示“连接成功: ...”；若失败，会显示具体错误。
4. 提问失败时会在段落下方看到错误回复，而不是静默无反应。

## 主要文件
- `src/server.one-click.backup-import.ts`
- `src/providers.ts`
- `public/index.i18n.html`
- `public/styles.css`
- `public/app.i18n.js`
