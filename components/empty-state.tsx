"use client";

import { SearchX, Inbox, History, Lightbulb } from "lucide-react";
import { getPopularTags } from "@/lib/search";
import { resources } from "@/data/resources";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSubmitResourceUrl } from "@/lib/site-config";

interface EmptyStateProps {
  type?: "search" | "empty" | "favorites" | "history";
  query?: string;
  onTagClick?: (tag: string) => void;
  onSuggestionClick?: (q: string) => void;
}

const SEARCH_TIPS = [
  "react",
  "ai",
  "免费",
  "开源",
  "设计",
  "音乐",
  "工具",
  "导航",
];

/** 空状态 / 无搜索结果（含联想与热门标签） */
export function EmptyState({
  type = "empty",
  query,
  onTagClick,
  onSuggestionClick,
}: EmptyStateProps) {
  const popularTags = getPopularTags(resources, 12);

  if (type === "search") {
    const related = SEARCH_TIPS.filter(
      (t) => !query || !query.toLowerCase().includes(t)
    ).slice(0, 6);

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">未找到相关资源</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {query
            ? `没有找到与「${query}」匹配的结果。可尝试更短关键词、拼音首字母，或换个说法`
            : "请输入搜索关键词"}
        </p>

        <div className="w-full max-w-lg space-y-5 text-left">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-medium mb-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              试试这些词
            </div>
            <div className="flex flex-wrap gap-2">
              {related.map((tip) => (
                <Button
                  key={tip}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => onSuggestionClick?.(tip)}
                >
                  {tip}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">热门标签</p>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTagClick?.(tag)}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs hover:bg-accent transition-colors"
                >
                  {tag}
                  <Badge variant="secondary" className="text-[10px] px-1 h-4">
                    {count}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            没找到想要的？
            <a
              href={getSubmitResourceUrl({ title: query })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              提交收录建议
            </a>
          </p>
        </div>
      </div>
    );
  }

  const config = {
    empty: {
      icon: Inbox,
      title: "暂无资源",
      desc: "该分类下还没有收录资源",
    },
    favorites: {
      icon: Inbox,
      title: "还没有收藏",
      desc: "浏览资源时点击星标即可添加收藏",
    },
    history: {
      icon: History,
      title: "暂无浏览记录",
      desc: "访问资源后会自动记录在这里",
    },
  };

  const { icon: Icon, title, desc } = config[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{desc}</p>
    </div>
  );
}
