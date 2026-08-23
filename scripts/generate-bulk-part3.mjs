/**
 * 批量资源生成 Part3: 音乐/电子书/游戏
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../data/resources");

function r(id, title, description, url, category, subCategory, tags, isRecommended = false, createdAt = "2024-07-15") {
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

const musicExtra = [
  r("mx001", "MusicFree", "开源免费全网听歌神器", "https://github.com/maotoumao/MusicFree", "music", "music-tools", ["音乐", "开源", "免费"], true),
  r("mx002", "洛雪音乐", "跨平台音乐播放器", "https://github.com/lyswhut/lx-music-desktop", "music", "music-tools", ["音乐", "开源", "跨平台"], true),
  r("mx003", "SPlayer", "网易云第三方播放器", "https://github.com/imsyy/SPlayer", "music", "music-tools", ["音乐", "网易云", "开源"], true),
  r("mx004", "YesPlayMusic", "高颜值网易云播放器", "https://github.com/qier222/YesPlayMusic", "music", "music-tools", ["音乐", "网易云", "高颜值"], true),
  r("mx005", "Alger Music", "网易云第三方播放器", "https://github.com/algerkong/AlgerMusicPlayer", "music", "music-tools", ["音乐", "网易云", "Electron"], false),
  r("mx006", "Listen1", "多平台音乐聚合播放", "https://listen1.github.io/listen1", "music", "music-tools", ["音乐", "聚合", "开源"], true),
  r("mx007", "Meting API", "开源音乐API接口", "https://github.com/metowolf/Meting", "music", "music-tools", ["音乐", "API", "开源"], false),
  r("mx008", "TuneMyMusic", "歌单跨平台迁移", "https://www.tunemymusic.com", "music", "music-tools", ["音乐", "歌单", "迁移"], true),
  r("mx009", "Soundiiz", "音乐歌单同步工具", "https://soundiiz.com", "music", "music-tools", ["音乐", "同步", "歌单"], false),
  r("mx010", "Musixmatch", "全球最大歌词数据库", "https://www.musixmatch.com", "music", "music-community", ["歌词", "数据库", "全球"], true),
  r("mx011", "Genius Lyrics", "歌词注解社区", "https://genius.com", "music", "music-community", ["歌词", "注解", "社区"], true),
  r("mx012", "AZLyrics", "歌词搜索网站", "https://www.azlyrics.com", "music", "music-community", ["歌词", "搜索", "英文"], false),
  r("mx013", "网易云音乐", "国内最大音乐平台", "https://music.163.com", "music", "streaming", ["音乐", "国内", "流媒体"], true),
  r("mx014", "咪咕音乐", "中国移动音乐平台", "https://music.migu.cn", "music", "streaming", ["音乐", "国内", "移动"], false),
  r("mx015", "5sing", "原创音乐基地", "https://5sing.kugou.com", "music", "music-community", ["音乐", "原创", "UGC"], false),
  r("mx016", "Beatport", "电子音乐下载", "https://www.beatport.com", "music", "streaming", ["电子", "DJ", "下载"], true),
  r("mx017", "Mixcloud", "DJ混音与电台", "https://www.mixcloud.com", "music", "streaming", ["DJ", "混音", "电台"], false),
  r("mx018", "Radio Garden", "全球电台地图", "https://radio.garden", "music", "streaming", ["电台", "全球", "地图"], true),
  r("mx019", "TuneIn", "全球电台与播客", "https://tunein.com", "music", "streaming", ["电台", "播客", "全球"], false),
  r("mx020", "Internet Archive Audio", "互联网档案馆音频", "https://archive.org/details/audio", "music", "streaming", ["音频", "档案", "免费"], true),
  r("mx021", "Free Music Archive", "免费音乐档案库", "https://freemusicarchive.org", "music", "streaming", ["音乐", "免费", "CC"], true),
  r("mx022", "Jamendo", "独立音乐CC授权", "https://www.jamendo.com", "music", "streaming", ["音乐", "独立", "CC"], false),
  r("mx023", "ccMixter", "Remix社区", "https://ccmixter.org", "music", "music-community", ["Remix", "CC", "社区"], false),
  r("mx024", "Incompetech", "Kevin MacLeod免费BGM", "https://incompetech.com", "music", "music-tools", ["BGM", "免费", "授权"], true),
  r("mx025", "Purple Planet", "免费背景音乐", "https://www.purple-planet.com", "music", "music-tools", ["BGM", "免费", "视频"], false),
  r("mx026", "Bensound", "免费音乐素材", "https://www.bensound.com", "music", "music-tools", ["BGM", "免费", "素材"], false),
  r("mx027", "Audionautix", "免费音乐下载", "https://audionautix.com", "music", "music-tools", ["BGM", "免费", "下载"], false),
  r("mx028", "Chordify", "自动和弦识别", "https://chordify.net", "music", "music-tools", ["和弦", "识别", "吉他"], true),
  r("mx029", "Hooktheory", "和弦进行数据库", "https://www.hooktheory.com", "music", "music-tools", ["和弦", "理论", "数据库"], false),
  r("mx030", "SongBPM", "歌曲BPM查询", "https://songbpm.com", "music", "music-tools", ["BPM", "查询", "DJ"], false),
  r("mx031", "WhoSampled", "采样来源数据库", "https://www.whosampled.com", "music", "music-community", ["采样", "Hip-Hop", "数据库"], true),
  r("mx032", "MusicBrainz", "开放音乐百科全书", "https://musicbrainz.org", "music", "music-community", ["音乐", "数据库", "开放"], true),
  r("mx033", "AcoustID", "音频指纹识别", "https://acoustid.org", "music", "music-tools", ["指纹", "识别", "开源"], false),
  r("mx034", "Shazam", "听歌识曲", "https://www.shazam.com", "music", "music-tools", ["识曲", "Apple", "AI"], true),
  r("mx035", "Midomi", "哼唱识曲", "https://www.midomi.com", "music", "music-tools", ["识曲", "哼唱", "搜索"], false),
  r("mx036", "Vocal Remover", "AI人声分离", "https://vocalremover.org", "music", "music-tools", ["AI", "人声", "分离"], true),
  r("mx037", "LALAL.AI", "AI音轨分离", "https://www.lalal.ai", "music", "music-tools", ["AI", "分离", "音轨"], true),
  r("mx038", "Moises", "AI音乐练习工具", "https://moises.ai", "music", "music-tools", ["AI", "练习", "分离"], false),
  r("mx039", "Spleeter", "Deezer开源人声分离", "https://github.com/deezer/spleeter", "music", "music-tools", ["AI", "开源", "分离"], true),
  r("mx040", "Ultimate Guitar", "吉他谱最大社区", "https://www.ultimate-guitar.com", "music", "music-community", ["吉他", "谱子", "社区"], true),
];

const ebookExtra = [
  r("eb001", "Z-Library", "全球最大免费电子图书馆", "https://z-lib.gd", "education", "academic", ["电子书", "免费", "图书馆"], true),
  r("eb002", "Anna's Archive", "最大开放数据图书馆", "https://annas-archive.org", "education", "academic", ["电子书", "开放", "镜像"], true),
  r("eb003", "Library Genesis", "学术书籍搜索引擎", "https://libgen.is", "education", "academic", ["电子书", "学术", "搜索"], true),
  r("eb004", "Sci-Hub", "学术论文免费获取", "https://sci-hub.se", "education", "academic", ["论文", "免费", "学术"], true),
  r("eb005", "Project Gutenberg", "公版书免费电子书", "https://www.gutenberg.org", "education", "academic", ["电子书", "公版", "免费"], true),
  r("eb006", "Open Library", "Internet Archive开放图书馆", "https://openlibrary.org", "education", "academic", ["电子书", "借阅", "开放"], true),
  r("eb007", "Standard Ebooks", "精美排版公版书", "https://standardebooks.org", "education", "academic", ["电子书", "公版", "精美"], true),
  r("eb008", "ManyBooks", "免费电子书下载", "https://manybooks.net", "education", "academic", ["电子书", "免费", "下载"], false),
  r("eb009", "Feedbooks", "公版与原创电子书", "https://www.feedbooks.com", "education", "academic", ["电子书", "公版", "原创"], false),
  r("eb010", "鸠摩搜索", "电子书文档搜索引擎", "https://www.jiumodiary.com", "education", "academic", ["电子书", "搜索", "中文"], true),
  r("eb011", "书格", "自由开放古籍图书馆", "https://new.shuge.org", "education", "academic", ["古籍", "开放", "中文"], true),
  r("eb012", "识典古籍", "古籍在线阅读", "https://www.shidianguji.com", "education", "academic", ["古籍", "阅读", "中文"], true),
  r("eb013", "National Library of China", "中国国家图书馆", "https://www.nlc.cn", "education", "academic", ["图书馆", "国家", "中文"], true),
  r("eb014", "Internet Archive Texts", "互联网档案馆文本", "https://archive.org/details/texts", "education", "academic", ["电子书", "档案", "免费"], true),
  r("eb015", "HathiTrust", "学术数字图书馆", "https://www.hathitrust.org", "education", "academic", ["学术", "图书馆", "数字"], false),
  r("eb016", "DOAB", "开放获取图书目录", "https://www.doabooks.org", "education", "academic", ["开放", "学术", "图书"], false),
  r("eb017", "OAPEN", "开放获取出版", "https://www.oapen.org", "education", "academic", ["开放", "出版", "学术"], false),
  r("eb018", "Calibre", "电子书管理转换神器", "https://calibre-ebook.com", "software", "productivity", ["电子书", "管理", "转换"], true),
  r("eb019", "Calibre Web", "Calibre Web界面", "https://github.com/janeczku/calibre-web", "software", "productivity", ["电子书", "Web", "自托管"], true),
  r("eb020", "KOReader", "开源电子书阅读器", "https://koreader.rocks", "software", "productivity", ["电子书", "阅读", "开源"], true),
  r("eb021", "Readwise", "阅读高亮同步", "https://readwise.io", "software", "productivity", ["阅读", "高亮", "同步"], false),
  r("eb022", "Instapaper", "稍后阅读服务", "https://www.instapaper.com", "software", "productivity", ["阅读", "稍后", "收藏"], false),
  r("eb023", "Pocket", "Mozilla稍后阅读", "https://getpocket.com", "software", "productivity", ["阅读", "稍后", "Mozilla"], true),
  r("eb024", "Medium", "优质文章发布平台", "https://medium.com", "news", "community", ["文章", "写作", "社区"], true),
  r("eb025", "Substack", "Newsletter写作平台", "https://substack.com", "news", "community", ["Newsletter", "写作", "订阅"], true),
  r("eb026", "微信读书", "腾讯社交阅读App", "https://weread.qq.com", "education", "courses", ["阅读", "社交", "腾讯"], true),
  r("eb027", "豆瓣阅读", "原创电子书平台", "https://read.douban.com", "education", "courses", ["阅读", "原创", "豆瓣"], false),
  r("eb028", "起点中文网", "网络文学最大平台", "https://www.qidian.com", "education", "courses", ["小说", "网文", "中文"], true),
  r("eb029", "晋江文学城", "女性向网络文学", "https://www.jjwxc.net", "education", "courses", ["小说", "网文", "女性"], false),
  r("eb030", "Wattpad", "全球最大故事社区", "https://www.wattpad.com", "education", "courses", ["小说", "社区", "全球"], false),
  r("eb031", "Royal Road", "Web小说平台", "https://www.royalroad.com", "education", "courses", ["小说", "Web", "奇幻"], false),
  r("eb032", "Archive of Our Own", "同人小说档案", "https://archiveofourown.org", "education", "courses", ["同人", "小说", "社区"], true),
  r("eb033", "FanFiction.net", "最大同人小说站", "https://www.fanfiction.net", "education", "courses", ["同人", "小说", "全球"], false),
  r("eb034", "Goodreads", "全球最大读书社区", "https://www.goodreads.com", "education", "courses", ["读书", "社区", "评分"], true),
  r("eb035", "StoryGraph", "Goodreads替代", "https://app.thestorygraph.com", "education", "courses", ["读书", "追踪", "推荐"], false),
  r("eb036", "Libby", "图书馆电子书借阅", "https://libbyapp.com", "education", "courses", ["电子书", "借阅", "图书馆"], true),
  r("eb037", "OverDrive", "图书馆数字借阅", "https://www.overdrive.com", "education", "courses", ["电子书", "借阅", "全球"], false),
  r("eb038", "Audible", "Amazon有声书", "https://www.audible.com", "education", "courses", ["有声书", "Amazon", "订阅"], true),
  r("eb039", "喜马拉雅", "国内最大有声平台", "https://www.ximalaya.com", "education", "courses", ["有声", "播客", "国内"], true),
  r("eb040", "懒人听书", "有声书听书平台", "https://www.lrts.me", "education", "courses", ["有声书", "听书", "国内"], false),
];

const gameExtra = [
  r("gm001", "Steam", "全球最大PC游戏平台", "https://store.steampowered.com", "software", "productivity", ["游戏", "Steam", "PC"], true),
  r("gm002", "Epic Games Store", "Epic游戏商店每周免费", "https://store.epicgames.com", "software", "productivity", ["游戏", "Epic", "免费"], true),
  r("gm003", "GOG", "无DRM经典游戏", "https://www.gog.com", "software", "productivity", ["游戏", "DRM-free", "经典"], true),
  r("gm004", "itch.io", "独立游戏平台", "https://itch.io", "software", "productivity", ["游戏", "独立", "创作"], true),
  r("gm005", "Humble Bundle", "游戏慈善捆绑包", "https://www.humblebundle.com", "software", "productivity", ["游戏", "慈善", "折扣"], true),
  r("gm006", "Fanatical", "游戏折扣平台", "https://www.fanatical.com", "software", "productivity", ["游戏", "折扣", "Key"], false),
  r("gm007", "Green Man Gaming", "游戏Key折扣", "https://www.greenmangaming.com", "software", "productivity", ["游戏", "折扣", "Key"], false),
  r("gm008", "IsThereAnyDeal", "游戏价格历史追踪", "https://isthereanydeal.com", "software", "productivity", ["游戏", "比价", "历史"], true),
  r("gm009", "CheapShark", "游戏Deal聚合", "https://www.cheapshark.com", "software", "productivity", ["游戏", "Deal", "聚合"], true),
  r("gm010", "SteamDB", "Steam数据库与统计", "https://steamdb.info", "software", "productivity", ["Steam", "数据库", "统计"], true),
  r("gm011", "ProtonDB", "Linux/Steam Deck兼容性", "https://www.protondb.com", "software", "productivity", ["Steam", "Linux", "兼容"], true),
  r("gm012", "PCGamingWiki", "PC游戏优化Wiki", "https://www.pcgamingwiki.com", "software", "productivity", ["PC", "优化", "Wiki"], true),
  r("gm013", "HowLongToBeat", "游戏通关时长统计", "https://howlongtobeat.com", "software", "productivity", ["游戏", "时长", "统计"], true),
  r("gm014", "Backloggd", "游戏收藏追踪", "https://www.backloggd.com", "software", "productivity", ["游戏", "追踪", "收藏"], false),
  r("gm015", "RAWG", "游戏数据库API", "https://rawg.io", "software", "productivity", ["游戏", "数据库", "API"], true),
  r("gm016", "IGDB", "Twitch游戏数据库", "https://www.igdb.com", "software", "productivity", ["游戏", "数据库", "Twitch"], false),
  r("gm017", "Metacritic Games", "游戏评分聚合", "https://www.metacritic.com/game", "software", "productivity", ["游戏", "评分", "聚合"], true),
  r("gm018", "OpenCritic", "游戏评论聚合", "https://opencritic.com", "software", "productivity", ["游戏", "评论", "聚合"], false),
  r("gm019", "Nintendo eShop", "任天堂游戏商店", "https://www.nintendo.com/store", "software", "productivity", ["游戏", "任天堂", "Switch"], true),
  r("gm020", "PlayStation Store", "索尼游戏商店", "https://store.playstation.com", "software", "productivity", ["游戏", "PlayStation", "索尼"], true),
  r("gm021", "Xbox Store", "微软游戏商店", "https://www.xbox.com/games/store", "software", "productivity", ["游戏", "Xbox", "微软"], true),
  r("gm022", "RetroArch", "开源复古游戏模拟器", "https://www.retroarch.com", "software", "system-tools", ["模拟器", "复古", "开源"], true),
  r("gm023", "EmulatorGames", "在线复古游戏", "https://www.emulatorgames.net", "software", "system-tools", ["模拟器", "在线", "复古"], false),
  r("gm024", "PlayRetroGames", "在线复古游戏", "https://www.playretrogames.net", "software", "system-tools", ["模拟器", "在线", "复古"], false),
  r("gm025", "CrazyGames", "免费在线小游戏", "https://www.crazygames.com", "software", "productivity", ["游戏", "在线", "免费"], true),
  r("gm026", "Poki", "免费在线游戏", "https://poki.com", "software", "productivity", ["游戏", "在线", "免费"], true),
  r("gm027", "Kongregate", "Flash游戏社区", "https://www.kongregate.com", "software", "productivity", ["游戏", "Flash", "社区"], false),
  r("gm028", "Newgrounds", "独立Flash/游戏社区", "https://www.newgrounds.com", "software", "productivity", ["游戏", "独立", "Flash"], true),
  r("gm029", "Roblox", "UGC游戏创作平台", "https://www.roblox.com", "software", "productivity", ["游戏", "UGC", "创作"], true),
  r("gm030", "Minecraft", "全球最大沙盒游戏", "https://www.minecraft.net", "software", "productivity", ["游戏", "沙盒", "微软"], true),
  r("gm031", "Modrinth", "Minecraft Mod平台", "https://modrinth.com", "software", "productivity", ["Minecraft", "Mod", "开源"], true),
  r("gm032", "CurseForge", "游戏Mod最大平台", "https://www.curseforge.com", "software", "productivity", ["Mod", "游戏", "社区"], true),
  r("gm033", "Nexus Mods", "PC游戏Mod社区", "https://www.nexusmods.com", "software", "productivity", ["Mod", "PC", "社区"], true),
  r("gm034", "Speedrun.com", "速通社区与排行榜", "https://www.speedrun.com", "software", "productivity", ["速通", "社区", "排行"], true),
  r("gm035", "TASVideos", "工具辅助速通", "https://tasvideos.org", "software", "productivity", ["速通", "TAS", "工具"], false),
  r("gm036", "GameFAQs", "游戏攻略问答", "https://gamefaqs.gamespot.com", "software", "productivity", ["攻略", "游戏", "问答"], true),
  r("gm037", "IGN", "游戏媒体与评测", "https://www.ign.com", "news", "tech-news", ["游戏", "评测", "媒体"], true),
  r("gm038", "GameSpot", "游戏新闻与评测", "https://www.gamespot.com", "news", "tech-news", ["游戏", "新闻", "评测"], false),
  r("gm039", "Polygon", "游戏与文化媒体", "https://www.polygon.com", "news", "tech-news", ["游戏", "文化", "媒体"], false),
  r("gm040", "游民星空", "国内游戏媒体", "https://www.gamersky.com", "news", "tech-news", ["游戏", "国内", "媒体"], true),
];

let total = 0;
total += writeResourceFile("music-extra.ts", "musicExtraResources", musicExtra);
total += writeResourceFile("ebook-extra.ts", "ebookExtraResources", ebookExtra);
total += writeResourceFile("game-extra.ts", "gameExtraResources", gameExtra);
console.log(`Part3 合计: ${total}`);
