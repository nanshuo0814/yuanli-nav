"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  Folder,
  FolderPlus,
  FolderOpen,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

interface FolderPickerProps {
  resourceId: string;
  variant?: "icon" | "button";
  className?: string;
}

const PANEL_WIDTH = 280;

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
  const [pos, setPos] = useState({ top: 0, left: 0, openUp: false });
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePos = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const panelHeight = 320;
      const gap = 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < panelHeight && rect.top > panelHeight;

      let left = rect.right - PANEL_WIDTH;
      left = Math.min(Math.max(12, left), window.innerWidth - PANEL_WIDTH - 12);

      const top = openUp ? rect.top : rect.bottom + gap;

      setPos({ top, left, openUp });
    };

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [open]);

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

  const panel = open ? (
    <>
      <div
        className="fixed inset-0 z-[200] bg-black/5 dark:bg-black/20"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        role="dialog"
        aria-label="选择收藏文件夹"
        className="fixed z-[201] w-[280px] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl ring-1 ring-black/5 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-150"
        style={{
          top: pos.openUp ? undefined : pos.top,
          bottom: pos.openUp ? window.innerHeight - pos.top + 8 : undefined,
          left: pos.left,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="flex items-center gap-2 border-b bg-muted/40 px-3.5 py-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <FolderOpen className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-none">加入文件夹</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              选择或新建分组
            </p>
          </div>
        </div>

        {/* 文件夹列表 */}
        <div className="max-h-[220px] overflow-y-auto p-1.5">
          {folders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                <Folder className="h-6 w-6 text-muted-foreground/70" />
              </div>
              <p className="text-sm font-medium">还没有文件夹</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                在下方创建第一个文件夹，整理你的收藏
              </p>
            </div>
          ) : (
            <ul className="space-y-0.5">
              {folders.map((f) => {
                const inFolder = f.resourceIds.includes(resourceId);
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      className={cn(
                        "group w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                        "hover:bg-accent",
                        inFolder && "bg-primary/10 hover:bg-primary/15"
                      )}
                      onClick={() => handleToggleFolder(f.id, inFolder)}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors",
                          inFolder
                            ? "border-primary/30 bg-primary/15 text-primary"
                            : "border-border bg-muted/50 text-muted-foreground group-hover:bg-background"
                        )}
                      >
                        <Folder className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate font-medium text-[13px]",
                            inFolder && "text-primary"
                          )}
                        >
                          {f.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {f.resourceIds.length} 个资源
                        </p>
                      </div>
                      {inFolder && (
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 新建文件夹 */}
        <div className="border-t bg-muted/20 p-3 space-y-2">
          <p className="text-[11px] font-medium text-muted-foreground px-0.5">
            新建文件夹
          </p>
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="输入文件夹名称"
              className="h-9 flex-1 text-sm bg-background"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") setOpen(false);
              }}
            />
            <Button
              size="sm"
              className="h-9 shrink-0 gap-1 px-3"
              disabled={!newName.trim()}
              onClick={handleCreate}
            >
              <Plus className="h-3.5 w-3.5" />
              创建
            </Button>
          </div>
        </div>
      </div>
    </>
  ) : null;

  return (
    <div ref={triggerRef} className={cn("relative inline-flex", className)}>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="加入文件夹"
          title="加入文件夹"
          aria-expanded={open}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
          }}
        >
          <FolderOpen
            className={cn(
              "h-4 w-4 transition-colors",
              open ? "text-primary" : "text-muted-foreground"
            )}
          />
        </Button>
      ) : (
        <Button
          variant="outline"
          className="gap-1.5 h-9"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <FolderPlus className="h-4 w-4" />
          加入文件夹
        </Button>
      )}
      {typeof document !== "undefined" && createPortal(panel, document.body)}
    </div>
  );
}
