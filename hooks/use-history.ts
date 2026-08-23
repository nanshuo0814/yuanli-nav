"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addToHistory,
  clearHistory,
  getHistory,
  removeFromHistory,
  type HistoryEntry,
} from "@/lib/history";

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setEntries(getHistory());
  }, []);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, [refresh]);

  const recordVisit = useCallback(
    (id: string) => {
      addToHistory(id);
      refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    (id: string) => {
      removeFromHistory(id);
      refresh();
    },
    [refresh]
  );

  const clear = useCallback(() => {
    clearHistory();
    refresh();
  }, [refresh]);

  return {
    historyIds: entries.map((e) => e.id),
    entries,
    recordVisit,
    removeFromHistory: remove,
    clearHistory: clear,
    mounted,
  };
}
