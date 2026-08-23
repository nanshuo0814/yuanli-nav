/**
 * 合并所有批量资源并更新 resources.ts
 * 运行: node scripts/merge-all-resources.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// 运行所有生成脚本
const parts = [
  "generate-bulk-part1.mjs",
  "generate-bulk-part2.mjs",
  "generate-bulk-part3.mjs",
  "generate-bulk-part4.mjs",
  "generate-bulk-part5.mjs",
  "generate-bulk-part6.mjs",
];

console.log("=== 生成批量资源 ===\n");
for (const p of parts) {
  console.log(`>> ${p}`);
  await import(`./${p}`);
  console.log("");
}

// 更新 resources.ts
const imports = [
  "./resources/programming",
  "./resources/ai",
  "./resources/music",
  "./resources/video",
  "./resources/software",
  "./resources/life",
  "./resources/design",
  "./resources/education",
  "./resources/news",
  "./resources/tools",
  // 新增批量资源
  "./resources/nav-sites",
  "./resources/file-hosting",
  "./resources/streaming-video",
  "./resources/anime-manga",
  "./resources/live-tv",
  "./resources/music-extra",
  "./resources/ebook-extra",
  "./resources/game-extra",
  "./resources/programming-extra",
  "./resources/ai-extra",
  "./resources/design-extra",
  "./resources/tools-extra",
  "./resources/life-extra",
  "./resources/education-extra",
  "./resources/news-extra",
  "./resources/software-extra",
  "./resources/misc-extra",
];

const exportNames = [
  "programmingResources",
  "aiResources",
  "musicResources",
  "videoResources",
  "softwareResources",
  "lifeResources",
  "designResources",
  "educationResources",
  "newsResources",
  "toolsResources",
  "navSitesResources",
  "fileHostingResources",
  "streamingVideoResources",
  "animeMangaResources",
  "liveTVResources",
  "musicExtraResources",
  "ebookExtraResources",
  "gameExtraResources",
  "programmingExtraResources",
  "aiExtraResources",
  "designExtraResources",
  "toolsExtraResources",
  "lifeExtraResources",
  "educationExtraResources",
  "newsExtraResources",
  "softwareExtraResources",
  "miscExtraResources",
];

// 从生成的 TS 文件中解析 JSON 数组
function loadResourcesFromTs(relativePath) {
  const filePath = path.join(root, "data", relativePath + ".ts");
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/=\s*(\[[\s\S]*\])\s*;/);
  if (!match) throw new Error(`无法解析: ${filePath}`);
  try {
    return JSON.parse(match[1]);
  } catch {
    // 兼容 TS 对象字面量（非严格 JSON）
    return new Function(`return ${match[1]}`)();
  }
}

const allModules = imports.map((p) => loadResourcesFromTs(p));

const all = allModules.flat();

// 按 URL 去重，保留先出现的条目
const seenUrls = new Set();
const deduped = [];
for (const item of all) {
  const normalized = item.url.replace(/\/$/, "").toLowerCase();
  if (!seenUrls.has(normalized)) {
    seenUrls.add(normalized);
    deduped.push(item);
  }
}

const uniqueIds = new Set(deduped.map((r) => r.id));

console.log(`\n=== 统计 ===`);
console.log(`合并前: ${all.length} 条`);
console.log(`去重后: ${deduped.length} 条（按 URL）`);
console.log(`唯一 ID: ${uniqueIds.size}`);

if (deduped.length !== uniqueIds.size) {
  const seen = new Set();
  const dupes = deduped.filter((r) => {
    if (seen.has(r.id)) return true;
    seen.add(r.id);
    return false;
  });
  console.warn(`警告: 重复 ID ${dupes.map((d) => d.id).join(", ")}`);
}

// 写入去重后的 flat 资源文件供 resources.ts 引用
const flatContent = `import { Resource } from "@/lib/types";

/** 全站资源（${deduped.length} 条，URL 去重） */
export const resourcesFlat: Resource[] = ${JSON.stringify(deduped, null, 2)};
`;
fs.writeFileSync(path.join(root, "data/resources/flat.ts"), flatContent, "utf8");

// 更新 resources.ts 使用 flat 合并文件
const flatResourcesTs = `import { Resource } from "@/lib/types";
import { resourcesFlat } from "./resources/flat";

/**
 * 全站资源数据（${deduped.length} 条真实资源，URL 已去重）
 * 批量添加：运行 node scripts/merge-all-resources.mjs
 * 单条添加：在 data/resources/ 对应分类文件中追加后重新运行合并脚本
 */
export const resources: Resource[] = resourcesFlat;

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
`;
fs.writeFileSync(path.join(root, "data/resources.ts"), flatResourcesTs, "utf8");
console.log(`已写入 data/resources/flat.ts 并更新 resources.ts`);
