"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryNav } from "@/components/category-nav";
import { ResourceGrid } from "@/components/resource-grid";
import { SearchBar } from "@/components/search-bar";
import { SortSelect } from "@/components/sort-select";
import { DimensionFilterBar } from "@/components/dimension-filters";
import { getCategoryBySlug } from "@/data/categories";
import { getResourcesByCategory } from "@/data/resources";
import { useDebounce } from "@/hooks/use-debounce";
import { siteConfig } from "@/lib/site-config";
import {
  filterResources,
  sortResources,
  type SortMode,
} from "@/lib/search";
import { DimensionFilters } from "@/lib/types";

interface CategoryPageClientProps {
  slug: string;
}

function CategoryContent({ slug }: CategoryPageClientProps) {
  const category = getCategoryBySlug(slug);
  const searchParams = useSearchParams();
  const router = useRouter();
  const subCategory = searchParams.get("sub") ?? undefined;

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [sortMode, setSortMode] = useState<SortMode>(
    (searchParams.get("sort") as SortMode) || "recommended"
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("size")) || siteConfig.defaultPageSize
  );
  const [dimensions, setDimensions] = useState<DimensionFilters>({
    isFree: searchParams.get("free") === "1" || undefined,
    isOpenSource: searchParams.get("oss") === "1" || undefined,
    region:
      (searchParams.get("region") as DimensionFilters["region"]) || undefined,
    onlyAvailable: searchParams.get("ok") === "1" || undefined,
  });

  const debouncedQuery = useDebounce(query, 300);

  const baseResources = useMemo(
    () => getResourcesByCategory(slug),
    [slug]
  );

  const filtered = useMemo(() => {
    const result = filterResources(baseResources, {
      query: debouncedQuery,
      subCategory,
      dimensions,
    });
    return sortResources(result as typeof baseResources, sortMode);
  }, [baseResources, debouncedQuery, subCategory, sortMode, dimensions]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (subCategory) params.set("sub", subCategory);
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (sortMode !== "recommended") params.set("sort", sortMode);
    if (page > 1) params.set("page", String(page));
    if (pageSize !== siteConfig.defaultPageSize)
      params.set("size", String(pageSize));
    if (dimensions.isFree) params.set("free", "1");
    if (dimensions.isOpenSource) params.set("oss", "1");
    if (dimensions.region) params.set("region", dimensions.region);
    if (dimensions.onlyAvailable) params.set("ok", "1");
    const qs = params.toString();
    router.replace(
      qs ? `/category/${slug}/?${qs}` : `/category/${slug}/`,
      { scroll: false }
    );
  }, [
    slug,
    subCategory,
    debouncedQuery,
    sortMode,
    page,
    pageSize,
    dimensions,
    router,
  ]);

  if (!category) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{category.name}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {category.description}
        </p>
      </div>

      <SearchBar
        value={query}
        onChange={(v) => {
          setQuery(v);
          setPage(1);
        }}
        resultCount={debouncedQuery ? filtered.length : undefined}
        globalFocus
      />

      <CategoryNav activeCategory={slug} activeSubCategory={subCategory} />

      <DimensionFilterBar
        value={dimensions}
        onChange={(d) => {
          setDimensions(d);
          setPage(1);
        }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          共 {filtered.length} 条资源
        </p>
        <SortSelect value={sortMode} onChange={setSortMode} />
      </div>

      <ResourceGrid
        resources={filtered}
        searchQuery={debouncedQuery}
        emptyType={debouncedQuery ? "search" : "empty"}
        paginated
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </div>
  );
}

export function CategoryPageClient({ slug }: CategoryPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-muted-foreground">加载中...</div>
      }
    >
      <CategoryContent slug={slug} />
    </Suspense>
  );
}
