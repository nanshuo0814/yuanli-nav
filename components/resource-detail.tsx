"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Flag,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderPicker } from "@/components/folder-picker";
import { ResourceGrid } from "@/components/resource-grid";
import { useFavorites } from "@/hooks/use-favorites";
import { useHistory } from "@/hooks/use-history";
import { getCategoryName, getSubCategoryName } from "@/data/categories";
import { getSimilarResources } from "@/lib/enrich";
import { resources } from "@/data/resources";
import { Resource } from "@/lib/types";
import { getBrokenLinkReportUrl } from "@/lib/site-config";
import { tagToSlug } from "@/lib/tags";
import { cn, formatDate, getFaviconUrl } from "@/lib/utils";
import Image from "next/image";

interface ResourceDetailClientProps {
  resource: Resource;
}

/** 资源详情页内容 */
export function ResourceDetailClient({ resource }: ResourceDetailClientProps) {
  const { isFavorite, toggleFavorite, mounted } = useFavorites();
  const { recordVisit } = useHistory();
  const [copied, setCopied] = useState(false);
  const favorited = mounted && isFavorite(resource.id);

  const similar = useMemo(
    () => getSimilarResources(resource, resources, 8),
    [resource]
  );

  const copyLink = async () => {
    await navigator.clipboard.writeText(resource.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const openSite = () => {
    recordVisit(resource.id);
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <Link
        href={`/category/${resource.category}/`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        返回{getCategoryName(resource.category)}
      </Link>

      <section className="rounded-2xl border bg-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="relative h-16 w-16 shrink-0 rounded-xl border bg-muted overflow-hidden">
              <Image
                src={getFaviconUrl(resource.url)}
                alt=""
                width={64}
                height={64}
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {resource.title}
                </h1>
                {resource.isRecommended && <Badge>推荐</Badge>}
                {resource.isBroken && (
                  <Badge variant="destructive">可能失效</Badge>
                )}
                {resource.isFree && (
                  <Badge variant="secondary">免费</Badge>
                )}
                {resource.isOpenSource && (
                  <Badge variant="secondary">开源</Badge>
                )}
                {resource.region === "cn" && (
                  <Badge variant="outline">国内</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {getCategoryName(resource.category)} ·{" "}
                {getSubCategoryName(resource.category, resource.subCategory)} ·
                收录于 {formatDate(resource.createdAt)}
              </p>
              <p className="text-sm leading-relaxed">{resource.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {resource.tags.map((tag) => (
                  <Link key={tag} href={`/tag/${tagToSlug(tag)}/`}>
                    <Badge variant="secondary" className="font-normal hover:bg-accent">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary break-all hover:underline inline-block pt-1"
                onClick={() => recordVisit(resource.id)}
              >
                {resource.url}
              </a>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-3 rounded-xl border bg-muted/30 p-4">
            <QRCodeSVG
              value={resource.url}
              size={120}
              level="M"
              includeMargin
              className="rounded-md bg-white p-1"
            />
            <p className="text-[11px] text-muted-foreground">扫码访问</p>
          </div>
        </div>

        {resource.isBroken && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">该链接可能已失效</p>
              <p className="text-xs opacity-80 mt-0.5">
                自动检测标记，也可能是临时不可用。欢迎反馈帮助我们修正。
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={openSite} className="gap-1.5">
            <ExternalLink className="h-4 w-4" />
            访问网站
          </Button>
          <Button
            variant="outline"
            onClick={() => toggleFavorite(resource.id)}
            className="gap-1.5"
          >
            <Star
              className={cn(
                "h-4 w-4",
                favorited && "fill-yellow-400 text-yellow-400"
              )}
            />
            {favorited ? "已收藏" : "收藏"}
          </Button>
          <FolderPicker resourceId={resource.id} />
          <Button variant="outline" onClick={copyLink} className="gap-1.5">
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "已复制" : "复制链接"}
          </Button>
          <Button
            variant="ghost"
            className="gap-1.5 text-muted-foreground"
            onClick={() =>
              window.open(
                getBrokenLinkReportUrl(resource),
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <Flag className="h-4 w-4" />
            反馈失效
          </Button>
        </div>
      </section>

      {similar.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">同类推荐</h2>
          <ResourceGrid resources={similar} />
        </section>
      )}
    </div>
  );
}
