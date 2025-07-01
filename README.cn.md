# 电影标准名获取器

## 展示

![网页展示](/source/img/网页展示.png)

## 功能

资料来源是<https://www.themoviedb.org>

输入电影的中文名或者英文名，最后输出的格式是：

`中文名.英文名.发行年`

比如：

```txt
养蜂人.The.Beekeeper.2024
超人：红色之子.Superman:.Red.Son.2020
摇滚红与黑.Le.Rouge.et.le.Noir.
爱乐之城.La.La.Land.2016
```

有一些无法获取的信息以后再说

task:

1. 修复部分时间无法获取的问题
2. 批量输入输出
3. 电视节目

## 部署

### pages

```sh
git branch --track gh-pages origin/gh-pages # Create new gh-pages branch; Add tracking
git checkout --orphan gh-pages              # Initialize gh-pages without main's history
git reset --hard                            # Remove all history
git commit --allow-empty -m "Init"          # First commit without any files
git checkout main                           # Go back to main (or master) branch
git worktree add dist gh-pages # Add gh-pages as a worktree
```

## 引用

1. [Flask  使用 CSS 框架 - cltt - 博客园](https://www.cnblogs.com/tingtin/p/12778789.html)
