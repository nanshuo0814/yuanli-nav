/**
 * 批量检测资源链接可用性
 * 用法: node scripts/check-links.mjs [--limit=50] [--concurrency=5]
 *
 * 结果写入 data/broken-links.ts，前端会灰显并提示
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadFlatResources() {
  const filePath = path.join(root, "data/resources/flat.ts");
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/=\s*(\[[\s\S]*\])\s*;/);
  if (!match) throw new Error("无法解析 flat.ts");
  try {
    return JSON.parse(match[1]);
  } catch {
    return new Function(`return ${match[1]}`)();
  }
}

const args = process.argv.slice(2);
const limitArg = args.find((a) => a.startsWith("--limit="));
const concurrencyArg = args.find((a) => a.startsWith("--concurrency="));
const LIMIT = limitArg ? Number(limitArg.split("=")[1]) : 0;
const CONCURRENCY = concurrencyArg ? Number(concurrencyArg.split("=")[1]) : 8;
const TIMEOUT_MS = 12000;

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "YuanliNav-LinkChecker/1.0" },
    });
    // 部分站点不支持 HEAD
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "YuanliNav-LinkChecker/1.0" },
      });
    }
    clearTimeout(timer);
    return { ok: res.status >= 200 && res.status < 400, status: res.status };
  } catch (e) {
    clearTimeout(timer);
    return { ok: false, status: 0, error: String(e.message || e) };
  }
}

async function runPool(items, worker, concurrency) {
  const results = [];
  let index = 0;
  async function next() {
    while (index < items.length) {
      const i = index++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => next())
  );
  return results;
}

const all = loadFlatResources();
const list = LIMIT > 0 ? all.slice(0, LIMIT) : all;
console.log(`检测 ${list.length} 条链接（并发 ${CONCURRENCY}）...\n`);

const broken = [];
let checked = 0;

await runPool(
  list,
  async (item) => {
    const result = await checkUrl(item.url);
    checked++;
    const mark = result.ok ? "✓" : "✗";
    console.log(
      `[${checked}/${list.length}] ${mark} ${item.id} ${item.title} (${result.status})`
    );
    if (!result.ok) {
      broken.push({ id: item.id, url: item.url, status: result.status });
    }
    return result;
  },
  CONCURRENCY
);

const ids = broken.map((b) => b.id);
const out = `/**
 * 链接失效 ID 列表
 * 由 scripts/check-links.mjs 于 ${new Date().toISOString()} 生成
 * 共检测 ${list.length} 条，失效 ${ids.length} 条
 */
export const brokenLinkIds: string[] = ${JSON.stringify(ids, null, 2)};
`;

fs.writeFileSync(path.join(root, "data/broken-links.ts"), out, "utf8");

const reportPath = path.join(root, "data/broken-links-report.json");
fs.writeFileSync(
  reportPath,
  JSON.stringify({ checkedAt: new Date().toISOString(), total: list.length, broken }, null, 2),
  "utf8"
);

console.log(`\n完成：失效 ${ids.length} 条`);
console.log(`已写入 data/broken-links.ts 与 data/broken-links-report.json`);
