"use client";

import { Resource } from "@/lib/types";
import { ResourceCard } from "@/components/resource-card";
import { EmptyState } from "@/components/empty-state";
import { Pagination } from "@/components/pagination";
import { paginateResources } from "@/lib/search";
import { siteConfig } from "@/lib/site-config";

interface ResourceGridProps {
  resources: Resource[];
  searchQuery?: string;
  emptyType?: "search" | "empty" | "favorites" | "history";
  /** 启用分页 */
  paginated?: boolean;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onTagClick?: (tag: string) => void;
  onSuggestionClick?: (q: string) => void;
  /** 紧凑列表布局（详情页同类推荐） */
  compact?: boolean;
}

/** 资源卡片网格（可选分页） */
export function ResourceGrid({
  resources,
  searchQuery,
  emptyType = "empty",
  paginated = false,
  page = 1,
  pageSize = siteConfig.defaultPageSize,
  onPageChange,
  onPageSizeChange,
  onTagClick,
  onSuggestionClick,
  compact = false,
}: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <EmptyState
        type={emptyType}
        query={searchQuery}
        onTagClick={onTagClick}
        onSuggestionClick={onSuggestionClick}
      />
    );
  }

  const { items, total, totalPages, page: safePage } = paginated
    ? paginateResources(resources, page, pageSize)
    : { items: resources, total: resources.length, totalPages: 1, page: 1 };

  if (compact) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((resource) => (
          <div key={resource.id} data-resource-card data-resource-id={resource.id}>
            <ResourceCard resource={resource} compact />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((resource) => (
          <div
            key={resource.id}
            data-resource-card
            data-resource-id={resource.id}
            className="min-w-0 h-full"
          >
            <ResourceCard resource={resource} searchQuery={searchQuery} />
          </div>
        ))}
      </div>
      {paginated && onPageChange && totalPages > 1 && (
        <Pagination
          page={safePage}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={siteConfig.pageSizeOptions}
        />
      )}
    </div>
  );
}
