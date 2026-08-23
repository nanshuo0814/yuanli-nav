"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Flag,
  Star,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HighlightText } from "@/components/highlight-text";
import { useFavorites } from "@/hooks/use-favorites";
import { useHistory } from "@/hooks/use-history";
import { getCategoryName, getSubCategoryName } from "@/data/categories";
import { Resource } from "@/lib/types";
import { getBrokenLinkReportUrl } from "@/lib/site-config";
import { cn, formatDate, getFaviconUrl } from "@/lib/utils";
import Image from "next/image";

interface ResourceCardProps {
  resource: Resource;
  searchQuery?: string;
}

/** 资源卡片：点击进详情页，外链/收藏/报错独立操作 */
export function ResourceCard({ resource, searchQuery }: ResourceCardProps) {
  const { isFavorite, toggleFavorite, mounted } = useFavorites();
  const { recordVisit } = useHistory();
  const [copied, setCopied] = useState(false);
  const favorited = mounted && isFavorite(resource.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(resource.id);
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(resource.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const handleVisit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    recordVisit(resource.id);
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  const handleReport = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(getBrokenLinkReportUrl(resource), "_blank", "noopener,noreferrer");
  };

  return (
    <Link
      href={`/resource/${resource.id}/`}
      className="group block"
      onClick={() => recordVisit(resource.id)}
    >
      <article
        className={cn(
          "relative flex flex-col h-full rounded-xl border bg-card p-4 transition-all duration-200",
          "hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5",
          resource.isBroken && "opacity-60 grayscale"
        )}
      >
        {resource.isBroken && (
          <Badge
            variant="destructive"
            className="absolute -top-2 left-3 text-[10px] px-1.5 py-0 z-10"
          >
            可能失效
          </Badge>
        )}
        {resource.isRecommended && !resource.isBroken && (
          <Badge className="absolute -top-2 right-3 text-[10px] px-1.5 py-0">
            推荐
          </Badge>
        )}

        <div className="flex items-start gap-3 mb-3">
          <div className="relative h-10 w-10 shrink-0 rounded-lg border bg-muted overflow-hidden">
            <Image
              src={getFaviconUrl(resource.url)}
              alt=""
              width={40}
              height={40}
              className="object-contain p-1"
              loading="lazy"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              <HighlightText text={resource.title} query={searchQuery} />
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {getCategoryName(resource.category)} ·{" "}
              {getSubCategoryName(resource.category, resource.subCategory)}
            </p>
          </div>
          <div className="flex shrink-0 gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              onClick={handleCopy}
              aria-label="复制链接"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
                favorited && "opacity-100"
              )}
              onClick={handleFavorite}
              aria-label={favorited ? "取消收藏" : "收藏"}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  favorited
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                )}
              />
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 flex-1 mb-3">
          <HighlightText text={resource.description} query={searchQuery} />
        </p>

        {resource.isBroken && (
          <p className="text-[11px] text-destructive mb-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            链接可能已失效，点击卡片查看详情或反馈
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50 gap-2">
          <div className="flex flex-wrap gap-1 min-w-0">
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 font-normal"
              >
                <HighlightText text={tag} query={searchQuery} />
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100"
              onClick={handleReport}
              aria-label="反馈失效"
              title="反馈链接失效"
            >
              <Flag className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleVisit}
              aria-label="访问网站"
              title="新窗口打开"
            >
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <time className="sr-only" dateTime={resource.createdAt}>
          {formatDate(resource.createdAt)}
        </time>
      </article>
    </Link>
  );
}
