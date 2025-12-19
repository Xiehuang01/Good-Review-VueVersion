#!/bin/bash

# 手动部署脚本 - 安全部署到现有GitHub Pages站点的子目录

echo "开始构建项目..."
npm run build

echo "构建完成！"
echo ""
echo "现在你需要手动将 dist/ 目录中的文件上传到你的GitHub Pages仓库的 Good-Review-VueVersion/ 目录下"
echo ""
echo "步骤："
echo "1. 复制 dist/ 目录中的所有文件"
echo "2. 在你的GitHub Pages仓库中创建 Good-Review-VueVersion/ 目录"
echo "3. 将文件粘贴到该目录中"
echo "4. 提交并推送到GitHub"
echo ""
echo "或者，如果你有权限，可以使用以下命令自动部署："
echo "git subtree push --prefix dist origin gh-pages"
echo ""
echo "构建文件位于: $(pwd)/dist/"