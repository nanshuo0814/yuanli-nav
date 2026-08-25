import { ResourceDetailClient } from "@/components/resource-detail";
import {
  getAllResourceIds,
  getResourceById,
} from "@/data/resources";
import { getCategoryName } from "@/data/categories";
import { siteConfig } from "@/lib/site-config";
import { getFaviconUrl } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return getAllResourceIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const resource = getResourceById(id);
  if (!resource) return { title: "资源未找到" };
  return {
    title: resource.title,
    description: resource.description,
    openGraph: {
      title: `${resource.title} | 源力导航`,
      description: resource.description,
      type: "website",
      url: `${siteConfig.siteUrl.replace(/\/$/, "")}/resource/${resource.id}/`,
      images: [
        {
          url: getFaviconUrl(resource.url),
          width: 128,
          height: 128,
          alt: resource.title,
        },
        { url: "/og-image.svg", width: 1200, height: 630, alt: "源力导航" },
      ],
    },
    keywords: [
      resource.title,
      ...resource.tags,
      getCategoryName(resource.category),
    ],
  };
}

export default async function ResourcePage({ params }: Props) {
  const { id } = await params;
  const resource = getResourceById(id);
  if (!resource) notFound();

  // 结构化数据利于 SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: resource.title,
    description: resource.description,
    url: resource.url,
    datePublished: resource.createdAt,
    keywords: resource.tags.join(","),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResourceDetailClient resource={resource} />
    </>
  );
}
