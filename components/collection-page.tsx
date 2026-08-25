"use client";

import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { ResourceGrid } from "@/components/resource-grid";
import { Collection } from "@/lib/types";
import { Resource } from "@/lib/types";

interface CollectionPageClientProps {
  collection: Collection;
  items: Resource[];
}

export function CollectionPageClient({
  collection,
  items,
}: CollectionPageClientProps) {
  return (
    <div className="space-y-8">
      <Link
        href="/collection/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        全部专题
      </Link>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{collection.title}</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">{collection.description}</p>
        <p className="text-sm text-muted-foreground">共 {items.length} 条资源</p>
      </section>

      <ResourceGrid resources={items} />
    </div>
  );
}
