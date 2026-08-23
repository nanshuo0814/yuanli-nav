import { Category } from "@/lib/types";

/** 全站分类配置：一级 + 二级分类 */
export const categories: Category[] = [
  {
    id: "programming",
    name: "编程",
    slug: "programming",
    icon: "Code2",
    description: "前端、后端、开发工具与学习资源",
    subCategories: [
      { id: "frontend", name: "前端开发", slug: "frontend" },
      { id: "backend", name: "后端开发", slug: "backend" },
      { id: "dev-tools", name: "开发工具", slug: "dev-tools" },
      { id: "dev-learning", name: "编程学习", slug: "dev-learning" },
    ],
  },
  {
    id: "ai",
    name: "AI",
    slug: "ai",
    icon: "Sparkles",
    description: "AI 工具、模型平台与学习资源",
    subCategories: [
      { id: "ai-tools", name: "AI 工具", slug: "ai-tools" },
      { id: "ai-models", name: "模型平台", slug: "ai-models" },
      { id: "ai-platforms", name: "AI 平台", slug: "ai-platforms" },
      { id: "ai-learning", name: "AI 学习", slug: "ai-learning" },
    ],
  },
  {
    id: "music",
    name: "音乐",
    slug: "music",
    icon: "Music",
    description: "音乐流媒体、创作工具与社区",
    subCategories: [
      { id: "streaming", name: "音乐流媒体", slug: "streaming" },
      { id: "music-tools", name: "音乐工具", slug: "music-tools" },
      { id: "music-community", name: "音乐社区", slug: "music-community" },
    ],
  },
  {
    id: "video",
    name: "影视",
    slug: "video",
    icon: "Film",
    description: "视频平台、影视资源与创作工具",
    subCategories: [
      { id: "video-streaming", name: "视频平台", slug: "video-streaming" },
      { id: "video-tools", name: "影视工具", slug: "video-tools" },
      { id: "video-community", name: "影视社区", slug: "video-community" },
    ],
  },
  {
    id: "software",
    name: "软件",
    slug: "software",
    icon: "Package",
    description: "效率、设计与系统工具软件",
    subCategories: [
      { id: "productivity", name: "效率工具", slug: "productivity" },
      { id: "design-soft", name: "设计软件", slug: "design-soft" },
      { id: "system-tools", name: "系统工具", slug: "system-tools" },
    ],
  },
  {
    id: "life",
    name: "生活",
    slug: "life",
    icon: "Heart",
    description: "购物、旅行、健康与理财",
    subCategories: [
      { id: "shopping", name: "购物消费", slug: "shopping" },
      { id: "travel", name: "旅行出行", slug: "travel" },
      { id: "health", name: "健康生活", slug: "health" },
      { id: "finance", name: "理财金融", slug: "finance" },
    ],
  },
  {
    id: "design",
    name: "设计",
    slug: "design",
    icon: "Palette",
    description: "设计灵感、工具与素材资源",
    subCategories: [
      { id: "inspiration", name: "设计灵感", slug: "inspiration" },
      { id: "design-tools", name: "设计工具", slug: "design-tools" },
      { id: "design-resources", name: "设计素材", slug: "design-resources" },
    ],
  },
  {
    id: "education",
    name: "学习",
    slug: "education",
    icon: "GraduationCap",
    description: "在线课程、语言学习与学术资源",
    subCategories: [
      { id: "courses", name: "在线课程", slug: "courses" },
      { id: "language", name: "语言学习", slug: "language" },
      { id: "academic", name: "学术资源", slug: "academic" },
    ],
  },
  {
    id: "news",
    name: "热点",
    slug: "news",
    icon: "Newspaper",
    description: "科技、综合资讯与社区热点",
    subCategories: [
      { id: "tech-news", name: "科技资讯", slug: "tech-news" },
      { id: "general-news", name: "综合资讯", slug: "general-news" },
      { id: "community", name: "社区热点", slug: "community" },
    ],
  },
  {
    id: "tools",
    name: "工具",
    slug: "tools",
    icon: "Wrench",
    description: "在线工具、转换器与开发者实用工具",
    subCategories: [
      { id: "online-tools", name: "在线工具", slug: "online-tools" },
      { id: "converter", name: "格式转换", slug: "converter" },
      { id: "dev-utils", name: "开发实用", slug: "dev-utils" },
    ],
  },
];

/** 根据 slug 获取分类 */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** 获取所有标签（去重） */
export function getAllTags(resources: { tags: string[] }[]): string[] {
  const tagSet = new Set<string>();
  resources.forEach((r) => r.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

/** 获取分类名称 */
export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug;
}

/** 获取子分类名称 */
export function getSubCategoryName(
  categorySlug: string,
  subCategorySlug: string
): string {
  const cat = getCategoryBySlug(categorySlug);
  return cat?.subCategories.find((s) => s.slug === subCategorySlug)?.name ?? subCategorySlug;
}
