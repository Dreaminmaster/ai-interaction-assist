[English](#english) | [简体中文](#简体中文)

# AI Interactive Learning System

![platform](https://img.shields.io/badge/platform-local%20web%20app-blue)
![ui](https://img.shields.io/badge/ui-bilingual-green)
![storage](https://img.shields.io/badge/storage-local%20file-orange)
![provider](https://img.shields.io/badge/provider-mock%20%7C%20openai%20%7C%20oauth-purple)

A one-click local interactive learning web app with topic memory, session-based guidance, local persistence, backup restore, and bilingual UI.

---

## English

### Overview

This repository now includes a local interactive learning app that can actually be launched and used, instead of only storing prompts or workflow ideas.

The current recommended app is under:

- `local-app/`

### Recommended launchers

- Windows: `local-app/start-interactive.bat`
- macOS: `local-app/start-interactive.command`
- Linux: `local-app/start-interactive.sh`

### Recommended runtime files

- `local-app/src/server.one-click.backup-import.ts`
- `local-app/public/index.i18n.html`
- `local-app/public/app.i18n.js`

### Main features

- one-click local launch
- browser opens automatically
- topic creation and switching
- session-based interaction flow
- answer submission and session summary update
- topic profile sync
- local file persistence to `local-app/data/state.json`
- export backup JSON
- import backup JSON and restore state
- Chinese / English interface switch
- provider switch: `mock`, `openai-responses`, `oauth-backend`

### Quick start

1. Open the `local-app/` folder.
2. Run one of the launchers:
   - `start-interactive.bat`
   - `start-interactive.command`
   - `start-interactive.sh`
3. On first run, the launcher will:
   - create `.env` from `.env.example` if needed
   - install dependencies if needed
   - start the local server
   - open the browser automatically
4. Keep the provider on `mock` for your first test.
5. Create a topic.
6. Click **Start Session**.
7. Answer the generated questions.
8. Submit the answer.
9. Watch the session summary and topic profile update.
10. Export a backup if you want to save a snapshot.
11. Import a backup later if you want to restore the state.

### Provider setup

#### mock

No setup required. Use this first to verify that the interaction flow feels right.

#### openai-responses

Put the following into `.env`:

```env
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-5
```

Optional:

```env
OPENAI_BASE_URL=https://api.openai.com/v1
```

Then restart the launcher and switch the provider in the UI to `openai-responses`.

#### oauth-backend

Put the following into `.env`:

```env
OAUTH_BACKEND_UPSTREAM=your_endpoint
```

Then restart the launcher and switch the provider in the UI to `oauth-backend`.

### Recommended files to read first

- `local-app/start-interactive.bat`
- `local-app/start-interactive.command`
- `local-app/start-interactive.sh`
- `local-app/src/server.one-click.backup-import.ts`
- `local-app/public/index.i18n.html`
- `local-app/public/app.i18n.js`
- `local-app/README_EN.md`
- `local-app/README_ZH.md`

---

## 简体中文

### 项目概览

这个仓库现在已经不只是提示词或者流程设想，而是包含了一套可以直接启动使用的本地交互式学习应用。

当前推荐使用的目录是：

- `local-app/`

### 推荐启动器

- Windows：`local-app/start-interactive.bat`
- macOS：`local-app/start-interactive.command`
- Linux：`local-app/start-interactive.sh`

### 推荐运行入口

- `local-app/src/server.one-click.backup-import.ts`
- `local-app/public/index.i18n.html`
- `local-app/public/app.i18n.js`

### 主要能力

- 一键本地启动
- 自动打开浏览器
- 新建主题与切换主题
- 按 session 组织的交互学习流程
- 提交回答并更新本轮沉淀
- 同步回主题档案
- 本地文件持久化到 `local-app/data/state.json`
- 导出备份 JSON
- 导入备份 JSON 并恢复状态
- 中文 / English 界面切换
- provider 切换：`mock`、`openai-responses`、`oauth-backend`

### 快速开始

1. 打开 `local-app/` 目录。
2. 运行下面任意一个启动器：
   - `start-interactive.bat`
   - `start-interactive.command`
   - `start-interactive.sh`
3. 第一次启动时，脚本会自动：
   - 在需要时从 `.env.example` 生成 `.env`
   - 在需要时安装依赖
   - 启动本地服务
   - 自动打开浏览器
4. 第一次测试建议把 provider 保持为 `mock`。
5. 新建一个学习主题。
6. 点击“开始本轮学习”。
7. 回答系统生成的问题。
8. 提交回答。
9. 观察本轮沉淀和主题档案如何更新。
10. 需要时可以导出备份。
11. 之后也可以通过导入备份恢复学习状态。

### Provider 配置

#### mock

不需要额外配置。建议先用它确认交互流程是不是你真正想要的。

#### openai-responses

在 `.env` 中加入：

```env
OPENAI_API_KEY=你的key
OPENAI_MODEL=gpt-5
```

可选：

```env
OPENAI_BASE_URL=https://api.openai.com/v1
```

然后重新启动，再把页面里的 provider 切到 `openai-responses`。

#### oauth-backend

在 `.env` 中加入：

```env
OAUTH_BACKEND_UPSTREAM=你的接口地址
```

然后重新启动，再把页面里的 provider 切到 `oauth-backend`。

### 推荐先看这些文件

- `local-app/start-interactive.bat`
- `local-app/start-interactive.command`
- `local-app/start-interactive.sh`
- `local-app/src/server.one-click.backup-import.ts`
- `local-app/public/index.i18n.html`
- `local-app/public/app.i18n.js`
- `local-app/README_EN.md`
- `local-app/README_ZH.md`
