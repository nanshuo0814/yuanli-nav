# 源力导航

一个干净、现代、好用的全网资源聚合导航站，覆盖编程、AI、音乐、影视、软件、生活、设计、学习、热点、工具等分类。

## 技术栈

- **框架**: Next.js 15 (App Router) + TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui 风格组件
- **数据**: 本地静态文件 (`/data/resources.ts`)
- **个性化**: localStorage（收藏、主题）
- **部署**: Vercel 静态导出

## 功能特性

- 分类导航（一级 + 二级分类）
- 资源卡片 + **详情页** `/resource/[id]`（完整描述、标签、同类推荐、二维码、复制链接、收藏）
- 全局搜索：Fuse.js 模糊匹配 + 拼音首字母 + 搜索建议 + 搜索历史
- 多维筛选：免费 / 开源 / 国内 / 海外 / 仅可用
- 分页（20/40 条，URL 同步 `?page=&q=`）
- 首页：热门推荐、最新收录、分类入口、标签墙、随机发现、最近浏览
- **浏览历史** `/history`：按时间分组、单条删除
- **收藏增强**：分组文件夹、导出/导入 JSON、导出浏览器书签 HTML、一键清空、按分类筛选
- **反馈入口**：「我要收录」+ 链接失效反馈（GitHub Issue / 飞书表单，无需后端）
- **失效链接检测**：`npm run check-links` 标记 `isBroken`，前端灰显提示
- 空状态优化：联想词、热门标签、换词建议
- 主题切换：跟随系统 / 浅色 / 深色
- 完全响应式，移动端友好

## 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm / yarn / pnpm

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看。

### 构建生产版本

```bash
npm run build
```

静态文件输出到 `out/` 目录。

### 本地预览构建结果

```bash
npx serve out
```

## 项目结构

```
源力导航/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx          # 根布局 + SEO
│   ├── page.tsx            # 首页
│   ├── favorites/          # 收藏页
│   ├── history/            # 浏览历史
│   ├── resource/[id]/      # 资源详情页
│   └── category/[slug]/    # 分类页
├── components/             # React 组件
│   ├── ui/                 # shadcn/ui 基础组件
│   ├── header.tsx          # 顶部导航
│   ├── resource-card.tsx   # 资源卡片
│   ├── search-bar.tsx      # 搜索栏
│   └── ...
├── data/
│   ├── resources.ts        # 资源数据入口（合并各分类）
│   ├── categories.ts       # 分类配置
│   └── resources/          # 各分类资源文件
├── hooks/                  # 自定义 Hooks
├── lib/                    # 工具函数（搜索、收藏、主题）
└── public/                 # 静态资源
```

## 如何添加新资源

**单条添加：** 在 `data/resources/` 对应分类文件末尾追加，然后运行合并脚本。

**批量添加：** 在 `scripts/generate-bulk-part*.mjs` 中用 `r()` 函数追加。

```bash
node scripts/merge-all-resources.mjs
```

条目格式：

```typescript
{
  id: "p041",                    // 唯一 ID，建议前缀区分分类
  title: "网站名称",
  description: "简洁有用的简介",
  url: "https://example.com",    // 真实可访问的 URL
  category: "programming",       // 一级分类 slug
  subCategory: "frontend",       // 二级分类 slug
  tags: ["标签1", "标签2"],
  isRecommended: false,          // 是否推荐
  createdAt: "2024-03-15",
}
```

分类 slug 参考 `data/categories.ts` 或下方对照表。

| 分类 | category slug | 子分类示例 |
|------|--------------|-----------|
| 编程 | programming | frontend, backend, dev-tools, dev-learning |
| AI | ai | ai-tools, ai-models, ai-platforms, ai-learning |
| 音乐 | music | streaming, music-tools, music-community |
| 影视 | video | video-streaming, video-tools, video-community |
| 软件 | software | productivity, design-soft, system-tools |
| 生活 | life | shopping, travel, health, finance |
| 设计 | design | inspiration, design-tools, design-resources |
| 学习 | education | courses, language, academic |
| 热点 | news | tech-news, general-news, community |
| 工具 | tools | online-tools, converter, dev-utils |

## 部署到 Vercel

### 方式一：Vercel Dashboard

1. 将项目推送到 GitHub / GitLab / Bitbucket
2. 登录 [vercel.com](https://vercel.com)，点击 **New Project**
3. 导入仓库，Vercel 会自动检测 Next.js 项目
4. 点击 **Deploy**，无需额外配置

### 方式二：Vercel CLI

```bash
npm i -g vercel
vercel
```

按提示完成部署。

### 静态导出说明

项目已配置 `output: "export"`，构建产物为纯静态 HTML，可部署到：

- Vercel（推荐，零配置）
- GitHub Pages
- Cloudflare Pages
- 任意静态文件托管

## 数据说明

- 当前收录 **1021** 条真实优质资源（URL 去重后）
- 包含第三方资源导航站（硬核指南、虫部落、龙轩导航等）
- 包含免费影视/动漫/音乐/电子书等聚合资源
- 包含匿名文件/图片托管（StarImg、Catbox、Gofile 等）
- 参考 GitHub Awesome 列表与开源导航项目收录
- 所有链接均指向真实网站
- 无后端数据库，所有数据编译时打包
- 用户收藏和主题偏好仅存于浏览器 localStorage

### 资源数据来源

| 文件/目录 | 说明 |
|-----------|------|
| `data/resources/flat.ts` | 合并去重后的全量资源（**主数据源**） |
| `data/resources/*.ts` | 各分类原始资源文件 |
| `scripts/merge-all-resources.mjs` | 合并脚本，重新生成 flat.ts |

### 批量更新资源

```bash
# 1. 在 scripts/generate-bulk-part*.mjs 或 data/resources/*.ts 中添加条目
# 2. 运行合并脚本
node scripts/merge-all-resources.mjs
```

### 失效链接检测

```bash
npm run check-links
```

脚本会检测资源 URL 可达性，结果写入 `data/broken-links.ts`，前端自动灰显失效资源。

### 反馈入口配置

在 `.env.local` 中设置（可选）：

```bash
NEXT_PUBLIC_GITHUB_ISSUES_URL=https://github.com/nanshuo0814/yuanli-nav/issues/new
NEXT_PUBLIC_FEISHU_FORM_URL=https://your.feishu.cn/share/base/form/...
```

未配置时默认使用 GitHub Issues 模板链接。

## License

MIT
