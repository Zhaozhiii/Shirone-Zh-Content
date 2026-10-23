# Zhaozhiii 博客内容

这是 Shirone 站点的内容仓库，只保存文章、说说、页面数据实体、站点配置和用户图片。
主题实现、依赖、构建与部署由代码仓库负责。

## 目录边界

| 内容仓库 | 代码仓库物化路径 |
| --- | --- |
| `content/` | `src/content/` |
| `config/` | 编译进 `src/user/user-config.ts`（见本目录 README） |
| `data/` | `src/data/` |
| `assets/` | `src/assets/` |
| `public/` | `public/` |

`README.md`、`docs/` 和本仓库的 `.github/` 不会被物化，也不会触发站点重建。

## 发布状态

站点为 <https://blog.zhiii.top/>，主题代码仓为 <https://github.com/Zhaozhiii/shirone-Zh>。

本仓保存由当前博客迁出的内容，原始模板另备份于本机 `D:/Projects/Blog/.tools/content-template-backup-20261023/`，Git 历史也保留原模板。

首次发布请先提交并推送本内容仓，再提交并推送主题仓。主题仓 CI 会读取本仓 `main`。
跨仓自动触发暂未启用，`.github/workflows/trigger-build.yml.example` 仅为模板；仅推送本仓不会自动部署。服务器发布版本目前使用主题提交 SHA，启用独立内容部署前需完善内容版本关联。

## 本地预览

在代码仓执行（PowerShell）：

```powershell
cd D:\Projects\Blog\shirone-Zh
npx.cmd --yes pnpm@9.14.4 content:sync
npx.cmd --yes pnpm@9.14.4 dev
```

主题仓 `shirone.content.json` 已指向相邻的本仓目录。边写边看时另开终端运行 `npx.cmd --yes pnpm@9.14.4 content:watch`。
直接编辑本仓的文章、数据和 YAML，不修改主题仓中的同步副本。

当前共 0 篇文章。
