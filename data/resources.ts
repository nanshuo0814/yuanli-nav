import { Resource } from "@/lib/types";
import { resourcesFlat } from "./resources/flat";
import { enrichResources } from "@/lib/enrich";
import { brokenLinkIds } from "./broken-links";

/**
 * 全站资源数据（增强字段 + 失效标记）
 */
const enriched = enrichResources(resourcesFlat).map((r) =>
  brokenLinkIds.includes(r.id) ? { ...r, isBroken: true } : r
);

export const resources: Resource[] = enriched;

export const resourceCount = resources.length;

export function getResourceById(id: string): Resource | undefined {
  return resources.find((r) => r.id === id);
}

export function getResourcesByCategory(categorySlug: string): Resource[] {
  return resources.filter((r) => r.category === categorySlug);
}

export function getResourcesBySubCategory(
  categorySlug: string,
  subCategorySlug: string
): Resource[] {
  return resources.filter(
    (r) => r.category === categorySlug && r.subCategory === subCategorySlug
  );
}

/** 静态导出：所有资源 ID */
export function getAllResourceIds(): string[] {
  return resources.map((r) => r.id);
}
