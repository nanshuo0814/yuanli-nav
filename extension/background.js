const ISSUES =
  "https://github.com/nanshuo0814/yuanli-nav/issues/new?template=resource-submit.yml";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "yuanli-submit",
    title: "收录到源力导航",
    contexts: ["page", "link"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const url = info.linkUrl || info.pageUrl || tab?.url || "";
  const title = tab?.title || "新资源建议";
  const body = encodeURIComponent(
    `## 资源信息\n\n- 标题：${title}\n- 链接：${url}\n- 分类：\n- 简介：\n`
  );
  chrome.tabs.create({
    url: `${ISSUES}&title=${encodeURIComponent(`[收录] ${title}`)}&body=${body}`,
  });
});
