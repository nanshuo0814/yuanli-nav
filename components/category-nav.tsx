"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Code2, Sparkles, Music, Film, Package, Heart, Palette,
  GraduationCap, Newspaper, Wrench, ChevronRight,
} from "lucide-react";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Sparkles, Music, Film, Package, Heart, Palette,
  GraduationCap, Newspaper, Wrench,
};

interface CategoryNavProps {
  activeCategory?: string;
  activeSubCategory?: string;
  onCategoryChange?: (category?: string, subCategory?: string) => void;
  /** 首页模式：点击触发回调而非跳转 */
  inline?: boolean;
}

/** 分类导航：一级 + 二级分类 */
export function CategoryNav({
  activeCategory,
  activeSubCategory,
  onCategoryChange,
  inline = false,
}: CategoryNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = activeCategory ?? searchParams.get("category") ?? undefined;
  const currentSub = activeSubCategory ?? searchParams.get("sub") ?? undefined;

  const activeCat = categories.find((c) => c.slug === currentCategory);

  const handleClick = (catSlug?: string, subSlug?: string) => {
    if (inline && onCategoryChange) {
      onCategoryChange(catSlug, subSlug);
    }
  };

  return (
    <div className="space-y-3">
      {/* 一级分类 */}
      <div className="flex flex-wrap gap-2">
        {!inline && (
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm border transition-colors hover:bg-accent",
              !currentCategory && "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
            )}
          >
            全部
          </Link>
        )}
        {inline && (
          <button
            onClick={() => handleClick(undefined, undefined)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm border transition-colors hover:bg-accent",
              !currentCategory && "bg-primary text-primary-foreground border-primary"
            )}
          >
            全部
          </button>
        )}
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Code2;
          const isActive = currentCategory === cat.slug;

          if (inline) {
            return (
              <button
                key={cat.slug}
                onClick={() => handleClick(cat.slug, undefined)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm border transition-colors hover:bg-accent",
                  isActive && "bg-primary text-primary-foreground border-primary"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.name}
              </button>
            );
          }

          return (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}/`}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm border transition-colors hover:bg-accent",
                (isActive || pathname.includes(cat.slug)) &&
                  "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat.name}
            </Link>
          );
        })}
      </div>

      {/* 二级分类 */}
      {activeCat && (
        <div className="flex flex-wrap items-center gap-2 pl-1">
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          {inline ? (
            <button
              onClick={() => handleClick(activeCat.slug, undefined)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs border transition-colors hover:bg-accent",
                !currentSub && "bg-secondary font-medium"
              )}
            >
              全部{activeCat.name}
            </button>
          ) : (
            <Link
              href={`/category/${activeCat.slug}/`}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs border transition-colors hover:bg-accent",
                !currentSub && "bg-secondary font-medium"
              )}
            >
              全部{activeCat.name}
            </Link>
          )}
          {activeCat.subCategories.map((sub) => {
            const isSubActive = currentSub === sub.slug;
            if (inline) {
              return (
                <button
                  key={sub.slug}
                  onClick={() => handleClick(activeCat.slug, sub.slug)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs border transition-colors hover:bg-accent",
                    isSubActive && "bg-secondary font-medium"
                  )}
                >
                  {sub.name}
                </button>
              );
            }
            return (
              <Link
                key={sub.slug}
                href={`/category/${activeCat.slug}/?sub=${sub.slug}`}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs border transition-colors hover:bg-accent",
                  isSubActive && "bg-secondary font-medium"
                )}
              >
                {sub.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** 首页分类入口卡片 */
export function CategoryCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {categories.map((cat) => {
        const Icon = iconMap[cat.icon] ?? Code2;
        return (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}/`}
            className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium">{cat.name}</span>
            <span className="text-[10px] text-muted-foreground text-center line-clamp-1">
              {cat.description}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/** 标签墙 */
export function TagWall({
  tags,
  selectedTags,
  onTagClick,
}: {
  tags: { tag: string; count: number }[];
  selectedTags?: string[];
  onTagClick?: (tag: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ tag, count }) => {
        const selected = selectedTags?.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onTagClick?.(tag)}
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors hover:bg-accent",
              selected && "bg-primary text-primary-foreground border-primary"
            )}
          >
            {tag}
            <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 font-normal">
              {count}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
