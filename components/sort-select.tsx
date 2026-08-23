"use client";

import { ArrowUpDown } from "lucide-react";
import { SortMode } from "@/lib/search";
import { cn } from "@/lib/utils";

const OPTIONS: { value: SortMode; label: string }[] = [
  { value: "default", label: "默认" },
  { value: "recommended", label: "推荐优先" },
  { value: "newest", label: "最新收录" },
  { value: "name", label: "名称 A-Z" },
];

interface SortSelectProps {
  value: SortMode;
  onChange: (value: SortMode) => void;
  className?: string;
}

/** 资源排序选择器 */
export function SortSelect({ value, onChange, className }: SortSelectProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortMode)}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="排序方式"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
