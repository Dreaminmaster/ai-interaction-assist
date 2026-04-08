# QUICK START

## 你要用哪个文件
### Windows
双击：`start.bat`

### macOS
双击：`start.command`

### Linux
运行：`./start.sh`

## 第一次启动会发生什么
1. 如果没有 `.env`，脚本会自动从 `.env.example` 复制一份
2. 如果没有 `node_modules`，脚本会自动执行 `npm install`
3. 本地服务会启动
4. 浏览器会自动打开到：

```text
http://127.0.0.1:8787
```

## 第一次建议怎么用
先在页面左边把 provider 保持为：

```text
mock
```

这样你不需要任何额外配置，就能先看整个学习流程是不是你要的。

## 想接真实 OpenAI
打开 `.env`，填写：

```text
OPENAI_API_KEY=你的key
OPENAI_MODEL=gpt-5
```

然后重新运行启动脚本，再在页面左边把 provider 切到：

```text
openai-responses
```

## 想接你自己的 OAuth / proxy 后端
打开 `.env`，填写：

```text
OAUTH_BACKEND_UPSTREAM=你的后端接口地址
```

然后重新运行启动脚本，再把 provider 切到：

```text
oauth-backend
```

## 如果打不开网页
手动访问：

```text
http://127.0.0.1:8787
```

## 如果脚本启动失败
通常是以下原因：
- 没装 Node.js
- npm 不可用
- 依赖安装失败
- 端口 8787 被占用

可以先看启动窗口里的报错信息。