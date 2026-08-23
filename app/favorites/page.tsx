import { FavoritesPageClient } from "@/components/favorites-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "我的收藏",
  description: "查看你在源力导航中收藏的资源",
};

export default function FavoritesPage() {
  return <FavoritesPageClient />;
}
