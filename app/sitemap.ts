import { categories } from "@/data/categories";
import { collections } from "@/data/collections";
import { resources } from "@/data/resources";
import { siteConfig } from "@/lib/site-config";
import { getAllTags, tagToSlug } from "@/lib/tags";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/favorites/",
    "/history/",
    "/collection/",
    "/weekly/",
    "/broken/",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryPages = categories.map((c) => ({
    url: `${base}/category/${c.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const collectionPages = collections.map((c) => ({
    url: `${base}/collection/${c.slug}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const resourcePages = resources.map((r) => ({
    url: `${base}/resource/${r.id}/`,
    lastModified: new Date(r.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const tagPages = getAllTags(resources).map((tag) => ({
    url: `${base}/tag/${tagToSlug(tag)}/`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...collectionPages,
    ...resourcePages,
    ...tagPages,
  ];
}
