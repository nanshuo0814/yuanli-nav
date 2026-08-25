import { WeeklyPageClient } from "@/components/weekly-page";
import { resources } from "@/data/resources";
import { formatWeekRange, getRecentWeekResources } from "@/lib/weekly";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "源力周刊",
  description: "本周 / 近 7 天新收录的优质资源",
};

export default function WeeklyPage() {
  const items = getRecentWeekResources(resources);
  const weekRange = formatWeekRange();

  return <WeeklyPageClient items={items} weekRange={weekRange} />;
}
