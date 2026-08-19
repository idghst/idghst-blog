import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const posts = await getAllPosts();
  const tags = await getAllTags();

  const staticRoutes = [
    "/",
    "/guide",
    "/news",
    "/stock",
    "/about",
    "/disclaimer",
    "/privacy",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const postRoutes = posts.map((post) => ({
    url: absoluteUrl(post.url),
    lastModified: new Date(post.updatedAt ?? post.publishedAt ?? now),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const tagRoutes = tags.map(({ tag }) => ({
    url: absoluteUrl(`/tags/${encodeURIComponent(tag)}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
