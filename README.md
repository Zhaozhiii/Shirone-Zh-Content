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
跨仓自动发布已启用：向 `main` 推送文章、动态、配置、数据或图片后，`.github/workflows/trigger-build.yml` 会通知主题仓锁定本次内容提交、检查、构建并发布。仅修改 README 或 docs 不触发构建。加密触发凭据保存在本仓 Actions Secret `DISPATCH_TOKEN` 中，不要把令牌写入文件。

在主题仓 <https://github.com/Zhaozhiii/shirone-Zh/actions> 查看部署结果；线上 `/healthz` 返回主题提交 `code`、内容提交 `content` 和共同的发布标识 `release`。连续推送时，过时版本会跳过发布。

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
