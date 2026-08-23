/** 收藏增强：分组 + 导出导入 */

import { FavoriteFolder } from "./types";
import { Resource } from "./types";

const FAVORITES_KEY = "yuanli-nav-favorites";
const FOLDERS_KEY = "yuanli-nav-favorite-folders";

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

export function toggleFavorite(id: string): boolean {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  if (index >= 0) {
    favorites.splice(index, 1);
    // 从所有分组中移除
    const folders = getFolders().map((f) => ({
      ...f,
      resourceIds: f.resourceIds.filter((rid) => rid !== id),
    }));
    saveFolders(folders);
    saveFavorites(favorites);
    return false;
  }
  favorites.push(id);
  saveFavorites(favorites);
  return true;
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

export function clearFavorites(): void {
  saveFavorites([]);
  saveFolders([]);
}

export function getFolders(): FavoriteFolder[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(FOLDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveFolders(folders: FavoriteFolder[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

export function createFolder(name: string): FavoriteFolder {
  const folder: FavoriteFolder = {
    id: `folder_${Date.now()}`,
    name: name.trim() || "未命名分组",
    resourceIds: [],
    createdAt: new Date().toISOString(),
  };
  const folders = getFolders();
  folders.push(folder);
  saveFolders(folders);
  return folder;
}

export function renameFolder(id: string, name: string): void {
  const folders = getFolders().map((f) =>
    f.id === id ? { ...f, name: name.trim() || f.name } : f
  );
  saveFolders(folders);
}

export function deleteFolder(id: string): void {
  saveFolders(getFolders().filter((f) => f.id !== id));
}

export function addToFolder(folderId: string, resourceId: string): void {
  const folders = getFolders().map((f) => {
    if (f.id !== folderId) return f;
    if (f.resourceIds.includes(resourceId)) return f;
    return { ...f, resourceIds: [...f.resourceIds, resourceId] };
  });
  saveFolders(folders);
  // 确保也在收藏列表中
  const favs = getFavorites();
  if (!favs.includes(resourceId)) {
    favs.push(resourceId);
    saveFavorites(favs);
  }
}

export function removeFromFolder(folderId: string, resourceId: string): void {
  const folders = getFolders().map((f) =>
    f.id === folderId
      ? { ...f, resourceIds: f.resourceIds.filter((id) => id !== resourceId) }
      : f
  );
  saveFolders(folders);
}

/** 导出收藏 JSON */
export function exportFavoritesJson(resources: Resource[]): string {
  const ids = getFavorites();
  const folders = getFolders();
  const items = resources.filter((r) => ids.includes(r.id)).map((r) => ({
    id: r.id,
    title: r.title,
    url: r.url,
    category: r.category,
    tags: r.tags,
  }));
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      favorites: ids,
      folders,
      items,
    },
    null,
    2
  );
}

/** 导入收藏 JSON */
export function importFavoritesJson(json: string): {
  ok: boolean;
  count: number;
  error?: string;
} {
  try {
    const data = JSON.parse(json);
    const ids: string[] = Array.isArray(data.favorites)
      ? data.favorites
      : Array.isArray(data.items)
        ? data.items.map((i: { id?: string; url?: string }) => i.id).filter(Boolean)
        : [];
    if (ids.length === 0 && !Array.isArray(data.items)) {
      return { ok: false, count: 0, error: "无效的收藏文件" };
    }
    const merged = [...new Set([...getFavorites(), ...ids])];
    saveFavorites(merged);
    if (Array.isArray(data.folders)) {
      const existing = getFolders();
      const incoming = data.folders as FavoriteFolder[];
      const map = new Map(existing.map((f) => [f.id, f]));
      incoming.forEach((f) => {
        if (map.has(f.id)) {
          const cur = map.get(f.id)!;
          map.set(f.id, {
            ...cur,
            resourceIds: [...new Set([...cur.resourceIds, ...f.resourceIds])],
          });
        } else {
          map.set(f.id, f);
        }
      });
      saveFolders(Array.from(map.values()));
    }
    return { ok: true, count: ids.length };
  } catch {
    return { ok: false, count: 0, error: "JSON 解析失败" };
  }
}

/** 导出 Netscape 书签 HTML（浏览器可导入） */
export function exportBookmarksHtml(resources: Resource[]): string {
  const ids = getFavorites();
  const items = resources.filter((r) => ids.includes(r.id));
  const folders = getFolders();
  const now = Math.floor(Date.now() / 1000);

  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

  let body = "";
  if (folders.length > 0) {
    for (const folder of folders) {
      body += `    <DT><H3 ADD_DATE="${now}">${escape(folder.name)}</H3>\n`;
      body += `    <DL><p>\n`;
      for (const id of folder.resourceIds) {
        const r = items.find((x) => x.id === id);
        if (!r) continue;
        body += `      <DT><A HREF="${escape(r.url)}" ADD_DATE="${now}">${escape(r.title)}</A>\n`;
      }
      body += `    </DL><p>\n`;
    }
  }

  const inFolder = new Set(folders.flatMap((f) => f.resourceIds));
  const ungrouped = items.filter((r) => !inFolder.has(r.id));
  if (ungrouped.length > 0) {
    body += `    <DT><H3 ADD_DATE="${now}">未分组</H3>\n`;
    body += `    <DL><p>\n`;
    for (const r of ungrouped) {
      body += `      <DT><A HREF="${escape(r.url)}" ADD_DATE="${now}">${escape(r.title)}</A>\n`;
    }
    body += `    </DL><p>\n`;
  }

  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file by 源力导航. -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>源力导航收藏</TITLE>
<H1>源力导航收藏</H1>
<DL><p>
${body}
</DL><p>
`;
}

export function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
