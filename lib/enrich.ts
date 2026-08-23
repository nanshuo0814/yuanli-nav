import { Resource } from "./types";

/** 开源相关关键词 */
const OPEN_SOURCE_HINTS = [
  "开源",
  "open source",
  "github",
  "gitlab",
  "gpl",
  "mit",
  "apache",
];

/** 国内域名/关键词 */
const CN_HINTS = [
  ".cn",
  ".com.cn",
  "国内",
  "中文",
  "腾讯",
  "阿里",
  "字节",
  "百度",
  "网易",
  "哔哩",
  "bilibili",
  "zhihu",
  "douban",
  "weibo",
  "qq.com",
  "163.com",
  "taobao",
  "jd.com",
  "feishu",
  "dingtalk",
];

/** 付费暗示 */
const PAID_HINTS = ["付费", "订阅", "premium", "pro ", "收费", "会员"];

/**
 * 根据标题/标签/URL 推断 isFree / isOpenSource / region
 * 已有手动字段则保留
 */
export function enrichResource(r: Resource): Resource {
  const text = `${r.title} ${r.description} ${r.tags.join(" ")} ${r.url}`.toLowerCase();

  const isOpenSource =
    r.isOpenSource ??
    (OPEN_SOURCE_HINTS.some((h) => text.includes(h.toLowerCase())) ||
      r.url.includes("github.com") ||
      r.tags.some((t) => /开源|open.?source/i.test(t)));

  const looksPaid = PAID_HINTS.some((h) => text.includes(h.toLowerCase()));
  const isFree =
    r.isFree ??
    (r.tags.some((t) => t === "免费" || t.toLowerCase() === "free") ||
      text.includes("免费") ||
      (!looksPaid && isOpenSource) ||
      !looksPaid);

  let region = r.region;
  if (!region) {
    const isCn = CN_HINTS.some((h) => text.includes(h.toLowerCase()));
    region = isCn ? "cn" : "global";
  }

  return {
    ...r,
    isFree,
    isOpenSource,
    region,
    isBroken: r.isBroken ?? false,
  };
}

/** 批量增强资源 */
export function enrichResources(list: Resource[]): Resource[] {
  return list.map(enrichResource);
}

/** 获取同类推荐 */
export function getSimilarResources(
  resource: Resource,
  all: Resource[],
  limit = 8
): Resource[] {
  const scored = all
    .filter((r) => r.id !== resource.id && !r.isBroken)
    .map((r) => {
      let score = 0;
      if (r.category === resource.category) score += 3;
      if (r.subCategory === resource.subCategory) score += 2;
      const shared = r.tags.filter((t) => resource.tags.includes(t)).length;
      score += shared;
      if (r.isRecommended) score += 0.5;
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.r);
}
