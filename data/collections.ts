import { Collection } from "@/lib/types";

/** 编辑精选 / 专题合集 */
export const collections: Collection[] = [
  {
    slug: "frontend-starter",
    title: "前端入门包",
    description:
      "文档、框架、工具链与社区，适合前端新手和日常查阅的精选起点。",
    resourceIds: [
      "p001",
      "p002",
      "p003",
      "p004",
      "p005",
      "p006",
      "p007",
      "p008",
      "p009",
      "p010",
      "p011",
      "p012",
    ],
  },
  {
    slug: "free-streaming",
    title: "免费影视导航",
    description: "聚合免费影视、直播、动漫相关资源，仅供学习交流。",
    filter: {
      category: "video",
      tags: ["免费", "影视"],
      isFree: true,
      limit: 24,
    },
  },
  {
    slug: "open-source-alternatives",
    title: "开源替代清单",
    description: "GitHub 开源项目与可自托管的免费替代方案。",
    filter: {
      isOpenSource: true,
      isRecommended: true,
      limit: 20,
    },
  },
  {
    slug: "ai-toolbox",
    title: "AI 工具箱",
    description: "大模型、AI 编程、图像生成与 AI 学习资源一站汇总。",
    filter: {
      category: "ai",
      isRecommended: true,
      limit: 24,
    },
  },
  {
    slug: "design-inspiration",
    title: "设计灵感站",
    description: "UI 灵感、设计工具与素材资源，提升审美与效率。",
    filter: {
      category: "design",
      limit: 20,
    },
  },
  {
    slug: "dev-productivity",
    title: "开发者效率",
    description: "在线工具、转换器、开发辅助与效率提升站点。",
    filter: {
      category: "tools",
      isRecommended: true,
      limit: 20,
    },
  },
  {
    slug: "nav-sites",
    title: "优质导航站",
    description: "收录其他优质资源导航与 Awesome 列表，扩展你的发现半径。",
    filter: {
      tags: ["导航"],
      limit: 16,
    },
  },
  {
    slug: "cn-friendly",
    title: "国内友好",
    description: "访问体验更适合国内用户的工具与站点。",
    filter: {
      region: "cn",
      isRecommended: true,
      limit: 20,
    },
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getAllCollectionSlugs(): string[] {
  return collections.map((c) => c.slug);
}
