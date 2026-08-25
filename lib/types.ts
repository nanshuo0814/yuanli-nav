/** 资源数据类型定义 */
export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  subCategory: string;
  tags: string[];
  cover?: string;
  isRecommended: boolean;
  createdAt: string;
  /** 是否免费（推断或手动标记） */
  isFree?: boolean;
  /** 是否开源 */
  isOpenSource?: boolean;
  /** 地区：cn 国内 / global 全球 / both */
  region?: "cn" | "global" | "both";
  /** 链接失效标记（由 check-links 脚本写入） */
  isBroken?: boolean;
}

/** 分类定义 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

/** 主题模式 */
export type ThemeMode = "light" | "dark" | "system";

/** 搜索高亮片段 */
export interface SearchResult extends Resource {
  matchedFields: ("title" | "description" | "tags")[];
  score?: number;
}

/** 收藏分组 */
export interface FavoriteFolder {
  id: string;
  name: string;
  resourceIds: string[];
  createdAt: string;
}

/** 多维筛选条件 */
export interface DimensionFilters {
  isFree?: boolean;
  isOpenSource?: boolean;
  region?: "cn" | "global" | "both";
  onlyAvailable?: boolean;
}

/** 编辑精选 / 专题合集 */
export interface Collection {
  slug: string;
  title: string;
  description: string;
  /** 手动指定资源 ID（优先） */
  resourceIds?: string[];
  /** 自动筛选规则 */
  filter?: {
    category?: string;
    tags?: string[];
    isRecommended?: boolean;
    isFree?: boolean;
    isOpenSource?: boolean;
    region?: "cn" | "global" | "both";
    limit?: number;
  };
}
