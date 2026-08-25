const SITE = "https://nanshuo0814.github.io/yuanli-nav";
const ISSUES =
  "https://github.com/nanshuo0814/yuanli-nav/issues/new?template=resource-submit.yml";

document.getElementById("open").href = SITE + "/";

document.getElementById("search").addEventListener("click", () => {
  const q = document.getElementById("q").value.trim();
  const url = q ? `${SITE}/?q=${encodeURIComponent(q)}` : SITE + "/";
  chrome.tabs.create({ url });
});

document.getElementById("q").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("search").click();
});

document.getElementById("submit").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;
  const title = encodeURIComponent(tab.title || "新资源建议");
  const body = encodeURIComponent(
    `## 资源信息\n\n- 标题：${tab.title || ""}\n- 链接：${tab.url}\n- 分类：\n- 简介：\n`
  );
  chrome.tabs.create({ url: `${ISSUES}&title=${title}&body=${body}` });
});
