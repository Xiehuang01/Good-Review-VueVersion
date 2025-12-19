# 故障排除指南

## 常见问题及解决方案

### 1. Tailwind CDN 警告

**问题**: 浏览器控制台显示 "cdn.tailwindcss.com should not be used in production"

**原因**: 浏览器缓存了旧版本的页面

**解决方案**:
- 清除浏览器缓存
- 或者强制刷新页面:
  - Windows/Linux: `Ctrl + F5`
  - macOS: `Cmd + Shift + R`
- 或者在开发者工具中右键刷新按钮选择"清空缓存并硬性重新加载"

### 2. 模块导入错误

**问题**: "The requested module does not provide an export named 'QuestionBank'"

**解决方案**: 
- 确保 TypeScript 配置正确
- 重启开发服务器: `pnpm dev`
- 清除 node_modules 并重新安装: `rm -rf node_modules && pnpm install`

### 3. 开发服务器启动问题

**问题**: 服务器无法启动或端口被占用

**解决方案**:
```bash
# 停止所有 Node.js 进程
pkill -f node

# 或者使用不同端口
pnpm dev --port 3001
```

### 4. 样式不生效

**问题**: Tailwind CSS 样式没有应用

**解决方案**:
- 确保使用 Tailwind CSS v3 (不是v4)
- 确保 `style.css` 文件包含 Tailwind 指令:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- 检查 `main.ts` 是否导入了 `./style.css`
- 检查 `tailwind.config.js` 配置
- 重启开发服务器: `pnpm dev`

### 5. Vue 组件类型错误

**问题**: Vue 组件中的 TypeScript 类型错误

**解决方案**:
- 确保安装了 `@vue/tsconfig`
- 检查 `tsconfig.json` 配置
- 重启 VS Code 或编辑器的 TypeScript 服务

## 完全重置项目

如果遇到无法解决的问题，可以尝试完全重置:

```bash
# 1. 清理依赖
rm -rf node_modules
rm pnpm-lock.yaml

# 2. 重新安装
pnpm install

# 3. 重启开发服务器
pnpm dev
```

## 获取帮助

如果问题仍然存在，请检查:
1. Node.js 版本 (推荐 18+)
2. pnpm 版本 (推荐 8+)
3. 浏览器版本 (推荐最新版本)

或者查看项目的 GitHub Issues 页面寻求帮助。