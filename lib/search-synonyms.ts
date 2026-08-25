/** 搜索同义词 / 别名扩展 */
export const SEARCH_SYNONYMS: Record<string, string[]> = {
  ai: ["人工智能", "大模型", "chatgpt", "gpt"],
  人工智能: ["ai", "大模型"],
  开源: ["open source", "github", "oss"],
  免费: ["free", "白嫖"],
  影视: ["电影", "视频", "streaming", "追剧"],
  音乐: ["music", "听歌", "音频"],
  设计: ["design", "ui", "ux", "灵感"],
  工具: ["tools", "在线工具", "实用"],
  导航: ["nav", "聚合", "索引"],
  编程: ["programming", "代码", "开发", "dev"],
  前端: ["frontend", "react", "vue", "js"],
  后端: ["backend", "server", "api"],
  学习: ["教程", "course", "education"],
  电子书: ["ebook", "pdf", "阅读"],
  代理: ["vpn", "梯子", "科学上网"],
  图床: ["图片托管", "image host", "upload"],
};

/** 将查询扩展为同义词列表（含原词） */
export function expandSearchQuery(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = new Set<string>([q]);
  for (const [key, values] of Object.entries(SEARCH_SYNONYMS)) {
    const keyLower = key.toLowerCase();
    if (q.includes(keyLower) || keyLower.includes(q)) {
      terms.add(keyLower);
      values.forEach((v) => terms.add(v.toLowerCase()));
    }
    values.forEach((v) => {
      const vLower = v.toLowerCase();
      if (q.includes(vLower) || vLower.includes(q)) {
        terms.add(keyLower);
        values.forEach((x) => terms.add(x.toLowerCase()));
      }
    });
  }
  return Array.from(terms);
}

/** 热门搜索兜底（无历史时使用） */
export const DEFAULT_HOT_SEARCHES = [
  "免费",
  "开源",
  "AI",
  "设计",
  "影视",
  "工具",
  "导航",
  "前端",
];
