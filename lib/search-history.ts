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
