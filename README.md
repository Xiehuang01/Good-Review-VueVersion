# 🎯 Good Review

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**现代化的在线复习平台 | 让学习变得更加高效和愉悦**

[🚀 在线体验](https://xiehuang01.github.io/Good-Review-VueVersion/) | [📖 使用指南](#使用指南) | [🛠️ 开发文档](#开发指南)

</div>

## ✨ 特性亮点

### 🎨 现代化设计
- **玻璃态 UI** - 采用毛玻璃效果，支持自定义模糊强度
- **动态背景** - 内置多彩渐变背景，支持自定义背景图片
- **响应式设计** - 完美适配桌面端和移动端
- **暗色模式** - 护眼的深色主题（开发中）

### 🌍 国际化支持
- **双语界面** - 中文/英文一键切换
- **本地化存储** - 语言偏好自动保存

### 📚 强大的题库功能
- **多格式导入** - 支持 JSON 文件拖拽导入
- **智能识别** - 自动识别题目类型（单选、多选、判断、填空、简答）
- **题库管理** - 分类管理，支持删除和重命名
- **数据持久化** - 本地存储，数据永不丢失

### 🎯 智能答题系统
- **多种模式** - 练习模式 / 模拟考试模式
- **实时反馈** - 即时显示答案正误
- **错题重练** - 智能筛选错题，针对性复习
- **进度统计** - 详细的答题数据分析

### 🔧 高级功能
- **题型筛选** - 按题型进行专项练习
- **随机抽题** - 模拟真实考试环境
- **HTML 渲染** - 支持代码高亮和格式化显示
- **图片支持** - 完美显示题目配图

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0 (推荐) 或 npm >= 8.0.0

### 安装与运行

```bash
# 克隆项目
git clone https://github.com/Xiehuang01/Good-Review-VueVersion.git
cd Good-Review-VueVersion

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 部署到 GitHub Pages
pnpm deploy
```

## 📖 使用指南

### 1️⃣ 安装用户脚本

1. 安装浏览器扩展 [Tampermonkey](https://www.tampermonkey.net/)
2. 在首页点击"复制脚本"按钮
3. 在 Tampermonkey 中创建新脚本并粘贴代码

### 2️⃣ 提取题库数据

1. 访问你的课程网站（如超星学习通）
2. 打开作业或考试页面
3. 点击页面右下角的悬浮按钮
4. 选择"复制 JSON"

### 3️⃣ 导入题库

1. 在应用中切换到"导入"页面
2. 粘贴 JSON 数据或拖拽文件
3. 为题库命名（可选）
4. 点击"喂给它！"完成导入

### 4️⃣ 开始练习

1. 在"题库"页面选择要练习的题库
2. 选择练习模式或考试模式
3. 开始答题，享受学习的乐趣！

## 🛠️ 开发指南

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue 3 | ^3.4.0 | 前端框架 |
| TypeScript | ^5.2.0 | 类型安全 |
| Vite | ^6.4.0 | 构建工具 |
| Vue Router | ^4.2.0 | 路由管理 |
| Tailwind CSS | ^3.4.0 | 样式框架 |
| Lucide Vue Next | ^0.460.0 | 图标库 |

### 项目结构

```
src/
├── components/          # 可复用组件
│   ├── BankDashboard.vue   # 题库仪表板
│   ├── Importer.vue        # 数据导入器
│   ├── QuizPlayer.vue      # 答题播放器
│   └── ScriptGuide.vue     # 脚本指南
├── views/              # 页面视图
│   ├── HomeView.vue        # 首页
│   ├── ImportView.vue      # 导入页
│   ├── DashboardView.vue   # 题库页
│   └── QuizView.vue        # 答题页
├── composables/        # 组合式函数
│   └── useLanguage.ts      # 语言管理
├── stores/             # 状态管理
│   └── bankStore.ts        # 题库状态
├── types/              # 类型定义
│   └── types.ts            # 全局类型
├── constants/          # 常量配置
│   ├── constants.ts        # 应用常量
│   └── translations.ts     # 国际化文本
└── assets/             # 静态资源
    ├── data/              # 示例数据
    └── images/            # 图片资源
```

### 核心概念

#### 题库数据结构

```typescript
interface QuestionBank {
  id: string
  name: string
  questions: QuestionItem[]
  createdAt: string
}

interface QuestionItem {
  id: number
  type: '单选' | '多选' | '判断' | '填空' | '简答'
  title: string
  options: Option[]
  correctAnswer: string[]
  selectedAnswer: string[]
  images?: string[]
}
```

#### 状态管理

使用 Vue 3 的 `reactive` API 进行状态管理：

```typescript
// stores/bankStore.ts
export const useBankStore = () => {
  const banks = ref<QuestionBank[]>([])
  
  const addBank = (bank: QuestionBank) => {
    banks.value.push(bank)
    saveBanks()
  }
  
  return { banks, addBank }
}
```

#### 组合式函数

```typescript
// composables/useLanguage.ts
export const useLanguage = () => {
  const language = ref<Language>('cn')
  
  const t = (key: string) => {
    return translations[language.value][key] || key
  }
  
  return { language, t }
}
```

### 开发规范

#### 代码风格

- 使用 TypeScript 严格模式
- 遵循 Vue 3 Composition API 最佳实践
- 使用 ESLint + Prettier 进行代码格式化
- 组件名使用 PascalCase
- 文件名使用 kebab-case

#### 提交规范

```bash
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链更新
```

## 🎨 自定义配置

### 主题定制

在 `src/styles/style.css` 中修改 CSS 变量：

```css
:root {
  --brand-50: #f0f9ff;
  --brand-500: #0ea5e9;
  --brand-600: #0284c7;
  /* 更多颜色变量... */
}
```

### 构建配置

在 `vite.config.ts` 中自定义构建选项：

```typescript
export default defineConfig({
  base: '/your-repo-name/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 问题反馈

- 🐛 [报告 Bug](https://github.com/Xiehuang01/Good-Review-VueVersion/issues/new?template=bug_report.md)
- 💡 [功能建议](https://github.com/Xiehuang01/Good-Review-VueVersion/issues/new?template=feature_request.md)
- 💬 [讨论交流](https://github.com/Xiehuang01/Good-Review-VueVersion/discussions)

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Lucide](https://lucide.dev/) - 美观的开源图标库

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by [Xiehuang01](https://github.com/Xiehuang01)

</div>