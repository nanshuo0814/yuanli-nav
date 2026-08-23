"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Clock, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resources } from "@/data/resources";
import { getSearchSuggestions } from "@/lib/search";
import {
  addSearchHistory,
  clearSearchHistory,
  getSearchHistory,
  removeSearchHistory,
} from "@/lib/search-history";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  globalFocus?: boolean;
  className?: string;
  showSuggestions?: boolean;
}

/** 搜索栏：建议下拉 + 搜索历史 */
export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar(
    {
      value,
      onChange,
      placeholder = "搜索标题、简介、标签、拼音首字母...",
      resultCount,
      globalFocus = false,
      className,
      showSuggestions = true,
    },
    ref
  ) {
    const [open, setOpen] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const wrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setHistory(getSearchHistory());
    }, []);

    useEffect(() => {
      const onDoc = (e: MouseEvent) => {
        if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const suggestions = useMemo(
      () => (value.trim() ? getSearchSuggestions(resources, value, 6) : []),
      [value]
    );

    const commitSearch = (q: string) => {
      onChange(q);
      addSearchHistory(q);
      setHistory(getSearchHistory());
      setOpen(false);
    };

    return (
      <div ref={wrapRef} className={cn("relative w-full", className)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          ref={ref}
          id={globalFocus ? "site-search" : undefined}
          type="search"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              commitSearch(value.trim());
            }
          }}
          placeholder={placeholder}
          className="pl-9 pr-24 h-11 text-base"
          aria-label="搜索资源"
          autoComplete="off"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {!value && globalFocus && (
            <kbd className="hidden sm:inline-flex kbd mr-1">/</kbd>
          )}
          {resultCount !== undefined && value.trim() && (
            <span className="text-xs text-muted-foreground mr-1">
              {resultCount} 条
            </span>
          )}
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              aria-label="清除搜索"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {showSuggestions && open && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border bg-popover shadow-lg overflow-hidden">
            {value.trim() && suggestions.length > 0 && (
              <div className="py-1">
                <p className="px-3 py-1.5 text-[11px] text-muted-foreground">
                  搜索建议
                </p>
                {suggestions.map((r) => (
                  <Link
                    key={r.id}
                    href={`/resource/${r.id}/`}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                    onClick={() => {
                      addSearchHistory(r.title);
                      setOpen(false);
                    }}
                  >
                    <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{r.title}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
                      {r.category}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {!value.trim() && history.length > 0 && (
              <div className="py-1">
                <div className="flex items-center justify-between px-3 py-1.5">
                  <p className="text-[11px] text-muted-foreground">搜索历史</p>
                  <button
                    type="button"
                    className="text-[11px] text-primary hover:underline"
                    onClick={() => {
                      clearSearchHistory();
                      setHistory([]);
                    }}
                  >
                    清空
                  </button>
                </div>
                {history.map((h) => (
                  <div
                    key={h}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent group"
                  >
                    <button
                      type="button"
                      className="flex items-center gap-2 flex-1 min-w-0 text-left"
                      onClick={() => commitSearch(h)}
                    >
                      <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="truncate">{h}</span>
                    </button>
                    <button
                      type="button"
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground"
                      onClick={() => {
                        removeSearchHistory(h);
                        setHistory(getSearchHistory());
                      }}
                      aria-label="删除"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {value.trim() && suggestions.length === 0 && history.length === 0 && (
              <p className="px-3 py-3 text-xs text-muted-foreground">
                按 Enter 搜索「{value.trim()}」
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
