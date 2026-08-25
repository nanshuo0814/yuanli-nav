import { Resource } from "./types";

/** URL 安全的标签 slug（中文保留，特殊字符编码） */
export function tagToSlug(tag: string): string {
  return encodeURIComponent(tag.trim());
}

export function slugToTag(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export function getAllTags(resources: Resource[]): string[] {
  const set = new Set<string>();
  resources.forEach((r) => r.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "zh-CN"));
}

export function getResourcesByTag(
  resources: Resource[],
  tag: string
): Resource[] {
  return resources.filter((r) => r.tags.includes(tag));
}

export function getTagStats(resources: Resource[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  resources.forEach((r) => {
    r.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  });
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}
