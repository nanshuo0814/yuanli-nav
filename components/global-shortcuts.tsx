"use client";

import { useEffect } from "react";

/** 全局快捷键：/ 聚焦搜索，Esc 取消聚焦 */
export function GlobalShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable;

      // / 聚焦搜索框
      if (e.key === "/" && !isTyping && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const input = document.getElementById("site-search") as HTMLInputElement | null;
        input?.focus();
        input?.select();
      }

      // Esc 失焦
      if (e.key === "Escape" && document.activeElement?.id === "site-search") {
        (document.activeElement as HTMLElement).blur();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
}
