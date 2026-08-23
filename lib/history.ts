/** localStorage 浏览记录 */

const HISTORY_KEY = "yuanli-nav-history";
const MAX_HISTORY = 100;

export interface HistoryEntry {
  id: string;
  visitedAt: string;
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToHistory(id: string): void {
  if (typeof window === "undefined") return;
  const history = getHistory().filter((h) => h.id !== id);
  history.unshift({ id, visitedAt: new Date().toISOString() });
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history.slice(0, MAX_HISTORY))
  );
}

export function removeFromHistory(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(getHistory().filter((h) => h.id !== id))
  );
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

/** 按时间分组 */
export function groupHistoryByDate(
  entries: HistoryEntry[]
): { label: string; items: HistoryEntry[] }[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const groups: Record<string, HistoryEntry[]> = {
    今天: [],
    昨天: [],
    近7天: [],
    更早: [],
  };

  for (const e of entries) {
    const d = new Date(e.visitedAt);
    if (d >= startOfToday) groups["今天"].push(e);
    else if (d >= startOfYesterday) groups["昨天"].push(e);
    else if (d >= startOfWeek) groups["近7天"].push(e);
    else groups["更早"].push(e);
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}
