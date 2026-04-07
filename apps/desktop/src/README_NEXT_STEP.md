# 下一步接线说明

当前仓库已经包含以下内容：

- `src/types.ts`：主题与学习记录类型定义
- `src/data/seed.ts`：默认种子数据
- `src/lib/storage.ts`：本地 localStorage 读写与创建主题函数
- `src/App.dynamic.tsx`：已经连接本地数据层的动态版本主页面

## 让动态版本真正跑起来的方法

把 `src/main.tsx` 中的：

```ts
import App from './App';
import './styles.css';
```

改成：

```ts
import App from './App.dynamic';
import './styles.css';
```

然后把 `src/styles.css` 补充以下几类样式：

- `.topic-form`
- `.text-input`
- `.text-area`
- `.select-input`
- `.topic-card-active`
- `.meta-row`
- `.session-list`
- `.session-card`
- `.session-title`
- `.session-objective`
- `.session-summary`
- `.session-next`
- `.empty-state`
- `.mode-pill-active`

## 当前动态版本已具备的能力

- 首次启动自动写入种子数据
- 读取本地主题列表
- 读取当前主题最近学习记录
- 新建主题并写入本地存储
- 根据当前主题刷新主题档案和学习记录显示

## 接下来最自然的开发步骤

1. 更新 `main.tsx` 接入 `App.dynamic.tsx`
2. 补齐动态版本所需样式
3. 新增“开始本轮学习”按钮
4. 新增“本轮学习沉淀”面板
5. 新增 sessions 的创建与保存逻辑
