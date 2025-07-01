#!/usr/bin/env bash
git checkout main
git pull origin main

# 推 main 分支
git push origin main

# 分离 frontend 子目录为 frontend 分支
git subtree split --prefix frontend -b frontend

# 强制推 frontend 分支
git push origin frontend --force

# 清理本地 frontend 分支
git branch -D frontend 2>/dev/null || true
