# PROVIDER EXPANSION PLAN

## 当前已有 Provider 路线

当前项目已经覆盖两条主要路线：

### 1. 官方 API 路线
- `openai-responses`
- 适合正式稳定使用
- 通过 `.env` 中的 `OPENAI_API_KEY` 配置

### 2. OAuth / 自有后端路线
- `oauth-backend`
- 适合接自己的中转服务、授权服务或 proxy
- 通过 `.env` 中的 `OAUTH_BACKEND_UPSTREAM` 配置

这两条已经能覆盖：
- 官方 API
- 自有后端代理
- OAuth 风格网关

但如果希望“路扩得更宽一点”，还应增加本地部署模型路线。

---

## 建议新增的第三条路线：本地部署 AI

建议新增一个更通用的本地模型入口：

### 3. 本地模型 / 本地网关路线
建议命名为：
- `local-openai-compatible`

它的意义是：
- 不是写死某一个本地模型框架
- 而是接一切兼容 OpenAI 风格接口的本地服务

例如后续可接：
- 本地 vLLM 网关
- 本地 LM Studio server
- 本地 Ollama 的兼容层
- LocalAI
- 其他 OpenAI-compatible 本地服务

---

## 为什么建议先做 OpenAI-compatible 本地路线

因为这样前端和主流程不用大改。

当前系统已经有 provider 概念，如果新增本地部署能力，最稳的不是马上写死某一个模型品牌，而是：

### 统一抽象
- 前端只认 provider 名字
- 后端只认统一请求结构
- 本地模型只要提供 OpenAI-compatible 接口即可接入

这样后面你想切：
- OpenAI 官方 API
- 自己 OAuth / proxy
- 本地部署模型

整个 UI 层都不需要大改。

---

## 推荐的 provider 版图

建议把 provider 扩成下面四类：

### mock
用于测试页面和交互流程。

### openai-responses
官方 API 版本，适合稳定使用。

### oauth-backend
你的自有授权 / 网关 / proxy 后端。

### local-openai-compatible
本地部署模型接口。

---

## 推荐的环境变量扩展

建议后续增加：

```env
LOCAL_MODEL_BASE_URL=http://127.0.0.1:1234/v1
LOCAL_MODEL_API_KEY=
LOCAL_MODEL_NAME=local-model
```

说明：
- `LOCAL_MODEL_BASE_URL`：本地模型服务地址
- `LOCAL_MODEL_API_KEY`：如果本地服务需要 key 就填，不需要可留空
- `LOCAL_MODEL_NAME`：本地服务对应模型名

---

## 推荐的后端实现思路

当前最完整入口是：
- `src/server.one-click.backup-import.ts`

后续建议新增一个 provider 扩展版本，例如：
- `src/providers.expanded.ts`

里面把 provider 分成：

1. `analyzeMock()`
2. `analyzeOpenAI()`
3. `analyzeOAuthBackend()`
4. `analyzeLocalOpenAICompatible()`

其中 `analyzeLocalOpenAICompatible()` 的逻辑应和 OpenAI 风格类似，只是读取本地模型配置。

---

## 本地模型路线应该支持什么

建议支持：

### A. 本地基础分析
- 接收 topic / session / answer
- 返回 summary / masteredPoints / weakPoints / nextEntry

### B. 本地学习地图生成
后续进一步支持：
- 学习地图
- 节点划分
- 分层任务
- 下一轮内容生成

### C. 本地隐私优先模式
本地模型路线的价值之一是：
- 数据不出本机或不出本地网络
- 更适合做长期学习记录

---

## 推荐的 UI 层变化

当前页面 provider 下拉建议后续扩成：
- mock
- openai-responses
- oauth-backend
- local-openai-compatible

并在设置区增加：
- 本地模型地址
- 本地模型名
- 可选本地 token

---

## 结论

如果你想把路扩得更宽一点，最合理的 provider 版图是：

1. 官方 API
2. OAuth / 自有网关
3. 本地部署模型

而在工程实现上，最稳的方式不是直接写死某一个本地模型品牌，而是：

**新增一个 `local-openai-compatible` provider。**

这样你后面无论接哪种本地部署方案，都能比较顺滑地并进到当前项目里。
