"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import { collections } from "@/data/collections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** 专题合集入口列表 */
export function CollectionsIndexClient() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">编辑精选</h1>
        </div>
        <p className="text-muted-foreground">
          按主题整理的优质资源合集，比单分类更适合入门与分享
        </p>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((c) => (
          <Link key={c.slug} href={`/collection/${c.slug}/`}>
            <Card className="h-full hover:border-primary/40 hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {c.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
