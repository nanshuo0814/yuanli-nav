/**
 * 批量资源生成脚本
 * 运行: node scripts/generate-bulk.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../data/resources");

/** 快捷创建资源条目 */
function r(id, title, description, url, category, subCategory, tags, isRecommended = false, createdAt = "2024-06-15") {
  return { id, title, description, url, category, subCategory, tags, isRecommended, createdAt };
}

/** 写入 TS 资源文件 */
function writeResourceFile(filename, exportName, items) {
  const content = `import { Resource } from "@/lib/types";

/** 自动生成 - ${items.length} 条 */
export const ${exportName}: Resource[] = ${JSON.stringify(items, null, 2)};
`;
  fs.writeFileSync(path.join(OUT_DIR, filename), content, "utf8");
  console.log(`  ${filename}: ${items.length} 条`);
  return items.length;
}

// ========== 资源导航站 ==========
const navSites = [
  r("nav001", "硬核指南", "影视动漫音乐电子书游戏等全网资源聚合导航", "https://yinghezhinan.com", "tools", "online-tools", ["导航站", "聚合", "影视"], true),
  r("nav002", "发现导航", "800+优质网站收录，纯静态SEO友好导航", "https://nav.xiejiahe.com", "tools", "online-tools", ["导航站", "GitHub", "静态"], true),
  r("nav003", "WebStack 网址导航", "经典静态响应式网址导航开源项目", "https://webstack.cc", "tools", "online-tools", ["导航站", "开源", "WebStack"], true),
  r("nav004", "虫部落", "学术搜索与稀缺资源聚合导航社区", "https://www.chongbuluo.com", "tools", "online-tools", ["导航站", "学术", "搜索"], true),
  r("nav005", "虫部落快搜", "多引擎聚合搜索入口", "https://search.chongbuluo.com", "tools", "online-tools", ["搜索", "聚合", "学术"], true),
  r("nav006", "龙轩导航", "影视PPT模板软件网盘搜索一站式导航", "http://ilxdh.com", "tools", "online-tools", ["导航站", "影视", "网盘"], true),
  r("nav007", "某柠檬导航", "清爽无广告网址分类目录", "https://www.moulem.com", "tools", "online-tools", ["导航站", "无广告", "分类"], false),
  r("nav008", "优设导航", "设计师必备导航，灵感工具素材", "https://hao.uisdc.com", "tools", "online-tools", ["导航站", "设计", "UI"], true),
  r("nav009", "考拉新媒体导航", "新媒体运营工具与资源导航", "https://www.kaolamedia.com", "tools", "online-tools", ["导航站", "新媒体", "运营"], true),
  r("nav010", "AI工具集", "国内外AI工具收录导航", "https://ai-bot.cn", "tools", "online-tools", ["导航站", "AI", "工具"], true),
  r("nav011", "FutureTools", "AI工具发现与分类导航", "https://www.futuretools.io", "tools", "online-tools", ["导航站", "AI", "发现"], true),
  r("nav012", "Toolify", "最大AI工具目录导航", "https://www.toolify.ai", "tools", "online-tools", ["导航站", "AI", "目录"], true),
  r("nav013", "There's An AI For That", "按用途查找AI工具", "https://theresanaiforthat.com", "tools", "online-tools", ["导航站", "AI", "搜索"], true),
  r("nav014", "TopAI.tools", "AI工具排行榜导航", "https://topai.tools", "tools", "online-tools", ["导航站", "AI", "排行"], false),
  r("nav015", "AIToolNet", "AI工具网络导航目录", "https://www.aitoolnet.com", "tools", "online-tools", ["导航站", "AI", "目录"], false),
  r("nav016", "笔点", "简洁美观的个人导航", "https://www.bidianer.com", "tools", "online-tools", ["导航站", "简洁", "个人"], false),
  r("nav017", "搜图导航", "设计素材与灵感搜索导航", "https://www.91sotu.com", "tools", "online-tools", ["导航站", "搜图", "设计"], false),
  r("nav018", "创造狮导航", "创意工作者资源导航", "https://www.chuangzaoshi.com", "tools", "online-tools", ["导航站", "创意", "设计"], false),
  r("nav019", "聚搜君", "搜索引擎聚合导航", "https://www.jusoujun.com", "tools", "online-tools", ["导航站", "搜索", "聚合"], false),
  r("nav020", "千帆搜索", "网盘资源聚合搜索引擎", "https://pan.qianfan.app", "tools", "online-tools", ["导航站", "网盘", "搜索"], true),
  r("nav021", "盘搜搜", "百度网盘资源搜索", "https://www.pansoso.com", "tools", "online-tools", ["网盘", "搜索", "百度"], false),
  r("nav022", "大力盘", "网盘资源搜索工具", "https://www.dalipan.com", "tools", "online-tools", ["网盘", "搜索", "资源"], false),
  r("nav023", "小不点搜索", "网盘与资源搜索", "https://www.xiaoso.net", "tools", "online-tools", ["网盘", "搜索", "聚合"], false),
  r("nav024", "Ruancang.net", "软件下载与资源导航", "https://www.ruancang.net", "tools", "online-tools", ["导航站", "软件", "下载"], false),
  r("nav025", "LK21 资源导航", "优质网站收集导航", "https://lk21.cc", "tools", "online-tools", ["导航站", "收集", "资源"], false),
  r("nav026", "运维导航", "运维工程师工具导航", "https://yunwei.live", "tools", "online-tools", ["导航站", "运维", "DevOps"], true),
  r("nav027", "前端导航", "前端开发资源导航", "https://www.frontendjs.com", "tools", "online-tools", ["导航站", "前端", "开发"], false),
  r("nav028", "DevTool", "开发者工具导航", "https://devtool.tech", "tools", "online-tools", ["导航站", "开发者", "工具"], true),
  r("nav029", "程序员导航", "编程学习工具资源导航", "https://cxy521.com", "tools", "online-tools", ["导航站", "编程", "学习"], false),
  r("nav030", "MDI000 设计导航", "设计资源工具导航", "https://www.mdi000.com", "tools", "online-tools", ["导航站", "设计", "资源"], false),
  r("nav031", "Seeseed", "设计灵感与工具导航", "https://www.seeseed.com", "tools", "online-tools", ["导航站", "设计", "灵感"], false),
  r("nav032", "Addog", "广告与设计资源导航", "https://www.addog.vip", "tools", "online-tools", ["导航站", "广告", "设计"], false),
  r("nav033", "Pixiv工具箱", "Pixiv相关工具导航", "https://tools.miku.ac", "tools", "online-tools", ["导航站", "Pixiv", "二次元"], false),
  r("nav034", "Anime1 导航", "动漫资源工具导航", "https://anime1.me", "video", "video-streaming", ["动漫", "导航", "追番"], true),
  r("nav035", "LyLme 六零导航", "简洁无广告上网导航", "https://www.lylme.com", "tools", "online-tools", ["导航站", "简洁", "无广告"], false),
  r("nav036", "Mini NavSite", "轻量网址导航", "https://github.com/cifaz/nav-site", "tools", "online-tools", ["导航站", "开源", "轻量"], false),
  r("nav037", "TimLang AI目录", "AI资源工具导航收录", "https://github.com/TimLang/awesome-ai-directory", "tools", "online-tools", ["导航站", "AI", "GitHub"], false),
  r("nav038", "Awesome Navigation", "优秀导航项目GitHub合集", "https://github.com/eryajf/awesome-navigation", "tools", "online-tools", ["导航站", "GitHub", "合集"], true),
  r("nav039", "中文开放网站目录", "1500+公开网站资源数据集", "https://github.com/ifanqiang-com/chinese-open-web-directory", "tools", "online-tools", ["导航站", "开源", "数据集"], true),
  r("nav040", "Awesome Useful Websites", "实用网站GitHub精选清单", "https://github.com/atakanaltok/awesome-useful-websites", "tools", "online-tools", ["导航站", "GitHub", "实用"], true),
  r("nav041", "Magicbox AI", "AI工具资源聚合平台", "https://magicbox.tools", "ai", "ai-platforms", ["AI", "导航", "聚合"], false),
  r("nav042", "Supertools AI", "AI工具导航与评估", "https://supertools.therundown.ai", "ai", "ai-platforms", ["AI", "导航", "评估"], false),
  r("nav043", "ToolPilot AI", "AI工具发现导航", "https://www.toolpilot.ai", "ai", "ai-platforms", ["AI", "导航", "发现"], false),
  r("nav044", "AI Navigation Site", "AI网站导航平台", "https://ainavigationsite.com", "ai", "ai-platforms", ["AI", "导航", "收录"], false),
  r("nav045", "ToolsFine", "精选工具资源导航", "https://toolsfine.com", "tools", "online-tools", ["导航站", "工具", "精选"], false),
  r("nav046", "Victrays", "AI工具聚合导航", "https://victrays.com", "ai", "ai-platforms", ["AI", "导航", "聚合"], false),
  r("nav047", "Expify AI", "Ultimate AI Tools Directory", "https://www.expify.ai", "ai", "ai-platforms", ["AI", "导航", "目录"], false),
  r("nav048", "AI Dream There", "中文AI网站导航", "https://ai.dreamthere.cn", "ai", "ai-platforms", ["AI", "导航", "中文"], false),
  r("nav049", "ToolsApp AI", "免费AI工具目录", "https://toolsapp.cc", "ai", "ai-platforms", ["AI", "导航", "免费"], false),
  r("nav050", "XNavi AI", "AI工具导航收录", "https://xnavi.ai", "ai", "ai-platforms", ["AI", "导航", "中文"], false),
];

