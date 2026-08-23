"use client";

import { useMemo, useRef, useState } from "react";
import {
  Download,
  FolderPlus,
  Heart,
  Trash2,
  Upload,
} from "lucide-react";
import { ResourceGrid } from "@/components/resource-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { resources } from "@/data/resources";
import { categories, getCategoryName } from "@/data/categories";
import { useFavorites } from "@/hooks/use-favorites";
import {
  downloadText,
  exportBookmarksHtml,
  exportFavoritesJson,
  importFavoritesJson,
} from "@/lib/favorites";
import { cn } from "@/lib/utils";

/** 收藏页：分组 / 导出导入 / 分类筛选 / 清空 */
export function FavoritesPageClient() {
  const {
    favorites,
    folders,
    mounted,
    clearAll,
    createFolder,
    renameFolder,
    deleteFolder,
    refresh,
  } = useFavorites();

  const [activeFolder, setActiveFolder] = useState<string | "all" | "ungrouped">(
    "all"
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const favoriteResources = useMemo(
    () => resources.filter((r) => favorites.includes(r.id)),
    [favorites]
  );

  const displayed = useMemo(() => {
    let list = favoriteResources;
    if (activeFolder === "ungrouped") {
      const inAny = new Set(folders.flatMap((f) => f.resourceIds));
      list = list.filter((r) => !inAny.has(r.id));
    } else if (activeFolder !== "all") {
      const folder = folders.find((f) => f.id === activeFolder);
      const ids = new Set(folder?.resourceIds ?? []);
      list = list.filter((r) => ids.has(r.id));
    }
    if (categoryFilter) {
      list = list.filter((r) => r.category === categoryFilter);
    }
    return list;
  }, [favoriteResources, activeFolder, folders, categoryFilter]);

  if (!mounted) {
    return (
      <div className="py-20 text-center text-muted-foreground">加载中...</div>
    );
  }

  const handleExportJson = () => {
    downloadText(
      `yuanli-favorites-${Date.now()}.json`,
      exportFavoritesJson(resources),
      "application/json"
    );
  };

  const handleExportHtml = () => {
    downloadText(
      `yuanli-bookmarks-${Date.now()}.html`,
      exportBookmarksHtml(resources),
      "text/html"
    );
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const result = importFavoritesJson(text);
    refresh();
    alert(
      result.ok
        ? `成功导入 ${result.count} 条收藏`
        : `导入失败：${result.error}`
    );
  };

  const handleClear = () => {
    if (confirm("确定清空全部收藏与分组？此操作不可恢复。")) {
      clearAll();
      setActiveFolder("all");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">我的收藏</h1>
            <p className="text-sm text-muted-foreground">
              共 {favoriteResources.length} 条 · 数据仅存本地浏览器
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleExportJson}>
            <Download className="h-3.5 w-3.5 mr-1" />
            导出 JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportHtml}>
            <Download className="h-3.5 w-3.5 mr-1" />
            导出书签
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5 mr-1" />
            导入
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = "";
            }}
          />
          {favorites.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              清空
            </Button>
          )}
        </div>
      </div>

      {/* 分组 */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <FolderChip
            active={activeFolder === "all"}
            onClick={() => setActiveFolder("all")}
            label="全部"
            count={favoriteResources.length}
          />
          <FolderChip
            active={activeFolder === "ungrouped"}
            onClick={() => setActiveFolder("ungrouped")}
            label="未分组"
          />
          {folders.map((f) => (
            <FolderChip
              key={f.id}
              active={activeFolder === f.id}
              onClick={() => setActiveFolder(f.id)}
              label={f.name}
              count={f.resourceIds.length}
              onRename={() => {
                const name = prompt("重命名分组", f.name);
                if (name) renameFolder(f.id, name);
              }}
              onDelete={() => {
                if (confirm(`删除分组「${f.name}」？资源仍保留在收藏中。`)) {
                  deleteFolder(f.id);
                  if (activeFolder === f.id) setActiveFolder("all");
                }
              }}
            />
          ))}
        </div>
        <div className="flex gap-2 max-w-sm">
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="新建分组名称"
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newFolderName.trim()) {
                createFolder(newFolderName.trim());
                setNewFolderName("");
              }
            }}
          />
          <Button
            size="sm"
            className="h-8 shrink-0"
            disabled={!newFolderName.trim()}
            onClick={() => {
              createFolder(newFolderName.trim());
              setNewFolderName("");
            }}
          >
            <FolderPlus className="h-3.5 w-3.5 mr-1" />
            新建
          </Button>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategoryFilter("")}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs",
            !categoryFilter && "bg-secondary font-medium"
          )}
        >
          全部分类
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() =>
              setCategoryFilter((prev) => (prev === c.slug ? "" : c.slug))
            }
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs",
              categoryFilter === c.slug && "bg-secondary font-medium"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <ResourceGrid resources={displayed} emptyType="favorites" />
    </div>
  );
}

function FolderChip({
  active,
  onClick,
  label,
  count,
  onRename,
  onDelete,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count?: number;
  onRename?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border pl-2.5 pr-1 py-0.5 text-xs",
        active && "bg-primary text-primary-foreground border-primary"
      )}
    >
      <button type="button" onClick={onClick} className="py-0.5">
        {label}
        {count !== undefined && (
          <Badge
            variant={active ? "secondary" : "outline"}
            className="ml-1 h-4 px-1 text-[10px]"
          >
            {count}
          </Badge>
        )}
      </button>
      {onRename && (
        <button
          type="button"
          className="opacity-60 hover:opacity-100 px-1"
          onClick={onRename}
          title="重命名"
        >
          ✎
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          className="opacity-60 hover:opacity-100 px-1"
          onClick={onDelete}
          title="删除"
        >
          ×
        </button>
      )}
    </div>
  );
}
