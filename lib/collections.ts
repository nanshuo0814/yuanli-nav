import { Collection, Resource } from "./types";
import { getResourceById } from "@/data/resources";

/** 解析合集内的资源列表 */
export function resolveCollectionResources(
  collection: Collection,
  allResources: Resource[]
): Resource[] {
  if (collection.resourceIds?.length) {
    return collection.resourceIds
      .map((id) => getResourceById(id))
      .filter(Boolean) as Resource[];
  }

  const f = collection.filter;
  if (!f) return [];

  let result = [...allResources];

  if (f.category) result = result.filter((r) => r.category === f.category);
  if (f.isRecommended) result = result.filter((r) => r.isRecommended);
  if (f.isFree) result = result.filter((r) => r.isFree);
  if (f.isOpenSource) result = result.filter((r) => r.isOpenSource);
  if (f.region === "cn") {
    result = result.filter((r) => r.region === "cn" || r.region === "both");
  } else if (f.region === "global") {
    result = result.filter(
      (r) => r.region === "global" || r.region === "both"
    );
  }
  if (f.tags?.length) {
    result = result.filter((r) =>
      f.tags!.some((tag) => r.tags.includes(tag))
    );
  }

  result = result.filter((r) => !r.isBroken);

  if (f.limit) result = result.slice(0, f.limit);
  return result;
}