// ========== 文件/图片托管 ==========
const fileHosting = [
  r("fh001", "StarImg", "匿名图片托管，永久外链CDN加速", "https://starimg.vip", "tools", "online-tools", ["图片", "托管", "匿名"], true),
  r("fh002", "Catbox", "200MB永久匿名文件托管", "https://catbox.moe", "tools", "online-tools", ["文件", "托管", "永久"], true),
  r("fh003", "Litterbox", "Catbox临时文件托管1GB", "https://litterbox.catbox.moe", "tools", "online-tools", ["文件", "临时", "匿名"], false),
  r("fh004", "ImgBB", "免费图片托管32MB直链", "https://imgbb.com", "tools", "online-tools", ["图片", "托管", "直链"], true),
  r("fh005", "Postimages", "免费匿名图片托管", "https://postimages.org", "tools", "online-tools", ["图片", "托管", "匿名"], true),
  r("fh006", "Imgur", "全球最大图片分享社区", "https://imgur.com", "tools", "online-tools", ["图片", "分享", "社区"], true),
  r("fh007", "iimg.live", "永久免费图片托管无需注册", "https://iimg.live", "tools", "online-tools", ["图片", "永久", "隐私"], true),
  r("fh008", "ImageToURL", "匿名图片上传10MB", "https://imagetourl.cloud", "tools", "online-tools", ["图片", "匿名", "上传"], false),
  r("fh009", "Gofile", "无限容量云文件分享", "https://gofile.io", "tools", "online-tools", ["文件", "云存储", "分享"], true),
  r("fh010", "Pixeldrain", "20GB单文件快速分享", "https://pixeldrain.com", "tools", "online-tools", ["文件", "分享", "大文件"], true),
  r("fh011", "Wormhole", "端到端加密10GB临时传输", "https://wormhole.app", "tools", "online-tools", ["文件", "加密", "传输"], true),
  r("fh012", "Filebin", "简单匿名文件分享", "https://filebin.net", "tools", "online-tools", ["文件", "匿名", "分享"], false),
  r("fh013", "Send", "Firefox Send替代文件传输", "https://send.now", "tools", "online-tools", ["文件", "传输", "临时"], false),
  r("fh014", "File.io", "阅后即焚文件分享", "https://www.file.io", "tools", "online-tools", ["文件", "一次性", "分享"], false),
  r("fh015", "Easyupload.io", "10GB文件在线分享", "https://easyupload.io", "tools", "online-tools", ["文件", "上传", "分享"], false),
  r("fh016", "ANONYMFILE", "5GB匿名文件上传", "https://anonymfile.com", "tools", "online-tools", ["文件", "匿名", "5GB"], false),
  r("fh017", "File.kiwi", "E2E加密无限大小文件传输", "https://file.kiwi", "tools", "online-tools", ["文件", "加密", "无限"], true),
  r("fh018", "UploadNow", "100GB匿名文件上传", "https://uploadnow.io", "tools", "online-tools", ["文件", "上传", "大容量"], false),
  r("fh019", "1fichier", "300GB单文件分享", "https://1fichier.com", "tools", "online-tools", ["文件", "分享", "大文件"], false),
  r("fh020", "pCloud Transfer", "5GB免费文件传输", "https://transfer.pcloud.com", "tools", "online-tools", ["文件", "传输", "5GB"], false),
  r("fh021", "WeTransfer", "2GB免费文件传输", "https://wetransfer.com", "tools", "online-tools", ["文件", "传输", "简单"], true),
  r("fh022", "Snapdrop", "局域网文件传输", "https://snapdrop.net", "tools", "online-tools", ["文件", "局域网", "传输"], true),
  r("fh023", "Sharedrop", "开源局域网文件共享", "https://sharedrop.io", "tools", "online-tools", ["文件", "开源", "局域网"], false),
  r("fh024", "Uguu", "128MB临时文件托管", "https://uguu.se", "tools", "online-tools", ["文件", "临时", "快速"], false),
  r("fh025", "0x0.st", "命令行友好文件托管", "https://0x0.st", "tools", "online-tools", ["文件", "CLI", "开发者"], false),
  r("fh026", "Transfer.sh", "命令行文件传输", "https://transfer.sh", "tools", "online-tools", ["文件", "CLI", "传输"], false),
  r("fh027", "Tmpfiles", "100MB临时文件", "https://tmpfiles.org", "tools", "online-tools", ["文件", "临时", "快速"], false),
  r("fh028", "FileDitch", "5GB文件分享", "https://fileditch.com", "tools", "online-tools", ["文件", "分享", "5GB"], false),
  r("fh029", "Rootz", "25GB匿名文件分享", "https://rootz.so", "tools", "online-tools", ["文件", "匿名", "25GB"], false),
  r("fh030", "AkiraBox", "20GB文件分享", "https://akirabox.com", "tools", "online-tools", ["文件", "分享", "大容量"], false),
  r("fh031", "Sm.ms", "免费图床无限制", "https://sm.ms", "tools", "online-tools", ["图床", "免费", "中文"], true),
  r("fh032", "路过图床", "国内免费图床服务", "https://imgse.com", "tools", "online-tools", ["图床", "国内", "免费"], false),
  r("fh033", "聚合图床", "多图床聚合上传", "https://www.superbed.cn", "tools", "online-tools", ["图床", "聚合", "国内"], false),
  r("fh034", "PicGo图床", "开源图床管理工具", "https://molunerfinn.com/PicGo", "tools", "online-tools", ["图床", "开源", "工具"], false),
  r("fh035", "Chevereto", "自托管图床程序", "https://chevereto.com", "tools", "online-tools", ["图床", "自托管", "开源"], false),
  r("fh036", "FreeImg", "免费图片CDN托管", "https://freeimage.host", "tools", "online-tools", ["图片", "CDN", "免费"], false),
  r("fh037", "ImgPile", "简单免费图床", "https://imgpile.com", "tools", "online-tools", ["图床", "简单", "免费"], false),
  r("fh038", "Telegraph", "Telegram匿名图文发布", "https://telegra.ph", "tools", "online-tools", ["图文", "匿名", "Telegram"], true),
  r("fh039", "Pastebin", "代码文本分享平台", "https://pastebin.com", "tools", "online-tools", ["文本", "代码", "分享"], true),
  r("fh040", "PrivateBin", "加密零知识Pastebin", "https://privatebin.net", "tools", "online-tools", ["文本", "加密", "隐私"], true),
  r("fh041", "Hastebin", "极速代码片段分享", "https://hastebin.com", "tools", "online-tools", ["代码", "分享", "快速"], false),
  r("fh042", "Ghostbin", "加密文本分享", "https://ghostbin.com", "tools", "online-tools", ["文本", "加密", "分享"], false),
  r("fh043", "Stashr", "500MB可选过期文件分享", "https://stashr.wtf", "tools", "online-tools", ["文件", "分享", "过期"], false),
  r("fh044", "Buzzheavier", "无限容量文件分享", "https://buzzheavier.com", "tools", "online-tools", ["文件", "无限", "分享"], false),
  r("fh045", "Awesome Free File Hosting", "免费文件托管GitHub清单", "https://github.com/Nick088Official/awesome-free-file-hosting", "tools", "online-tools", ["文件", "GitHub", "清单"], true),
];

console.log("生成批量资源文件...\n");
let total = 0;
total += writeResourceFile("nav-sites.ts", "navSitesResources", navSites);
total += writeResourceFile("file-hosting.ts", "fileHostingResources", fileHosting);
console.log(`\n本批合计: ${total} 条`);
