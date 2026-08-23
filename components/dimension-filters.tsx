"use client";

import { DimensionFilters } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DimensionFilterBarProps {
  value: DimensionFilters;
  onChange: (next: DimensionFilters) => void;
}

/** 多维筛选：免费 / 开源 / 国内 / 仅可用 */
export function DimensionFilterBar({
  value,
  onChange,
}: DimensionFilterBarProps) {
  const toggle = (key: keyof DimensionFilters, val?: boolean | string) => {
    if (key === "region") {
      onChange({
        ...value,
        region: value.region === val ? undefined : (val as DimensionFilters["region"]),
      });
      return;
    }
    onChange({ ...value, [key]: value[key] ? undefined : true });
  };

  const chips: {
    key: string;
    label: string;
    active: boolean;
    onClick: () => void;
  }[] = [
    {
      key: "free",
      label: "免费",
      active: !!value.isFree,
      onClick: () => toggle("isFree"),
    },
    {
      key: "oss",
      label: "开源",
      active: !!value.isOpenSource,
      onClick: () => toggle("isOpenSource"),
    },
    {
      key: "cn",
      label: "国内",
      active: value.region === "cn",
      onClick: () => toggle("region", "cn"),
    },
    {
      key: "global",
      label: "海外",
      active: value.region === "global",
      onClick: () => toggle("region", "global"),
    },
    {
      key: "ok",
      label: "仅可用",
      active: !!value.onlyAvailable,
      onClick: () => toggle("onlyAvailable"),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onClick}
          className={cn(
            "rounded-full border px-3 py-1 text-xs transition-colors",
            chip.active
              ? "bg-primary text-primary-foreground border-primary"
              : "hover:bg-accent"
          )}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
