import { BrokenPageClient } from "@/components/broken-page";
import { getBrokenResources } from "@/data/resources";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "失效链接",
  description: "源力导航 · 自动检测到的可能失效资源列表",
};

function getCheckedAt(): string | undefined {
  try {
    const file = path.join(process.cwd(), "data/broken-links.ts");
    const content = fs.readFileSync(file, "utf8");
    const match = content.match(/于 ([0-9T:\-.]+Z?) 生成/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

export default function BrokenPage() {
  const items = getBrokenResources();
  const checkedAt = getCheckedAt();

  return <BrokenPageClient items={items} checkedAt={checkedAt} />;
}
