# Uncommon Windows — 姚海旭

透过一扇扇不同寻常的窗户，看见超现实的远方。

## 关于作品

《Uncommon Windows》系列作品使用 **Recraft AI** 生成技术创作。每一扇窗户都是一个通向不可能世界的入口——

- 窗外是极光下的冰岛苔原
- 窗外是海中的火山喷发，岩浆四溅
- 窗外是一颗巨大的木星占满天空
- 窗外是长江奔涌而来，漫入房间
- 窗外是月球表面的孤寂景象
- 窗外是充满废弃汽车的荒芜之地
- 还有沼泽湿地、壮丽星云、漂浮冰山……

这些图像探索了"窗口"作为媒介的双重性：它既是物理空间的边界，又是想象力的起点。通过将日常的窗景置换为超现实的景象，邀请观众重新审视熟悉与陌生、现实与虚构之间的界限。

## 技术栈

- **前端**：HTML5 + CSS3 + Vanilla JavaScript
- **字体**：Playfair Display（衬线） + Inter（无衬线），来自 Google Fonts
- **设计**：暗色主题 + 渐变背景 + 毛玻璃导航
- **画廊**：响应式网格布局（3-2-1 列自适应）
- **灯箱**：全屏浏览，支持键盘导航（← → ESC）
- **动画**：滚动渐入效果 + 卡片悬停动效
- **图片优化**：全尺寸图片经 Web 优化压缩（PNG → JPEG Quality 85），缩略图独立生成

## 域名

在线访问：[yaohaixu.online](https://yaohaixu.online)

## 分支策略

```
main ── 稳定发布版，用于 GitHub Pages 生产环境部署
 │
 dev ──── 开发版，新功能实验与测试（合并至 main）
```

- `main` 分支只包含经过测试的稳定版本
- `dev` 分支是日常开发分支
- 新功能先在 dev 开发，测试通过后合入 main

## 本地开发

无需构建工具，直接在浏览器中打开 `index.html` 即可查看：

```bash
cd website
python3 -m http.server 8000
# 访问 http://localhost:8000
```

## GitHub Pages 部署

当前仓库已配置为 GitHub Pages 部署：

1. 推送 `main` 分支至 GitHub
2. 在 Repo → Settings → Pages 中选择 `main` 分支
3. 自定义域名已配置为 `yaohaixu.online`（CNAME 文件）

## 版权与许可

MIT License © 2026 姚海旭

原创 AI 艺术作品，版权所有。
