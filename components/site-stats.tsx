import { categories } from "@/data/categories";
import { resourceCount } from "@/data/resources";

/** 首页数据统计条 */
export function SiteStats() {
  const recommendedApprox = Math.round(resourceCount * 0.15);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
      <StatItem label="收录资源" value={`${resourceCount}+`} />
      <span className="text-border hidden sm:inline">·</span>
      <StatItem label="分类" value={`${categories.length}`} />
      <span className="text-border hidden sm:inline">·</span>
      <StatItem label="精选推荐" value={`${recommendedApprox}+`} />
      <span className="text-border hidden sm:inline">·</span>
      <span className="hidden sm:inline-flex items-center gap-1">
        按 <kbd className="kbd">/</kbd> 快速搜索
      </span>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-muted/40 px-3 py-1">
      <span className="font-semibold text-foreground tabular-nums">{value}</span>
      {label}
    </span>
  );
}
