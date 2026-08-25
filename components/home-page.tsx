"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Flame,
  Clock,
  Tags,
  History,
  Shuffle,
  Trash2,
  Sparkles,
  Layers,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { collections } from "@/data/collections";
import { getDailyPicks, formatDailyPicksDate } from "@/lib/daily-picks";
import { SearchBar } from "@/components/search-bar";
import { SiteStats } from "@/components/site-stats";
import { SortSelect } from "@/components/sort-select";
import { DimensionFilterBar } from "@/components/dimension-filters";
import { CategoryNav, CategoryCards, TagWall } from "@/components/category-nav";
import { ResourceGrid } from "@/components/resource-grid";
import { resources, getResourceById } from "@/data/resources";
import { useDebounce } from "@/hooks/use-debounce";
import { useHistory } from "@/hooks/use-history";
import { addSearchHistory, recordHotSearch } from "@/lib/search-history";
import { siteConfig } from "@/lib/site-config";
import {
  filterResources,
  getLatest,
  getPopularTags,
  getRandomResources,
  getRecommended,
  sortResources,
  type SortMode,
} from "@/lib/search";
import { DimensionFilters } from "@/lib/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState<string | undefined>(
    searchParams.get("category") || undefined
  );
  const [subCategory, setSubCategory] = useState<string | undefined>(
    searchParams.get("sub") || undefined
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.get("tags")?.split(",").filter(Boolean) || []
  );
  const [sortMode, setSortMode] = useState<SortMode>(
    (searchParams.get("sort") as SortMode) || "default"
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
  const [randomPick, setRandomPick] = useState<typeof resources>([]);
  const [randomReady, setRandomReady] = useState(false);

  const debouncedQuery = useDebounce(query, 300);
  const { historyIds, clearHistory, mounted: historyMounted } = useHistory();

  useEffect(() => {
    setRandomPick(getRandomResources(resources, 8));
    setRandomReady(true);
  }, []);

  const isFiltering = !!(
    debouncedQuery ||
    category ||
    subCategory ||
    selectedTags.length ||
    dimensions.isFree ||
    dimensions.isOpenSource ||
    dimensions.region ||
    dimensions.onlyAvailable
  );

  // URL 同步
  useEffect(() => {
    if (!isFiltering) return;
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (category) params.set("category", category);
    if (subCategory) params.set("sub", subCategory);
    if (selectedTags.length) params.set("tags", selectedTags.join(","));
    if (sortMode !== "default") params.set("sort", sortMode);
    if (page > 1) params.set("page", String(page));
    if (pageSize !== siteConfig.defaultPageSize)
      params.set("size", String(pageSize));
    if (dimensions.isFree) params.set("free", "1");
    if (dimensions.isOpenSource) params.set("oss", "1");
    if (dimensions.region) params.set("region", dimensions.region);
    if (dimensions.onlyAvailable) params.set("ok", "1");
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }, [
    debouncedQuery,
    category,
    subCategory,
    selectedTags,
    sortMode,
    page,
    pageSize,
    dimensions,
    isFiltering,
    router,
  ]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      addSearchHistory(debouncedQuery.trim());
      recordHotSearch(debouncedQuery.trim());
    }
  }, [debouncedQuery]);

  const filteredResources = useMemo(() => {
    const filtered = filterResources(resources, {
      query: debouncedQuery,
      category,
      subCategory,
      tags: selectedTags,
      dimensions,
    });
    return sortResources(filtered as typeof resources, sortMode);
  }, [
    debouncedQuery,
    category,
    subCategory,
    selectedTags,
    sortMode,
    dimensions,
  ]);

  const recommended = useMemo(() => getRecommended(resources), []);
  const latest = useMemo(() => getLatest(resources, 8), []);
  const popularTags = useMemo(() => getPopularTags(resources, 24), []);
  const dailyPicks = useMemo(() => getDailyPicks(resources, 8), []);
  const dailyLabel = useMemo(() => formatDailyPicksDate(), []);

  const recentResources = useMemo(() => {
    if (!historyMounted) return [];
    return historyIds
      .map((id) => getResourceById(id))
      .filter(Boolean)
      .slice(0, 8) as typeof resources;
  }, [historyIds, historyMounted]);

  const handleCategoryChange = useCallback((cat?: string, sub?: string) => {
    setCategory(cat);
    setSubCategory(sub);
    setPage(1);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  }, []);

  const clearFilters = () => {
    setQuery("");
    setCategory(undefined);
    setSubCategory(undefined);
    setSelectedTags([]);
    setSortMode("default");
    setPage(1);
    setDimensions({});
  };

  const refreshRandom = () => {
    setRandomPick(getRandomResources(resources, 8));
    document.getElementById("random-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="space-y-10">
      <section className="text-center space-y-5 py-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            源力导航
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            发现优质网络资源 · 编程 · AI · 设计 · 工具 · 生活
          </p>
        </div>
        <SiteStats />
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
          <SearchBar
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            resultCount={isFiltering ? filteredResources.length : undefined}
            globalFocus
            className="flex-1"
          />
          <Button
            variant="outline"
            className="h-11 shrink-0 gap-1.5"
            onClick={refreshRandom}
          >
            <Shuffle className="h-4 w-4" />
            随机发现
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <CategoryNav
          inline
          activeCategory={category}
          activeSubCategory={subCategory}
          onCategoryChange={handleCategoryChange}
        />
        <DimensionFilterBar
          value={dimensions}
          onChange={(d) => {
            setDimensions(d);
            setPage(1);
          }}
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          {isFiltering && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:underline"
            >
              清除筛选
            </button>
          )}
          {isFiltering && (
            <SortSelect value={sortMode} onChange={setSortMode} />
          )}
        </div>
      </section>

      {isFiltering ? (
        <section>
          <h2 className="text-lg font-semibold mb-4">
            搜索结果
            <span className="text-sm font-normal text-muted-foreground ml-2">
              共 {filteredResources.length} 条
            </span>
          </h2>
          <ResourceGrid
            resources={filteredResources}
            searchQuery={debouncedQuery}
            emptyType="search"
            paginated
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
            onTagClick={handleTagClick}
            onSuggestionClick={(q) => {
              setQuery(q);
              setPage(1);
            }}
          />
        </section>
      ) : (
        <>
          {recentResources.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="h-5 w-5 text-violet-500" />
                  <h2 className="text-lg font-semibold">最近浏览</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/history/"
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 text-xs")}
                  >
                    查看全部
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground"
                    onClick={clearHistory}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    清空
                  </Button>
                </div>
              </div>
              <ResourceGrid resources={recentResources} />
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <div>
                  <h2 className="text-lg font-semibold">今日源力</h2>
                  <p className="text-[11px] text-muted-foreground">{dailyLabel}</p>
                </div>
              </div>
            </div>
            <ResourceGrid resources={dailyPicks} />
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">编辑精选</h2>
              </div>
              <Link
                href="/collection/"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 text-xs")}
              >
                全部专题
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {collections.slice(0, 4).map((c) => (
                <Link
                  key={c.slug}
                  href={`/collection/${c.slug}/`}
                  className="rounded-xl border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <h3 className="font-medium text-sm">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {c.description}
                  </p>
                </Link>
              ))}
            </div>
            <Link
              href="/weekly/"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <CalendarDays className="h-4 w-4" />
              查看源力周刊 →
            </Link>
          </section>

          <section id="random-section">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shuffle className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-semibold">随机发现</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setRandomPick(getRandomResources(resources, 8))}
              >
                换一批
              </Button>
            </div>
            {randomReady ? (
              <ResourceGrid resources={randomPick} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-36 rounded-xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-500" />
              <h2 className="text-lg font-semibold">热门推荐</h2>
            </div>
            <ResourceGrid resources={recommended.slice(0, 8)} />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold">最新收录</h2>
            </div>
            <ResourceGrid resources={latest} />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">探索分类</h2>
            <CategoryCards />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Tags className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">热门标签</h2>
            </div>
            <TagWall
              tags={popularTags}
              selectedTags={selectedTags}
              onTagClick={handleTagClick}
            />
            {selectedTags.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">
                    标签筛选结果 ({filteredResources.length})
                  </h3>
                  <SortSelect value={sortMode} onChange={setSortMode} />
                </div>
                <ResourceGrid
                  resources={filteredResources}
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
            )}
          </section>
        </>
      )}
    </div>
  );
}

export function HomePageClient() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-muted-foreground">加载中...</div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
