"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";
import { ResourceGrid } from "@/components/resource-grid";
import { Button, buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { Resource } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BrokenPageClientProps {
  items: Resource[];
  checkedAt?: string;
}

export function BrokenPageClient({ items, checkedAt }: BrokenPageClientProps) {
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
          <AlertTriangle className="h-6 w-6 text-destructive" />
          <h1 className="text-2xl font-bold">失效链接</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          以下资源由定时链接检测标记为可能失效。可能是临时不可用，也欢迎帮忙反馈修正。
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            当前失效 {items.length} 条
            {checkedAt ? ` · 最近检测 ${new Date(checkedAt).toLocaleString("zh-CN")}` : ""}
          </span>
          <a
            href={`${siteConfig.githubRepoUrl}/actions/workflows/check-links.yml`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 gap-1")}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            查看检测任务
          </a>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
          暂无失效链接，太棒了！
        </div>
      ) : (
        <ResourceGrid resources={items} />
      )}
    </div>
  );
}
