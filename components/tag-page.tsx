"use client";

import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import { ResourceGrid } from "@/components/resource-grid";
import { Badge } from "@/components/ui/badge";
import { tagToSlug } from "@/lib/tags";
import { Resource } from "@/lib/types";

interface TagPageClientProps {
  tag: string;
  items: Resource[];
  relatedTags: { tag: string; count: number }[];
}

export function TagPageClient({
  tag,
  items,
  relatedTags,
}: TagPageClientProps) {
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
          <Tag className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">#{tag}</h1>
        </div>
        <p className="text-muted-foreground">共 {items.length} 条相关资源</p>
      </section>

      {relatedTags.length > 0 && (
        <section>
          <h2 className="text-sm font-medium mb-2">相关标签</h2>
          <div className="flex flex-wrap gap-2">
            {relatedTags.map(({ tag: t, count }) => (
              <Link key={t} href={`/tag/${tagToSlug(t)}/`}>
                <Badge variant="outline" className="hover:bg-accent cursor-pointer">
                  {t}
                  <span className="ml-1 text-muted-foreground">{count}</span>
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ResourceGrid resources={items} />
    </div>
  );
}
