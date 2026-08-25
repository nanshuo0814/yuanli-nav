"use client";

import { useEffect, useRef } from "react";

const FOCUS_CLASS = "keyboard-focus-card";

/** 全局快捷键：/ 搜索 · j/k 移动 · Enter 打开 · f 收藏 · Esc 取消 */
export function GlobalShortcuts() {
  const indexRef = useRef(-1);

  useEffect(() => {
    const clearFocus = () => {
      document.querySelectorAll(`.${FOCUS_CLASS}`).forEach((el) => {
        el.classList.remove(FOCUS_CLASS, "ring-2", "ring-primary", "ring-offset-2");
      });
    };

    const getCards = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-resource-card]")
      );

    const focusCard = (idx: number) => {
      const cards = getCards();
      if (cards.length === 0) return;
      const safe = ((idx % cards.length) + cards.length) % cards.length;
      indexRef.current = safe;
      clearFocus();
      const el = cards[safe];
      el.classList.add(FOCUS_CLASS, "ring-2", "ring-primary", "ring-offset-2");
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
    };

    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable;

      if (e.key === "/" && !isTyping && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const input = document.getElementById("site-search") as HTMLInputElement | null;
        input?.focus();
        input?.select();
        return;
      }

      if (e.key === "Escape") {
        if (document.activeElement?.id === "site-search") {
          (document.activeElement as HTMLElement).blur();
        }
        clearFocus();
        indexRef.current = -1;
        return;
      }

      if (isTyping) return;

      const cards = getCards();
      if (cards.length === 0) return;

      if (e.key === "j" || e.key === "k") {
        e.preventDefault();
        const next =
          indexRef.current < 0
            ? 0
            : e.key === "j"
              ? indexRef.current + 1
              : indexRef.current - 1;
        focusCard(next);
        return;
      }

      if (indexRef.current < 0) return;
      const active = cards[indexRef.current];
      if (!active) return;

      if (e.key === "Enter") {
        e.preventDefault();
        const link = active.querySelector("a[href]") as HTMLAnchorElement | null;
        link?.click();
        return;
      }

      if (e.key === "f") {
        e.preventDefault();
        const favBtn = active.querySelector(
          '[aria-label="收藏"], [aria-label="取消收藏"]'
        ) as HTMLButtonElement | null;
        favBtn?.click();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
}
