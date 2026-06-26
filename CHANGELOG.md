# Changelog

本文件记录 [yaohaixu.online](https://yaohaixu.online) 的所有版本变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

---

## [1.6.0] — 2026-06-26

### 功能 ✨
- 移动端点击图片先显示标题浮层（中文+英文），再次点击打开灯箱
- 点击其他区域自动关闭浮层
- 桌面端行为不变（hover 显示标题，点击直接打开灯箱）

## [1.5.0] — 2026-06-24

### 安全 🔒
- 添加 Content-Security-Policy，严格限制脚本/样式/图片来源为 `'self'`
- 添加 `frame-ancestors 'none'` 防止点击劫持
- 添加 `X-Content-Type-Options: nosniff` 防止 MIME 嗅探攻击
- 添加 `Referrer-Policy: strict-origin-when-cross-origin` 防隐私泄露
- JS 中 `innerHTML` 替换为 `textContent` + DOM API，消除 XSS 注入向量
- 邮箱地址采用 HTML entity 编码反爬虫

---

## [1.4.0] — 2026-06-24

### 性能 ⚡
- 全尺寸图片 resize 至 1600px：71MB → 5.5MB（压缩 92%）
- 缩略图 JPEG → WebP：3.3MB → 280KB（压缩 91%）
- Hero 背景独立优化为 16KB WebP（原 4.4MB）
- 首页添加 `<link rel="preload">` 预加载 hero 背景
- `font-display: swap` 避免字体阻塞渲染
- 首屏加载从 ~4.4MB 降至 ~16KB

---

## [1.3.0] — 2026-06-11

### 文档 📝
- 更新 README.md，补充作品说明和技术栈信息

---

## [1.2.0] — 2026-06-09

### 修复 🐛
- Gallery 叠加层中文标题在上、英文标题在下（column 布局）
- 修复 `overlay.innerHTML` 被意外删除导致标题不显示的问题
- 修复 JS 中 `cnTitle` 语法错误
- 修复图片加载异常

### 功能 ✨
- 每幅作品添加中文翻译标题
- 联系方式删除"欢迎交流与合作"文案

---

## [1.1.0] — 2026-06-09

### 功能 ✨
- Hero 背景替换为星云作品图（`looking-out-the-window--there-is-a-vast-nebula-str.jpg`）
- 添加联系方式区域（电话、微信、Instagram、邮箱）
- Footer 年份由 2024 更新为 2026

---

## [1.0.0] — 2026-06-09

### 首次发布 🎉
- 完整网站结构：Hero + Gallery + About + Footer
- 19 幅 AI 生成的超现实窗外摄影作品
- 响应式网格布局（3 / 2 / 1 列自适应）
- 全屏灯箱，支持键盘导航（← → ESC）
- 暗色主题 + Playfair Display / Inter 字体
- 滚动渐入动画 + 卡片悬停效果
- 域名 `yaohaixu.online` 配置 GitHub Pages
- 双分支策略（main 稳定版 / dev 开发版）
