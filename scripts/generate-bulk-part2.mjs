/**
 * 批量资源生成 Part2: 影视/动漫/直播
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../data/resources");

function r(id, title, description, url, category, subCategory, tags, isRecommended = false, createdAt = "2024-07-01") {
  return { id, title, description, url, category, subCategory, tags, isRecommended, createdAt };
}

function writeResourceFile(filename, exportName, items) {
  const content = `import { Resource } from "@/lib/types";

export const ${exportName}: Resource[] = ${JSON.stringify(items, null, 2)};
`;
  fs.writeFileSync(path.join(OUT_DIR, filename), content, "utf8");
  console.log(`  ${filename}: ${items.length}`);
  return items.length;
}

const streamingVideo = [
  r("sv001", "LIBVIO", "海外影视资源老牌在线站", "https://www.libvio.me", "video", "video-streaming", ["影视", "在线", "海外"], true),
  r("sv002", "厂长资源", "高清秒播综合影视站", "https://www.czzy.top", "video", "video-streaming", ["影视", "高清", "综合"], true),
  r("sv003", "注视影视", "海外与国内高口碑影视剧", "https://www.zhuzhu.tv", "video", "video-streaming", ["影视", "海外", "口碑"], false),
  r("sv004", "No视频", "海外影视剧在线观看", "https://www.novipnoad.com", "video", "video-streaming", ["影视", "海外", "在线"], false),
  r("sv005", "大米星球", "综合影视搜索导航", "https://www.dmdy2.com", "video", "video-streaming", ["影视", "搜索", "综合"], false),
  r("sv006", "555电影", "免费在线影视观看", "https://www.555dy.fun", "video", "video-streaming", ["影视", "免费", "在线"], false),
  r("sv007", "电影先生", "高清影视在线观看", "https://dianying.im", "video", "video-streaming", ["影视", "高清", "在线"], false),
  r("sv008", "低端影视", "海外影视资源站", "https://ddys.pro", "video", "video-streaming", ["影视", "海外", "字幕"], true),
  r("sv009", "AGE动漫", "动漫与影视综合站", "https://www.agedm.org", "video", "video-streaming", ["动漫", "影视", "综合"], true),
  r("sv010", "Cupfox", "茶杯狐影视搜索聚合", "https://cupfox.app", "video", "video-streaming", ["影视", "搜索", "聚合"], true),
  r("sv011", "VidHub", "影视资源聚合搜索", "https://vidhub.me", "video", "video-streaming", ["影视", "聚合", "搜索"], false),
  r("sv012", "LibreTV", "开源TVBox影视源", "https://github.com/LibreSpark/LibreTV", "video", "video-streaming", ["影视", "开源", "TVBox"], true),
  r("sv013", "TVBox", "开源电视盒子影视APP", "https://github.com/CatVodTVOfficial/TVBoxOSC", "video", "video-tools", ["影视", "开源", "TV"], true),
  r("sv014", "影视仓", "TVBox接口影视APP", "https://github.com/Ysw123455/YSC", "video", "video-tools", ["影视", "APP", "接口"], false),
  r("sv015", "OrionTV", "跨平台影视播放器", "https://github.com/orion-lib/OrionTV", "video", "video-tools", ["影视", "播放器", "跨平台"], false),
  r("sv016", "SubHD", "字幕下载分享社区", "https://subhd.tv", "video", "video-tools", ["字幕", "下载", "社区"], true),
  r("sv017", "Subscene", "全球最大字幕库", "https://subscene.com", "video", "video-tools", ["字幕", "全球", "下载"], true),
  r("sv018", "OpenSubtitles", "开放字幕数据库", "https://www.opensubtitles.org", "video", "video-tools", ["字幕", "开放", "多语言"], true),
  r("sv019", "Assrt", "射手网继承者字幕站", "https://assrt.net", "video", "video-tools", ["字幕", "中文", "社区"], true),
  r("sv020", "Zimuku", "字幕下载网站", "https://www.zimuku.org", "video", "video-tools", ["字幕", "下载", "中文"], false),
  r("sv021", "TMDb", "The Movie Database影视数据库", "https://www.themoviedb.org", "video", "video-community", ["影视", "数据库", "API"], true),
  r("sv022", "Bangumi", "番组计划ACG数据库", "https://bangumi.tv", "video", "video-community", ["动漫", "数据库", "评分"], true),
  r("sv023", "MyAnimeList", "全球最大动漫评分社区", "https://myanimelist.net", "video", "video-community", ["动漫", "评分", "社区"], true),
  r("sv024", "AniList", "现代动漫追踪平台", "https://anilist.co", "video", "video-community", ["动漫", "追踪", "API"], true),
  r("sv025", "Kitsu", "动漫发现与社交", "https://kitsu.io", "video", "video-community", ["动漫", "社交", "发现"], false),
  r("sv026", "JustWatch", "流媒体片源聚合搜索", "https://www.justwatch.com", "video", "video-community", ["影视", "流媒体", "搜索"], true),
  r("sv027", "Reelgood", "流媒体内容聚合", "https://reelgood.com", "video", "video-community", ["影视", "流媒体", "聚合"], false),
  r("sv028", "Simkl", "影视追踪与推荐", "https://simkl.com", "video", "video-community", ["影视", "追踪", "推荐"], false),
  r("sv029", "Kodi", "开源媒体中心", "https://kodi.tv", "video", "video-tools", ["媒体", "开源", "播放器"], true),
  r("sv030", "Plex", "个人媒体服务器", "https://www.plex.tv", "video", "video-tools", ["媒体", "服务器", "串流"], true),
  r("sv031", "Jellyfin", "开源免费媒体服务器", "https://jellyfin.org", "video", "video-tools", ["媒体", "开源", "自托管"], true),
  r("sv032", "Emby", "媒体服务器软件", "https://emby.media", "video", "video-tools", ["媒体", "服务器", "串流"], false),
  r("sv033", "Stremio", "torrent流媒体聚合", "https://www.stremio.com", "video", "video-tools", ["流媒体", "聚合", "插件"], false),
  r("sv034", "Popcorn Time", "torrent流媒体客户端", "https://popcorntime.app", "video", "video-tools", ["流媒体", "torrent", "客户端"], false),
  r("sv035", "VLC", "万能开源媒体播放器", "https://www.videolan.org", "video", "video-tools", ["播放器", "开源", "万能"], true),
  r("sv036", "MPV", "极简高性能播放器", "https://mpv.io", "video", "video-tools", ["播放器", "开源", "轻量"], true),
  r("sv037", "IINA", "Mac现代媒体播放器", "https://iina.io", "video", "video-tools", ["播放器", "Mac", "现代"], false),
  r("sv038", "PotPlayer", "Windows强大播放器", "https://potplayer.daum.net", "video", "video-tools", ["播放器", "Windows", "强大"], true),
  r("sv039", "Infuse", "Apple平台媒体播放器", "https://firecore.com/infuse", "video", "video-tools", ["播放器", "Apple", "精美"], false),
  r("sv040", "Sonarr", "电视剧自动下载管理", "https://sonarr.tv", "video", "video-tools", ["自动化", "电视剧", "下载"], true),
  r("sv041", "Radarr", "电影自动下载管理", "https://radarr.video", "video", "video-tools", ["自动化", "电影", "下载"], true),
  r("sv042", "Bazarr", "字幕自动下载", "https://www.bazarr.media", "video", "video-tools", ["字幕", "自动化", "下载"], false),
  r("sv043", "Prowlarr", "索引器聚合管理", "https://prowlarr.com", "video", "video-tools", ["索引", "自动化", "管理"], false),
  r("sv044", "Overseerr", "媒体请求管理系统", "https://overseerr.dev", "video", "video-tools", ["请求", "管理", "媒体"], false),
  r("sv045", "Tautulli", "Plex监控统计", "https://tautulli.com", "video", "video-tools", ["Plex", "监控", "统计"], false),
  r("sv046", "Crunchyroll", "全球最大动漫流媒体", "https://www.crunchyroll.com", "video", "video-streaming", ["动漫", "流媒体", "正版"], true),
  r("sv047", "Funimation", "动漫流媒体平台", "https://www.funimation.com", "video", "video-streaming", ["动漫", "流媒体", "正版"], false),
  r("sv048", "哔哩哔哩番剧", "B站正版番剧区", "https://www.bilibili.com/anime", "video", "video-streaming", ["动漫", "正版", "B站"], true),
  r("sv049", "巴哈姆特动画疯", "台湾正版动漫流媒体", "https://ani.gamer.com.tw", "video", "video-streaming", ["动漫", "正版", "台湾"], false),
  r("sv050", "KKTV", "台湾影视流媒体", "https://www.kktv.me", "video", "video-streaming", ["影视", "台湾", "流媒体"], false),
];

const animeManga = [
  r("an001", "Anime1", "日番神器简洁快速", "https://anime1.me", "video", "video-streaming", ["动漫", "日番", "在线"], true),
  r("an002", "AniCh", "高清动漫弹幕追番", "https://www.anich.cn", "video", "video-streaming", ["动漫", "弹幕", "高清"], false),
  r("an003", "Nyaa", "全球最大动漫torrent", "https://nyaa.si", "video", "video-community", ["动漫", "torrent", "下载"], true),
  r("an004", "AnimeTosho", "动漫自动转存", "https://animetosho.org", "video", "video-community", ["动漫", "下载", "转存"], false),
  r("an005", "MangaDex", "开源漫画阅读平台", "https://mangadex.org", "video", "video-streaming", ["漫画", "开源", "多语言"], true),
  r("an006", "MangaPlus", "集英社官方免费漫画", "https://mangaplus.shueisha.co.jp", "video", "video-streaming", ["漫画", "正版", "集英社"], true),
  r("an007", "Webtoon", "全球最大条漫平台", "https://www.webtoons.com", "video", "video-streaming", ["漫画", "条漫", "全球"], true),
  r("an008", "Pixiv", "全球最大插画社区", "https://www.pixiv.net", "design", "inspiration", ["插画", "二次元", "社区"], true),
  r("an009", "Danbooru", "动漫图库标签系统", "https://danbooru.donmai.us", "design", "design-resources", ["图库", "动漫", "标签"], false),
  r("an010", "Gelbooru", "动漫图库搜索引擎", "https://gelbooru.com", "design", "design-resources", ["图库", "动漫", "搜索"], false),
  r("an011", "Saucenao", "以图搜动漫出处", "https://saucenao.com", "tools", "online-tools", ["以图搜图", "动漫", "出处"], true),
  r("an012", "Trace.moe", "动漫截图搜索引擎", "https://trace.moe", "tools", "online-tools", ["截图", "动漫", "搜索"], true),
  r("an013", "Anime Characters Database", "动漫角色数据库", "https://www.animecharactersdatabase.com", "video", "video-community", ["动漫", "角色", "数据库"], false),
  r("an014", "VNR", "Visual Novel Reader", "https://vnr.aniclan.com", "software", "productivity", ["视觉小说", "翻译", "工具"], false),
  r("an015", "VNDB", "视觉小说数据库", "https://vndb.org", "video", "video-community", ["视觉小说", "数据库", "评分"], true),
  r("an016", "Steam视觉小说", "Steam VN游戏区", "https://store.steampowered.com/tags/en/Visual%20Novel", "video", "video-streaming", ["视觉小说", "Steam", "游戏"], false),
  r("an017", "Kazumi", "多源追番APP开源", "https://github.com/Predidit/Kazumi", "video", "video-tools", ["追番", "开源", "多源"], true),
  r("an018", "oneAnime", "anime1第三方客户端", "https://github.com/Predidit/oneAnime", "video", "video-tools", ["追番", "开源", "跨平台"], false),
  r("an019", "纯纯看番", "开源多番源追番", "https://github.com/heyanLE/PureAnime", "video", "video-tools", ["追番", "开源", "Android"], false),
  r("an020", "AniList API", "动漫数据开放API", "https://anilist.gitbook.io/anilist-apiv2-docs", "programming", "dev-tools", ["动漫", "API", "GraphQL"], false),
  r("an021", "Jikan API", "MyAnimeList非官方API", "https://jikan.moe", "programming", "dev-tools", ["动漫", "API", "MAL"], false),
  r("an022", "Kitsu API", "Kitsu开放API", "https://kitsu.docs.apiary.io", "programming", "dev-tools", ["动漫", "API", "JSON:API"], false),
  r("an023", "ComicWalker", "角川免费在线漫画", "https://comic-walker.com", "video", "video-streaming", ["漫画", "正版", "角川"], false),
  r("an024", "PicACG", "哔咔漫画", "https://picacomic.com", "video", "video-streaming", ["漫画", "APP", "社区"], false),
  r("an025", "拷贝漫画", "在线漫画阅读", "https://www.copymanga.site", "video", "video-streaming", ["漫画", "在线", "中文"], false),
  r("an026", "动漫花园", "动漫资源分享论坛", "https://share.dmhy.org", "video", "video-community", ["动漫", "资源", "论坛"], true),
  r("an027", "萌番组", "动漫资源RSS", "https://mikanani.me", "video", "video-community", ["动漫", "RSS", "资源"], true),
  r("an028", "ACG.RIP", "ACG资源分享", "https://acg.rip", "video", "video-community", ["ACG", "资源", "分享"], false),
  r("an029", "AniDB", "动漫数据库", "https://anidb.net", "video", "video-community", ["动漫", "数据库", "详细"], true),
  r("an030", "Anime News Network", "动漫新闻权威", "https://www.animenewsnetwork.com", "news", "tech-news", ["动漫", "新闻", "权威"], false),
];

const liveTV = [
  r("lt001", "TVGarden", "全球在线直播电视", "https://tv.garden", "video", "video-streaming", ["直播", "电视", "全球"], true),
  r("lt002", "IPTV-ORG", "开源IPTV频道列表", "https://github.com/iptv-org/iptv", "video", "video-streaming", ["IPTV", "开源", "全球"], true),
  r("lt003", "LIVE555", "IPTV流媒体测试", "http://live555.com", "video", "video-tools", ["IPTV", "流媒体", "测试"], false),
  r("lt004", "CCTV官网", "中国中央电视台", "https://www.cctv.com", "video", "video-streaming", ["央视", "直播", "国内"], true),
  r("lt005", "央视频", "央视官方流媒体", "https://www.yangshipin.cn", "video", "video-streaming", ["央视", "流媒体", "官方"], true),
  r("lt006", "咪咕视频", "体育赛事直播", "https://www.miguvideo.com", "video", "video-streaming", ["体育", "直播", "移动"], false),
  r("lt007", "PP体育", "足球赛事直播", "https://www.ppsport.com", "video", "video-streaming", ["体育", "足球", "直播"], false),
  r("lt008", "Twitch", "游戏与创意直播", "https://www.twitch.tv", "video", "video-streaming", ["直播", "游戏", "全球"], true),
  r("lt009", "斗鱼", "国内游戏直播平台", "https://www.douyu.com", "video", "video-streaming", ["直播", "游戏", "国内"], true),
  r("lt010", "虎牙直播", "游戏娱乐直播", "https://www.huya.com", "video", "video-streaming", ["直播", "游戏", "国内"], true),
  r("lt011", "B站直播", "哔哩哔哩直播区", "https://live.bilibili.com", "video", "video-streaming", ["直播", "B站", "弹幕"], true),
  r("lt012", "抖音直播", "抖音直播平台", "https://live.douyin.com", "video", "video-streaming", ["直播", "抖音", "短视频"], false),
  r("lt013", "Kick", "新兴游戏直播平台", "https://kick.com", "video", "video-streaming", ["直播", "游戏", "新兴"], false),
  r("lt014", "Pluto TV", "免费广告支持流媒体", "https://pluto.tv", "video", "video-streaming", ["直播", "免费", "美国"], false),
  r("lt015", "XUMO", "免费流媒体直播", "https://www.xumo.com", "video", "video-streaming", ["直播", "免费", "美国"], false),
  r("lt016", "Tubi", "免费影视流媒体", "https://tubitv.com", "video", "video-streaming", ["影视", "免费", "美国"], true),
  r("lt017", "Crackle", "Sony免费流媒体", "https://www.crackle.com", "video", "video-streaming", ["影视", "免费", "Sony"], false),
  r("lt018", "Plex Live TV", "Plex免费直播频道", "https://www.plex.tv/live-tv", "video", "video-streaming", ["直播", "Plex", "免费"], false),
  r("lt019", "Simple Live", "多平台直播聚合", "https://github.com/xiaoyaocz/dart_simple_live", "video", "video-tools", ["直播", "聚合", "开源"], true),
  r("lt020", "纯粹直播", "多平台直播APP", "https://github.com/huangsg888/纯纯直播", "video", "video-tools", ["直播", "聚合", "Android"], false),
];

let total = 0;
total += writeResourceFile("streaming-video.ts", "streamingVideoResources", streamingVideo);
total += writeResourceFile("anime-manga.ts", "animeMangaResources", animeManga);
total += writeResourceFile("live-tv.ts", "liveTVResources", liveTV);
console.log(`Part2 合计: ${total}`);
