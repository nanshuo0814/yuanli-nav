import { HistoryPageClient } from "@/components/history-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "浏览历史",
  description: "查看你在源力导航中的浏览记录",
};

export default function HistoryPage() {
  return <HistoryPageClient />;
}
