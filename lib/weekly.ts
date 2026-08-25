import { Resource } from "./types";

function getWeekStart(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** 本周新收录（按 createdAt 落在本周） */
export function getWeeklyNewResources(
  resources: Resource[],
  date = new Date()
): Resource[] {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  return resources
    .filter((r) => {
      const created = new Date(r.createdAt);
      return created >= weekStart && created < weekEnd && !r.isBroken;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/** 近 7 天收录（兜底：若本周无数据则展示最近新增） */
export function getRecentWeekResources(
  resources: Resource[],
  limit = 40,
  date = new Date()
): Resource[] {
  const weekly = getWeeklyNewResources(resources, date);
  if (weekly.length >= 8) return weekly.slice(0, limit);

  const sevenDaysAgo = new Date(date);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return resources
    .filter((r) => {
      const created = new Date(r.createdAt);
      return created >= sevenDaysAgo && !r.isBroken;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

export function formatWeekRange(date = new Date()): string {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("zh-CN", { month: "long", day: "numeric" });
  return `${start.getFullYear()}年 ${fmt(start)} – ${fmt(end)}`;
}
