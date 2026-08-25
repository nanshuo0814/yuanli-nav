/** 搜索历史 localStorage */

const KEY = "yuanli-nav-search-history";
const MAX = 12;

export function getSearchHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(query: string): void {
  if (typeof window === "undefined") return;
  const q = query.trim();
  if (!q) return;
  const list = getSearchHistory().filter(
    (item) => item.toLowerCase() !== q.toLowerCase()
  );
  list.unshift(q);
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
}

export function removeSearchHistory(query: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    KEY,
    JSON.stringify(getSearchHistory().filter((item) => item !== query))
  );
}

export function clearSearchHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

/** 热搜词统计（localStorage 聚合） */
const HOT_KEY = "yuanli-nav-hot-search";

export function recordHotSearch(query: string): void {
  if (typeof window === "undefined") return;
  const q = query.trim();
  if (!q || q.length < 2) return;
  try {
    const raw = localStorage.getItem(HOT_KEY);
    const counts: Record<string, number> = raw ? JSON.parse(raw) : {};
    counts[q] = (counts[q] ?? 0) + 1;
    localStorage.setItem(HOT_KEY, JSON.stringify(counts));
  } catch {
    /* ignore */
  }
}

export function getHotSearches(limit = 8): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HOT_KEY);
    if (!raw) return [];
    const counts: Record<string, number> = JSON.parse(raw);
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([q]) => q);
  } catch {
    return [];
  }
}
