# 本地文件持久化下一步

当前 `local-app/` 已经新增了两部分：

- `src/storage.ts`：把应用状态保存到 `local-app/data/state.json`
- `src/stateRoutes.ts`：提供两个接口
  - `GET /api/state`
  - `PUT /api/state`

## 这一步的意义
之前主题和学习记录只保存在浏览器 `localStorage` 中。
现在已经具备了改成**真正本地文件保存**的后端能力。

这样做的好处：
- 换浏览器标签页也能保留
- 清空浏览器缓存不会直接把学习进度清掉
- 以后更容易做导出 / 备份 / 同步

## 后续怎么接
### 服务端
在 `src/server.ts` 中挂载：

```ts
import { stateRouter } from './stateRoutes';
app.use('/api', stateRouter);
```

### 前端
把 `public/app.js` 里直接读写 `localStorage` 的逻辑，逐步换成：

- 首次加载时：
  - `GET /api/state`
- 每次 topics 或 sessions 变化后：
  - `PUT /api/state`

## 推荐的替换顺序
1. 先保留当前 `localStorage` 逻辑不删
2. 新增一个 `syncStateToFile()`
3. 新增一个 `loadStateFromFile()`
4. 在本地文件接口稳定后，再考虑完全切走浏览器本地存储

## 文件保存位置
默认会写到：

```text
local-app/data/state.json
```

## 目标状态
完成这一步后，`local-app/` 会更像真正的本地应用：
- 页面是网页
- 数据却不只是浏览器临时存储
- 学习记录会真实落到本地文件中
