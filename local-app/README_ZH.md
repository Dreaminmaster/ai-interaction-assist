# local-app 中文说明

这是当前仓库里最适合“一键本地打开”的版本。

## 当前推荐入口
如果你想直接用，请优先使用：
- Windows：`start-one-click.bat`
- macOS：`start-one-click.command`
- Linux：`start-one-click.sh`

这套入口默认会走：
- `src/server.one-click.backup-import.ts`
- `public/index.i18n.html`
- `public/app.i18n.js`

也就是当前最完整的版本：
- 本地网页界面
- 自动打开浏览器
- 中英文可切换
- 导出备份
- 导入恢复
- 本地文件保存
- provider 可切换

## 当前已具备功能
- 新建学习主题
- 切换最近主题
- 开始本轮学习
- 提交回答并更新本轮沉淀
- 把结果同步回主题档案
- 本地文件持久化到 `data/state.json`
- 导出学习备份
- 读取备份文件并恢复
- 中文 / English 界面切换

## provider 说明
### mock
不需要额外配置，适合先测试完整流程。

### openai-responses
需要在 `.env` 中配置：
- `OPENAI_API_KEY`
- 可选 `OPENAI_MODEL`
- 可选 `OPENAI_BASE_URL`

### oauth-backend
需要在 `.env` 中配置：
- `OAUTH_BACKEND_UPSTREAM`

## 当前最重要的文件
- `src/server.one-click.backup-import.ts`
- `public/index.i18n.html`
- `public/app.i18n.js`
- `start-one-click.bat`
- `start-one-click.command`
- `start-one-click.sh`

## 使用建议
第一次先把 provider 保持为 `mock`，确认页面交互和学习流程符合你的预期。确认没问题后，再切到 `openai-responses` 或 `oauth-backend`。
