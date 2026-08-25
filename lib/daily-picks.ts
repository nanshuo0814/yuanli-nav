import { Resource } from "./types";

/** 基于日期的确定性伪随机数 */
function createSeededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getDateSeed(date = new Date()): number {
  return (
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate()
  );
}

/** 「今日源力」：同一天内结果固定，SSR/客户端一致 */
export function getDailyPicks(
  resources: Resource[],
  count = 8,
  date = new Date()
): Resource[] {
  const pool = resources.filter((r) => !r.isBroken);
  const shuffled = [...pool];
  const random = createSeededRandom(getDateSeed(date));

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

export function formatDailyPicksDate(date = new Date()): string {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}
