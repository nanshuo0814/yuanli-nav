import { pinyin } from "pinyin-pro";
import Fuse from "fuse.js";
import { Resource, SearchResult, DimensionFilters } from "./types";

/** 获取拼音首字母（如「源力导航」→ yldh） */
export function getPinyinInitials(text: string): string {
  try {
    return pinyin(text, { pattern: "first", toneType: "none", type: "array" })
      .join("")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  } catch {
    return "";
  }
}

/** 获取全拼（空格分隔） */
export function getPinyinFull(text: string): string {
  try {
    return pinyin(text, { toneType: "none", type: "array" })
      .join(" ")
      .toLowerCase();
  } catch {
    return "";
  }
}

let fuseInstance: Fuse<Resource> | null = null;
let fuseSource: Resource[] | null = null;

function getFuse(resources: Resource[]): Fuse<Resource> {
  if (fuseInstance && fuseSource === resources) return fuseInstance;
  fuseSource = resources;
  fuseInstance = new Fuse(resources, {
    keys: [
      { name: "title", weight: 0.45 },
      { name: "description", weight: 0.25 },
      { name: "tags", weight: 0.2 },
      { name: "category", weight: 0.05 },
      { name: "subCategory", weight: 0.05 },
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
  });
  return fuseInstance;
}

/**
 * 增强搜索：精确匹配优先，其次 fuse 模糊 + 拼音首字母
 */
export function searchResources(
  resources: Resource[],
  query: string
): SearchResult[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const keywords = trimmed.split(/\s+/).filter(Boolean);
  const exact: SearchResult[] = [];
  const exactIds = new Set<string>();

  for (const resource of resources) {
    const title = resource.title.toLowerCase();
    const desc = resource.description.toLowerCase();
    const tagStr = resource.tags.join(" ").toLowerCase();
    const initials = getPinyinInitials(resource.title);
    const fullPy = getPinyinFull(resource.title);
    const matchedFields: SearchResult["matchedFields"] = [];

    const allMatch = keywords.every((kw) => {
      const inTitle = title.includes(kw);
      const inDesc = desc.includes(kw);
      const inTags = tagStr.includes(kw);
      const inPy =
        initials.includes(kw) ||
        fullPy.includes(kw) ||
        initials.startsWith(kw);
      if (inTitle) matchedFields.push("title");
      if (inDesc) matchedFields.push("description");
      if (inTags) matchedFields.push("tags");
      return inTitle || inDesc || inTags || inPy;
    });

    if (allMatch) {
      exactIds.add(resource.id);
      exact.push({
        ...resource,
        matchedFields: [...new Set(matchedFields)],
        score: 0,
      });
    }
  }

  // Fuse 模糊补充
  const fuse = getFuse(resources);
  const fuzzy = fuse
    .search(trimmed)
    .filter((r) => !exactIds.has(r.item.id))
    .slice(0, 40)
    .map((r) => ({
      ...r.item,
      matchedFields: ["title"] as SearchResult["matchedFields"],
      score: r.score ?? 1,
    }));

  return [...exact, ...fuzzy];
}

/** 搜索建议（标题匹配前缀 / 拼音） */
export function getSearchSuggestions(
  resources: Resource[],
  query: string,
  limit = 8
): Resource[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 1) return [];

  const scored = resources
    .filter((r) => !r.isBroken)
    .map((r) => {
      const title = r.title.toLowerCase();
      const initials = getPinyinInitials(r.title);
      let score = 0;
      if (title.startsWith(q)) score = 3;
      else if (title.includes(q)) score = 2;
      else if (initials.startsWith(q) || initials.includes(q)) score = 1.5;
      else if (r.tags.some((t) => t.toLowerCase().includes(q))) score = 1;
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.r);
}

/** 按分类筛选 */
export function filterByCategory(
  resources: Resource[],
  category?: string,
  subCategory?: string
): Resource[] {
  let result = resources;
  if (category) result = result.filter((r) => r.category === category);
  if (subCategory) result = result.filter((r) => r.subCategory === subCategory);
  return result;
}

/** 按标签筛选 */
export function filterByTags(resources: Resource[], tags: string[]): Resource[] {
  if (tags.length === 0) return resources;
  return resources.filter((r) => tags.some((tag) => r.tags.includes(tag)));
}

/** 多维筛选 */
export function filterByDimensions(
  resources: Resource[],
  dims: DimensionFilters
): Resource[] {
  let result = resources;
  if (dims.isFree) result = result.filter((r) => r.isFree);
  if (dims.isOpenSource) result = result.filter((r) => r.isOpenSource);
  if (dims.region === "cn") {
    result = result.filter((r) => r.region === "cn" || r.region === "both");
  } else if (dims.region === "global") {
    result = result.filter((r) => r.region === "global" || r.region === "both");
  }
  if (dims.onlyAvailable) result = result.filter((r) => !r.isBroken);
  return result;
}

export function getRecommended(resources: Resource[]): Resource[] {
  return resources.filter((r) => r.isRecommended && !r.isBroken);
}

export function getLatest(resources: Resource[], limit = 12): Resource[] {
  return [...resources]
    .filter((r) => !r.isBroken)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

export function getPopularTags(
  resources: Resource[],
  limit = 30
): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  resources.forEach((r) => {
    r.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function filterResources(
  resources: Resource[],
  options: {
    query?: string;
    category?: string;
    subCategory?: string;
    tags?: string[];
    dimensions?: DimensionFilters;
  }
): Resource[] | SearchResult[] {
  let result: Resource[] | SearchResult[] = resources;

  if (options.query?.trim()) {
    result = searchResources(resources, options.query);
  }
  if (options.category) {
    result = result.filter((r) => r.category === options.category);
  }
  if (options.subCategory) {
    result = result.filter((r) => r.subCategory === options.subCategory);
  }
  if (options.tags && options.tags.length > 0) {
    result = filterByTags(result as Resource[], options.tags);
  }
  if (options.dimensions) {
    result = filterByDimensions(result as Resource[], options.dimensions);
  }

  return result;
}

export type SortMode = "default" | "recommended" | "newest" | "name";

export function sortResources(list: Resource[], mode: SortMode): Resource[] {
  const items = [...list];
  switch (mode) {
    case "recommended":
      return items.sort((a, b) => {
        if (a.isRecommended !== b.isRecommended) {
          return a.isRecommended ? -1 : 1;
        }
        return a.title.localeCompare(b.title, "zh-CN");
      });
    case "newest":
      return items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "name":
      return items.sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
    default:
      return items;
  }
}

export function getRandomResources(
  resources: Resource[],
  count = 8
): Resource[] {
  const pool = resources.filter((r) => !r.isBroken);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/** 分页切片 */
export function paginateResources<T>(
  list: T[],
  page: number,
  pageSize: number
): { items: T[]; total: number; totalPages: number; page: number } {
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    total,
    totalPages,
    page: safePage,
  };
}
