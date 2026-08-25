import { TagPageClient } from "@/components/tag-page";
import { resources } from "@/data/resources";
import {
  getAllTags,
  getResourcesByTag,
  getTagStats,
  slugToTag,
  tagToSlug,
} from "@/lib/tags";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTags(resources).map((tag) => ({ tag: tagToSlug(tag) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: slug } = await params;
  const tag = slugToTag(slug);
  return {
    title: `#${tag}`,
    description: `源力导航 · ${tag} 标签下的优质资源`,
    openGraph: {
      title: `#${tag} | 源力导航`,
      description: `${tag} 相关资源合集`,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag: slug } = await params;
  const tag = slugToTag(slug);
  const items = getResourcesByTag(resources, tag);
  if (items.length === 0) notFound();

  const relatedTags = getTagStats(resources)
    .filter((t) => t.tag !== tag)
    .slice(0, 12);

  return <TagPageClient tag={tag} items={items} relatedTags={relatedTags} />;
}
