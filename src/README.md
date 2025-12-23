# 源码目录结构

```
src/
├── components/          # Vue 组件
│   ├── ScriptGuide.vue     # 脚本指南组件
│   ├── Importer.vue        # 题库导入组件
│   ├── BankDashboard.vue   # 题库管理组件
│   └── QuizPlayer.vue      # 答题界面组件
├── composables/         # Vue 组合式函数
│   └── useLanguage.ts      # 语言切换逻辑
├── constants/           # 常量和配置
│   ├── constants.ts        # 应用常量
│   └── translations.ts     # 多语言翻译
├── types/              # TypeScript 类型定义
│   └── types.ts           # 应用类型定义
├── assets/             # 静态资源
│   ├── data/              # 默认题库数据
│   │   ├── Python.json
│   │   ├── web前端.json
│   │   └── 操作系统.json
│   └── script.js          # 用户脚本
├── styles/             # 样式文件
│   └── style.css          # 全局样式和Tailwind
├── App.vue             # 根组件
└── main.ts             # 应用入口
```

## 目录说明

### `/components`
存放所有Vue组件，按功能模块组织：
- **ScriptGuide.vue**: 用户脚本安装指南
- **Importer.vue**: 题库导入界面，支持JSON文件和文本粘贴
- **BankDashboard.vue**: 题库管理界面，显示所有题库
- **QuizPlayer.vue**: 答题界面，支持多种题型

### `/composables`
存放Vue 3组合式函数，提供可复用的逻辑：
- **useLanguage.ts**: 多语言切换功能

### `/constants`
存放应用常量和配置：
- **constants.ts**: 默认题库、用户脚本等常量
- **translations.ts**: 中英文翻译文本

### `/types`
存放TypeScript类型定义：
- **types.ts**: 题目、题库、应用状态等类型

### `/assets`
存放静态资源：
- **data/**: 默认题库JSON文件
- **script.js**: 超星作业提取脚本

### `/styles`
存放样式文件：
- **style.css**: 全局样式、Tailwind指令、自定义动画

## 路径别名

项目配置了路径别名 `@` 指向 `src` 目录，可以使用：

```typescript
// 替代相对路径
import { useLanguage } from '@/composables/useLanguage'
import type { QuestionBank } from '@/types/types'
```

