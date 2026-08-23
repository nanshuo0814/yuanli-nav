/**
 * 批量资源生成 Part6: 补充至 1000+
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../data/resources");

function r(id, title, description, url, category, subCategory, tags, isRecommended = false, createdAt = "2024-09-01") {
  return { id, title, description, url, category, subCategory, tags, isRecommended, createdAt };
}

function writeResourceFile(filename, exportName, items) {
  fs.writeFileSync(path.join(OUT_DIR, filename), `import { Resource } from "@/lib/types";\n\nexport const ${exportName}: Resource[] = ${JSON.stringify(items, null, 2)};\n`, "utf8");
  console.log(`  ${filename}: ${items.length}`);
  return items.length;
}

const miscExtra = [
  r("me001", "硬核指南APP", "硬核指南官方Android/iOS客户端", "https://yinghezhinan.com/app", "tools", "online-tools", ["硬核指南", "APP", "聚合"], true),
  r("me002", "Neat Download Manager", "多线程下载加速器", "http://www.neatdownloadmanager.com", "software", "system-tools", ["下载", "加速", "Windows"], true),
  r("me003", "Internet Download Manager", "经典下载管理器", "https://www.internetdownloadmanager.com", "software", "system-tools", ["下载", "IDM", "Windows"], true),
  r("me004", "Free Download Manager", "免费多平台下载器", "https://www.freedownloadmanager.org", "software", "system-tools", ["下载", "免费", "跨平台"], true),
  r("me005", "Motrix", "全能下载工具", "https://motrix.app", "software", "system-tools", ["下载", "开源", "Aria2"], true),
  r("me006", "Aria2", "命令行多协议下载", "https://aria2.github.io", "software", "system-tools", ["下载", "CLI", "开源"], true),
  r("me007", "qBittorrent", "开源BT客户端", "https://www.qbittorrent.org", "software", "system-tools", ["BT", "开源", "下载"], true),
  r("me008", "Transmission", "轻量BT客户端", "https://transmissionbt.com", "software", "system-tools", ["BT", "轻量", "开源"], true),
  r("me009", "Wallhaven", "高质量壁纸社区", "https://wallhaven.cc", "design", "design-resources", ["壁纸", "高质量", "社区"], true),
  r("me010", "Wallpaper Abyss", "海量壁纸下载", "https://www.wallpaperabyss.com", "design", "design-resources", ["壁纸", "下载", "4K"]),
  r("me011", "Unsplash Wallpapers", "Unsplash壁纸", "https://unsplash.com/wallpapers", "design", "design-resources", ["壁纸", "免费", "摄影"]),
  r("me012", "Dynamic Wallpaper Club", "Mac动态壁纸", "https://dynamicwallpaper.club", "design", "design-resources", ["壁纸", "动态", "Mac"]),
  r("me013", "Milanote", "创意项目视觉板", "https://milanote.com", "design", "design-tools", ["灵感", "视觉板", "创意"]),
  r("me014", "Niice", "品牌情绪板工具", "https://niice.co", "design", "design-tools", ["情绪板", "品牌", "设计"]),
  r("me015", "Coolors Gradient", "CSS渐变生成", "https://coolors.co/gradient-maker", "design", "design-tools", ["渐变", "CSS", "生成"], true),
  r("me016", "CSS Gradient", "渐变背景生成器", "https://cssgradient.io", "design", "design-tools", ["渐变", "CSS", "背景"]),
  r("me017", "Glassmorphism Generator", "毛玻璃效果生成", "https://hype4.academy/tools/glassmorphism-generator", "design", "design-tools", ["毛玻璃", "CSS", "生成"]),
  r("me018", "Neumorphism.io", "新拟态设计生成", "https://neumorphism.io", "design", "design-tools", ["新拟态", "CSS", "生成"]),
  r("me019", "Favicon.io", "Favicon在线生成", "https://favicon.io", "design", "design-tools", ["Favicon", "生成", "免费"], true),
  r("me020", "Logo Maker", "Canva Logo生成", "https://www.canva.com/create/logos", "design", "design-tools", ["Logo", "生成", "Canva"]),
  r("me021", "Namecheap Logo", "免费Logo生成器", "https://www.namecheap.com/logo-maker", "design", "design-tools", ["Logo", "免费", "生成"]),
  r("me022", "Brandmark", "AI Logo设计", "https://brandmark.io", "design", "design-tools", ["Logo", "AI", "设计"]),
  r("me023", "Looka", "AI品牌设计", "https://looka.com", "design", "design-tools", ["品牌", "AI", "Logo"]),
  r("me024", "TinyPNG API", "图片压缩API", "https://tinypng.com/developers", "tools", "dev-utils", ["图片", "压缩", "API"]),
  r("me025", "Squoosh CLI", "Google图片压缩CLI", "https://github.com/GoogleChromeLabs/squoosh", "tools", "dev-utils", ["图片", "压缩", "CLI"]),
  r("me026", "ImageOptim", "Mac图片无损压缩", "https://imageoptim.com", "software", "system-tools", ["图片", "压缩", "Mac"], true),
  r("me027", "Caesium", "图片批量压缩", "https://saerasoft.com/caesium", "software", "system-tools", ["图片", "压缩", "批量"]),
  r("me028", "Optimizilla", "在线图片压缩", "https://imagecompressor.com", "tools", "online-tools", ["图片", "压缩", "在线"]),
  r("me029", "Compressor.io", "在线图片压缩", "https://compressor.io", "tools", "online-tools", ["图片", "压缩", "在线"]),
  r("me030", "Kraken.io", "图片优化服务", "https://kraken.io", "tools", "online-tools", ["图片", "优化", "Web"]),
  r("me031", "Shortwave", "Gmail AI邮件客户端", "https://www.shortwave.com", "software", "productivity", ["邮件", "AI", "Gmail"]),
  r("me032", "Superhuman", "极速邮件客户端", "https://superhuman.com", "software", "productivity", ["邮件", "极速", "效率"]),
  r("me033", "Hey", "Basecamp新邮件服务", "https://www.hey.com", "software", "productivity", ["邮件", "隐私", "Basecamp"]),
  r("me034", "Tutanota", "加密邮件服务", "https://tutanota.com", "software", "productivity", ["邮件", "加密", "隐私"], true),
  r("me035", "Fastmail", "隐私友好邮件", "https://www.fastmail.com", "software", "productivity", ["邮件", "隐私", "付费"]),
  r("me036", "Temp Mail", "一次性临时邮箱", "https://temp-mail.org", "tools", "online-tools", ["邮箱", "临时", "匿名"], true),
  r("me037", "Guerrilla Mail", "临时邮箱服务", "https://www.guerrillamail.com", "tools", "online-tools", ["邮箱", "临时", "匿名"]),
  r("me038", "10 Minute Mail", "10分钟临时邮箱", "https://10minutemail.com", "tools", "online-tools", ["邮箱", "临时", "10分钟"]),
  r("me039", "Maildrop", "免费临时收件", "https://maildrop.cc", "tools", "online-tools", ["邮箱", "临时", "免费"]),
  r("me040", "YOPmail", "免注册临时邮箱", "https://yopmail.com", "tools", "online-tools", ["邮箱", "临时", "免注册"]),
  r("me041", "SimpleLogin", "邮箱别名服务", "https://simplelogin.io", "tools", "online-tools", ["邮箱", "别名", "隐私"], true),
  r("me042", "Firefox Relay", "邮箱掩码服务", "https://relay.firefox.com", "tools", "online-tools", ["邮箱", "掩码", "Firefox"]),
  r("me043", "Have I Been Pwned", "数据泄露查询", "https://haveibeenpwned.com", "tools", "online-tools", ["安全", "泄露", "查询"], true),
  r("me044", "VirusTotal", "文件URL病毒扫描", "https://www.virustotal.com", "tools", "online-tools", ["安全", "病毒", "扫描"], true),
  r("me045", "URLVoid", "网站安全检测", "https://www.urlvoid.com", "tools", "online-tools", ["安全", "网站", "检测"]),
  r("me046", "Privacy Guides", "隐私工具推荐", "https://www.privacyguides.org", "tools", "online-tools", ["隐私", "指南", "安全"], true),
  r("me047", "AlternativeTo", "软件替代品搜索", "https://alternativeto.net", "tools", "online-tools", ["软件", "替代", "搜索"], true),
  r("me048", "Slant", "产品对比推荐", "https://www.slant.co", "tools", "online-tools", ["对比", "推荐", "产品"]),
  r("me049", "SaaSHub", "SaaS软件目录", "https://www.saashub.com", "tools", "online-tools", ["SaaS", "目录", "软件"]),
  r("me050", "StackShare", "技术栈分享社区", "https://stackshare.io", "tools", "online-tools", ["技术栈", "社区", "对比"], true),
  r("me051", "BuiltWith", "网站技术分析", "https://builtwith.com", "tools", "dev-utils", ["网站", "技术", "分析"], true),
  r("me052", "Wappalyzer", "网站技术栈识别", "https://www.wappalyzer.com", "tools", "dev-utils", ["技术栈", "识别", "浏览器"], true),
  r("me053", "SimilarWeb", "网站流量分析", "https://www.similarweb.com", "tools", "online-tools", ["流量", "分析", "竞争"]),
  r("me054", "Semrush", "SEO与竞争分析", "https://www.semrush.com", "tools", "online-tools", ["SEO", "分析", "营销"]),
  r("me055", "Ahrefs", "SEO工具套件", "https://ahrefs.com", "tools", "online-tools", ["SEO", "外链", "关键词"], true),
  r("me056", "Ubersuggest", "Neil Patel SEO工具", "https://neilpatel.com/ubersuggest", "tools", "online-tools", ["SEO", "关键词", "免费"]),
  r("me057", "AnswerThePublic", "搜索问题可视化", "https://answerthepublic.com", "tools", "online-tools", ["SEO", "关键词", "可视化"], true),
  r("me058", "Google Trends", "搜索趋势分析", "https://trends.google.com", "tools", "online-tools", ["趋势", "Google", "搜索"], true),
  r("me059", "Exploding Topics", "新兴趋势发现", "https://explodingtopics.com", "tools", "online-tools", ["趋势", "发现", "新兴"], true),
  r("me060", "Glimpse", "Google Trends增强", "https://meetglimpse.com", "tools", "online-tools", ["趋势", "Google", "增强"]),
];

let total = writeResourceFile("misc-extra.ts", "miscExtraResources", miscExtra);
console.log(`Part6 合计: ${total}`);
