/**
 * 批量检测资源链接可用性
 * 用法: node scripts/check-links.mjs [--limit=50] [--concurrency=8]
 *
 * 结果写入 data/broken-links.ts，前端会灰显并提示
 * CI 下会额外写入 data/broken-links-report.json 与 GITHUB_STEP_SUMMARY
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
const TIMEOUT_MS = 15000;
const UA = "YuanliNav-LinkChecker/1.0 (+https://github.com/nanshuo0814/yuanli-nav)";

async function drainBody(res) {
  try {
    if (res.body) await res.body.cancel();
  } catch {
    /* ignore */
  }
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": UA, Accept: "*/*" },
    });
    await drainBody(res);

    // 部分站点不支持 HEAD，或返回 403/405
    if ([403, 405, 501].includes(res.status)) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": UA, Accept: "*/*" },
      });
      await drainBody(res);
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
const checkedAt = new Date().toISOString();
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
      broken.push({
        id: item.id,
        title: item.title,
        url: item.url,
        status: result.status,
        error: result.error || null,
      });
    }
    return result;
  },
  CONCURRENCY
);

const ids = [...new Set(broken.map((b) => b.id))].sort();
const out = `/**
 * 链接失效 ID 列表
 * 由 scripts/check-links.mjs 于 ${checkedAt} 生成
 * 共检测 ${list.length} 条，失效 ${ids.length} 条
 */
export const brokenLinkIds: string[] = ${JSON.stringify(ids, null, 2)};
`;

fs.writeFileSync(path.join(root, "data/broken-links.ts"), out, "utf8");

const report = {
  checkedAt,
  total: list.length,
  brokenCount: broken.length,
  broken,
};
const reportPath = path.join(root, "data/broken-links-report.json");
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

console.log(`\n完成：失效 ${ids.length} 条`);
console.log(`已写入 data/broken-links.ts 与 data/broken-links-report.json`);

// GitHub Actions Job Summary
const summaryPath = process.env.GITHUB_STEP_SUMMARY;
if (summaryPath) {
  const lines = [
    `## 链接检测报告`,
    ``,
    `- **检测时间**: ${checkedAt}`,
    `- **检测总数**: ${list.length}`,
    `- **失效数量**: ${ids.length}`,
    `- **可用率**: ${(((list.length - ids.length) / list.length) * 100).toFixed(1)}%`,
    ``,
  ];
  if (broken.length > 0) {
    lines.push(`### 失效链接`, ``);
    lines.push(`| ID | 标题 | 状态 | URL |`);
    lines.push(`| --- | --- | --- | --- |`);
    for (const b of broken.slice(0, 100)) {
      const title = (b.title || "").replace(/\|/g, "\\|");
      lines.push(
        `| \`${b.id}\` | ${title} | ${b.status || b.error || "error"} | ${b.url} |`
      );
    }
    if (broken.length > 100) {
      lines.push(``, `_仅展示前 100 条，完整列表见 Artifacts 中的 report。_`);
    }
  } else {
    lines.push(`全部链接检测通过。`);
  }
  fs.appendFileSync(summaryPath, lines.join("\n") + "\n", "utf8");
}
