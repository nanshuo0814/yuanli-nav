import { CollectionsIndexClient } from "@/components/collections-index";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "编辑精选",
  description: "按主题整理的优质资源合集",
};

export default function CollectionsPage() {
  return <CollectionsIndexClient />;
}
