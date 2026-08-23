"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getFavorites,
  toggleFavorite as toggleFavoriteStorage,
  getFolders,
  createFolder,
  renameFolder,
  deleteFolder,
  addToFolder,
  removeFromFolder,
  clearFavorites,
} from "@/lib/favorites";
import type { FavoriteFolder } from "@/lib/types";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [folders, setFolders] = useState<FavoriteFolder[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setFavorites(getFavorites());
    setFolders(getFolders());
  }, []);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, [refresh]);

  const toggleFavorite = useCallback(
    (id: string) => {
      toggleFavoriteStorage(id);
      refresh();
    },
    [refresh]
  );

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const clearAll = useCallback(() => {
    clearFavorites();
    refresh();
  }, [refresh]);

  const create = useCallback(
    (name: string) => {
      createFolder(name);
      refresh();
    },
    [refresh]
  );

  const rename = useCallback(
    (id: string, name: string) => {
      renameFolder(id, name);
      refresh();
    },
    [refresh]
  );

  const removeFolder = useCallback(
    (id: string) => {
      deleteFolder(id);
      refresh();
    },
    [refresh]
  );

  const moveToFolder = useCallback(
    (folderId: string, resourceId: string) => {
      addToFolder(folderId, resourceId);
      refresh();
    },
    [refresh]
  );

  const takeFromFolder = useCallback(
    (folderId: string, resourceId: string) => {
      removeFromFolder(folderId, resourceId);
      refresh();
    },
    [refresh]
  );

  return {
    favorites,
    folders,
    toggleFavorite,
    isFavorite,
    mounted,
    clearAll,
    createFolder: create,
    renameFolder: rename,
    deleteFolder: removeFolder,
    addToFolder: moveToFolder,
    removeFromFolder: takeFromFolder,
    refresh,
  };
}
