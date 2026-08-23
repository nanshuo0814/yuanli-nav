import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** 合并 Tailwind CSS 类名 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 格式化日期 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** 获取网站 favicon URL */
export function getFaviconUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    return "";
  }
}

/** 转义正则特殊字符 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 高亮匹配文本，返回 HTML 安全片段数组 */
export function highlightText(
  text: string,
  query: string
): { text: string; highlight: boolean }[] {
  if (!query.trim()) {
    return [{ text, highlight: false }];
  }

  const regex = new RegExp(`(${escapeRegExp(query.trim())})`, "gi");
  const parts = text.split(regex);

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      highlight: regex.test(part),
    }));
}

/** 重置 regex lastIndex（split 后 test 可能受影响，改用大小写比较） */
export function highlightTextSafe(
  text: string,
  query: string
): { text: string; highlight: boolean }[] {
  if (!query.trim()) {
    return [{ text, highlight: false }];
  }

  const lowerQuery = query.trim().toLowerCase();
  const regex = new RegExp(`(${escapeRegExp(query.trim())})`, "gi");
  const parts = text.split(regex);

  return parts
    .filter((part) => part.length > 0)
    .map((part) => ({
      text: part,
      highlight: part.toLowerCase() === lowerQuery || part.toLowerCase().includes(lowerQuery) && part.length <= query.trim().length + 2,
    }));
}

/** 简化版高亮：按 split 结果判断 */
export function getHighlightParts(
  text: string,
  query: string
): { text: string; highlight: boolean }[] {
  if (!query.trim()) return [{ text, highlight: false }];

  const q = query.trim();
  const regex = new RegExp(`(${escapeRegExp(q)})`, "gi");
  return text.split(regex).filter(Boolean).map((part) => ({
    text: part,
    highlight: part.toLowerCase() === q.toLowerCase(),
  }));
}
