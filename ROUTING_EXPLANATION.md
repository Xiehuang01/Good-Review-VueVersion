# 🧭 项目路由实现方式详解

## 📋 概述

这个项目**没有使用Vue Router**，而是采用了**状态驱动的视图切换**方式来实现页面导航。这是一种轻量级的路由解决方案，适合单页应用中的简单导航需求。

## 🔧 实现原理

### 1. 状态管理
```typescript
// src/App.vue
const view = ref<ViewState>('HOME')  // 当前视图状态

// 视图切换方法
const setView = (newView: ViewState) => {
  view.value = newView
}
```

### 2. 视图状态定义
```typescript
// src/types/types.ts
export type ViewState = 'HOME' | 'IMPORT' | 'DASHBOARD' | 'QUIZ'
```

### 3. 条件渲染
```vue
<!-- src/App.vue -->
<template>
  <main>
    <!-- 根据view状态条件渲染不同组件 -->
    <ScriptGuide v-if="view === 'HOME'" />
    <Importer v-else-if="view === 'IMPORT'" @import="handleImport" />
    <BankDashboard 
      v-else-if="view === 'DASHBOARD'" 
      :banks="banks" 
      @delete="handleRequestDelete" 
      @start="handleStartQuiz" 
    />
    <QuizPlayer 
      v-else-if="view === 'QUIZ' && activeBank" 
      :bank="activeBank" 
      @exit="() => setView('DASHBOARD')" 
    />
    <div v-else>Unknown View</div>
  </main>
</template>
```

## 🗺️ 路由映射

| 状态值 | 组件 | 功能描述 |
|--------|------|----------|
| `'HOME'` | `ScriptGuide.vue` | 脚本安装指南页面 |
| `'IMPORT'` | `Importer.vue` | 题库导入页面 |
| `'DASHBOARD'` | `BankDashboard.vue` | 题库管理页面 |
| `'QUIZ'` | `QuizPlayer.vue` | 答题界面 |

## 🎯 导航触发方式

### 1. 导航栏点击
```vue
<!-- 导航按钮 -->
<button @click="setView('HOME')">指南</button>
<button @click="setView('IMPORT')">导入</button>
<button @click="setView('DASHBOARD')">题库</button>
```

### 2. 组件内部导航
```typescript
// 导入完成后自动跳转到题库页面
const handleImport = (newBank: QuestionBank) => {
  banks.value = [newBank, ...banks.value]
  setView('DASHBOARD')  // 自动跳转
}

// 开始答题
const handleStartQuiz = (id: string, selectedQuestions?: QuestionItem[]) => {
  activeBankId.value = id
  filteredQuestions.value = selectedQuestions
  setView('QUIZ')  // 跳转到答题页面
}
```

### 3. 组件事件触发
```vue
<!-- QuizPlayer组件退出时 -->
<QuizPlayer @exit="() => setView('DASHBOARD')" />
```

## ✅ 这种方式的优势

### 1. **简单轻量**
- 无需额外的路由库
- 减少项目依赖
- 代码更简洁

### 2. **状态集中管理**
- 所有导航逻辑在App.vue中
- 易于调试和维护
- 状态变化可追踪

### 3. **灵活性高**
- 可以携带复杂的状态数据
- 支持条件导航
- 易于添加导航守卫逻辑

### 4. **性能优秀**
- 组件按需渲染
- 无路由解析开销
- 状态切换即时响应

## ❌ 局限性

### 1. **无URL同步**
- 刷新页面会回到初始状态
- 无法通过URL直接访问特定页面
- 不支持浏览器前进/后退

### 2. **SEO不友好**
- 搜索引擎无法索引不同页面
- 无法分享特定页面链接

### 3. **扩展性限制**
- 适合简单的单页应用
- 复杂路由需求时会变得复杂

## 🔄 如果需要真正的路由

如果项目需要URL同步、浏览器历史记录等功能，可以升级为Vue Router：

### 1. 安装Vue Router
```bash
pnpm add vue-router@4
```

### 2. 创建路由配置
```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import ScriptGuide from '@/components/ScriptGuide.vue'
import Importer from '@/components/Importer.vue'
import BankDashboard from '@/components/BankDashboard.vue'
import QuizPlayer from '@/components/QuizPlayer.vue'

const routes = [
  { path: '/', component: ScriptGuide },
  { path: '/import', component: Importer },
  { path: '/dashboard', component: BankDashboard },
  { path: '/quiz/:id', component: QuizPlayer }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
```

### 3. 更新App.vue
```vue
<template>
  <div>
    <nav>
      <router-link to="/">指南</router-link>
      <router-link to="/import">导入</router-link>
      <router-link to="/dashboard">题库</router-link>
    </nav>
    <router-view />
  </div>
</template>
```

## 🎯 总结

当前项目采用的**状态驱动路由**方式非常适合这种功能相对简单的单页应用：

- ✅ 满足基本导航需求
- ✅ 代码简洁易维护  
- ✅ 性能优秀
- ✅ 学习成本低

对于更复杂的应用场景，建议升级到Vue Router以获得完整的路由功能。