import { CollectionPageClient } from "@/components/collection-page";
import {
  getAllCollectionSlugs,
  getCollectionBySlug,
} from "@/data/collections";
import { resources } from "@/data/resources";
import { resolveCollectionResources } from "@/lib/collections";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCollectionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "专题未找到" };
  return {
    title: collection.title,
    description: collection.description,
    openGraph: {
      title: `${collection.title} | 源力导航`,
      description: collection.description,
    },
  };
}

export default async function CollectionSlugPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const items = resolveCollectionResources(collection, resources);

  return <CollectionPageClient collection={collection} items={items} />;
}
