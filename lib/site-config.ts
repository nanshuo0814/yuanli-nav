/**
 * 站点配置：反馈通道、外链等
 * 可改成你的 GitHub 仓库 / 飞书表单地址
 */
export const siteConfig = {
  name: "源力导航",
  /** GitHub Issues 反馈（新建 Issue） */
  githubIssuesUrl:
    process.env.NEXT_PUBLIC_GITHUB_ISSUES_URL ||
    "https://github.com/nanshuo0814/yuanli-nav/issues/new",
  /** 飞书表单（可选，有则「我要收录」优先走飞书） */
  feishuFormUrl: process.env.NEXT_PUBLIC_FEISHU_FORM_URL || "",
  /** 每页资源数选项 */
  pageSizeOptions: [20, 40, 60] as const,
  defaultPageSize: 20,
};

/** 生成「我要收录」跳转链接 */
export function getSubmitResourceUrl(prefill?: {
  title?: string;
  url?: string;
}): string {
  if (siteConfig.feishuFormUrl) {
    return siteConfig.feishuFormUrl;
  }
  const params = new URLSearchParams();
  params.set("title", `[收录] ${prefill?.title || "新资源建议"}`);
  const body = [
    "## 资源信息",
    "",
    `- 标题：${prefill?.title || ""}`,
    `- 链接：${prefill?.url || ""}`,
    `- 分类：`,
    `- 简介：`,
    "",
    "## 推荐理由",
    "",
    "",
  ].join("\n");
  params.set("body", body);
  params.set("labels", "resource-submit");
  return `${siteConfig.githubIssuesUrl}?${params.toString()}`;
}

/** 生成「链接失效」反馈链接 */
export function getBrokenLinkReportUrl(resource: {
  id: string;
  title: string;
  url: string;
}): string {
  if (siteConfig.feishuFormUrl) {
    const u = new URL(siteConfig.feishuFormUrl);
    u.searchParams.set("resource_id", resource.id);
    return u.toString();
  }
  const params = new URLSearchParams();
  params.set("title", `[失效] ${resource.title}`);
  const body = [
    "## 失效反馈",
    "",
    `- ID：\`${resource.id}\``,
    `- 标题：${resource.title}`,
    `- 链接：${resource.url}`,
    `- 详情页：/resource/${resource.id}/`,
    "",
    "## 问题描述",
    "",
    "- [ ] 打不开 / 404",
    "- [ ] 域名过期",
    "- [ ] 内容已变更",
    "- [ ] 其他：",
    "",
  ].join("\n");
  params.set("body", body);
  params.set("labels", "broken-link");
  return `${siteConfig.githubIssuesUrl}?${params.toString()}`;
}
