"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { ResourceGrid } from "@/components/resource-grid";
import { Resource } from "@/lib/types";

interface WeeklyPageClientProps {
  items: Resource[];
  weekRange: string;
}

export function WeeklyPageClient({ items, weekRange }: WeeklyPageClientProps) {
  return (
    <div className="space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        返回首页
      </Link>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">源力周刊</h1>
        </div>
        <p className="text-muted-foreground">{weekRange}</p>
        <p className="text-sm text-muted-foreground">
          本周 / 近 7 天收录的资源精选，共 {items.length} 条
        </p>
      </section>

      {items.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
          本周暂无新收录，去首页探索更多资源吧
        </div>
      ) : (
        <ResourceGrid resources={items} paginated page={1} pageSize={40} />
      )}
    </div>
  );
}
