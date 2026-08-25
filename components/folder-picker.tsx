"use client";

import { useState } from "react";
import { FolderPlus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface FolderPickerProps {
  resourceId: string;
  variant?: "icon" | "button";
  className?: string;
}

/** 将资源加入收藏文件夹 */
export function FolderPicker({
  resourceId,
  variant = "button",
  className,
}: FolderPickerProps) {
  const {
    folders,
    mounted,
    toggleFavorite,
    isFavorite,
    addToFolder,
    removeFromFolder,
    createFolder,
  } = useFavorites();
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");

  if (!mounted) return null;

  const favorited = isFavorite(resourceId);

  const handleToggleFolder = (folderId: string, inFolder: boolean) => {
    if (!favorited) toggleFavorite(resourceId);
    if (inFolder) removeFromFolder(folderId, resourceId);
    else addToFolder(folderId, resourceId);
  };

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const folder = createFolder(name);
    if (!favorited) toggleFavorite(resourceId);
    addToFolder(folder.id, resourceId);
    setNewName("");
  };

  return (
    <div className={cn("relative", className)}>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="加入文件夹"
          title="加入文件夹"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
          }}
        >
          <FolderOpen className="h-4 w-4 text-muted-foreground" />
        </Button>
      ) : (
        <Button
          variant="outline"
          className="gap-1.5"
          onClick={() => setOpen((v) => !v)}
        >
          <FolderPlus className="h-4 w-4" />
          加入文件夹
        </Button>
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-full mt-1 z-50 w-56 rounded-lg border bg-popover shadow-lg p-2 text-sm">
            <p className="px-2 py-1 text-[11px] text-muted-foreground">
              选择文件夹
            </p>
            {folders.length === 0 ? (
              <p className="px-2 py-2 text-xs text-muted-foreground">
                暂无文件夹，先创建一个
              </p>
            ) : (
              <ul className="max-h-48 overflow-y-auto">
                {folders.map((f) => {
                  const inFolder = f.resourceIds.includes(resourceId);
                  return (
                    <li key={f.id}>
                      <button
                        type="button"
                        className={cn(
                          "w-full text-left px-2 py-1.5 rounded-md hover:bg-accent flex items-center justify-between gap-2",
                          inFolder && "bg-accent/60"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleFolder(f.id, inFolder);
                        }}
                      >
                        <span className="truncate">{f.name}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {f.resourceIds.length}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="flex gap-1 mt-2 pt-2 border-t px-1">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="新建文件夹"
                className="flex-1 h-8 rounded-md border bg-background px-2 text-xs"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                onClick={(e) => e.stopPropagation()}
              />
              <Button size="sm" className="h-8 px-2 text-xs" onClick={handleCreate}>
                添加
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
