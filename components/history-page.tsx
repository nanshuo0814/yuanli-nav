"use client";

import Link from "next/link";
import Image from "next/image";
import { History, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { useHistory } from "@/hooks/use-history";
import { getResourceById } from "@/data/resources";
import { groupHistoryByDate } from "@/lib/history";
import { getCategoryName } from "@/data/categories";
import { formatDate, getFaviconUrl } from "@/lib/utils";

/** 浏览历史独立页 */
export function HistoryPageClient() {
  const { entries, removeFromHistory, clearHistory, mounted } = useHistory();

  if (!mounted) {
    return (
      <div className="py-20 text-center text-muted-foreground">加载中...</div>
    );
  }

  const groups = groupHistoryByDate(entries);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <History className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">浏览历史</h1>
            <p className="text-sm text-muted-foreground">
              共 {entries.length} 条 · 仅保存在本机
            </p>
          </div>
        </div>
        {entries.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm("确定清空全部浏览记录？")) clearHistory();
            }}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            清空全部
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <EmptyState type="history" />
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.label}>
              <h2 className="text-sm font-medium text-muted-foreground mb-3">
                {group.label}
              </h2>
              <ul className="space-y-2">
                {group.items.map((entry) => {
                  const resource = getResourceById(entry.id);
                  if (!resource) return null;
                  return (
                    <li
                      key={`${entry.id}-${entry.visitedAt}`}
                      className="flex items-center gap-3 rounded-xl border bg-card p-3 hover:border-primary/30 transition-colors group"
                    >
                      <Link
                        href={`/resource/${resource.id}/`}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <div className="relative h-9 w-9 shrink-0 rounded-lg border bg-muted overflow-hidden">
                          <Image
                            src={getFaviconUrl(resource.url)}
                            alt=""
                            width={36}
                            height={36}
                            className="object-contain p-1"
                            unoptimized
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {resource.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {getCategoryName(resource.category)} ·{" "}
                            {formatDate(entry.visitedAt)}
                          </p>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100"
                        onClick={() => removeFromHistory(entry.id)}
                        aria-label="删除本条"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
