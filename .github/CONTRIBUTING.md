# 贡献指南

感谢为 **源力导航** 贡献内容！

## 收录新资源

1. 在 `data/resources/` 对应分类文件中添加条目，或使用 Issue 模板 **[资源收录](https://github.com/nanshuo0814/yuanli-nav/issues/new?template=resource-submit.yml)**
2. 运行合并脚本：

```bash
node scripts/merge-all-resources.mjs
```

3. 本地验证：`npm run dev` / `npm run build`

## 反馈失效链接

- 站点内点击「反馈失效」，或使用 Issue 模板 **[链接失效](https://github.com/nanshuo0814/yuanli-nav/issues/new?template=broken-link.yml)**
- 也可查看 [链接检测报告 Issue](https://github.com/nanshuo0814/yuanli-nav/issues?q=label%3Alink-check)（每周自动更新）

## 审核看板

建议使用 GitHub Projects 管理收录与失效反馈：

1. 仓库 → **Projects** → New project
2. 列建议：`待审核` · `已收录` · `失效待修` · `已完成`
3. 自动规则：带 `resource-submit` / `broken-link` 标签的 Issue 进入看板

## 开发

```bash
npm install
npm run dev
npm run build
npm run check-links
```

## 浏览器扩展

见 [`extension/README.md`](../extension/README.md)，可将当前页快速提交收录建议。
