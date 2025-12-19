# 部署说明

## 当前状态
- 项目已配置为部署到 `https://fmusic.xyz/Good-Review-VueVersion/`
- 构建文件在 `dist/` 目录中
- 需要手动部署到你的GitHub Pages站点

## 手动部署步骤

### 方法1：直接复制文件
1. 运行 `npm run build` 构建项目
2. 将 `dist/` 目录中的所有文件复制到你的GitHub Pages仓库的 `Good-Review-VueVersion/` 目录
3. 提交并推送更改

### 方法2：使用子模块（推荐）
如果你的GitHub Pages仓库支持，可以将此项目作为子模块添加：

```bash
# 在你的GitHub Pages仓库中
git submodule add https://github.com/Xiehuang01/Good-Review-VueVersion.git Good-Review-VueVersion
cd Good-Review-VueVersion
npm install
npm run build
# 然后将构建文件移动到正确位置
```

### 方法3：自动化脚本
运行 `./deploy.sh` 获取详细的部署指导

## 验证部署
部署完成后，访问：
- https://fmusic.xyz/Good-Review-VueVersion/
- https://fmusic.xyz/Good-Review-VueVersion/test.html

## 故障排除
如果遇到路径问题，检查：
1. 文件是否正确放置在 `Good-Review-VueVersion/` 目录下
2. 所有资源文件（CSS、JS）是否都在 `assets/` 目录中
3. 路径配置是否正确（当前配置为 `/Good-Review-VueVersion/`）