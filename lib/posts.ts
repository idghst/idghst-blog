import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostType } from "./site";

const CONTENT_DIR = path.join(process.cwd(), "content");
const POST_TYPES: PostType[] = ["guide", "news", "stock"];

export type PostFrontmatter = {
  slug: string;
  title: string;
  description: string;
  type: PostType;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  ticker?: string;
  cover?: string;
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & {
  readingMinutes: number;
  url: string;
};

export type Post = PostMeta & {
  content: string;
};

function readTypeDir(type: PostType): Post[] {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const slug = String(data.slug ?? file.replace(/\.mdx?$/, ""));

      const fm: PostFrontmatter = {
        slug,
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        type,
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        publishedAt: String(data.publishedAt ?? ""),
        updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
        ticker: data.ticker ? String(data.ticker) : undefined,
        cover: data.cover ? String(data.cover) : undefined,
        draft: Boolean(data.draft ?? false),
      };

      return {
        ...fm,
        readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
        url: `/posts/${slug}`,
        content,
      };
    });
}

let cache: Post[] | null = null;

function loadAll(): Post[] {
  if (cache) return cache;
  const isProd = process.env.NODE_ENV === "production";
  const posts = POST_TYPES.flatMap(readTypeDir)
    .filter((p) => !(isProd && p.draft))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  cache = posts;
  return posts;
}

function strip(post: Post): PostMeta {
  const { content, ...meta } = post;
  void content;
  return meta;
}

export function getAllPosts(): PostMeta[] {
  return loadAll().map(strip);
}

export function getPostsByType(type: PostType): PostMeta[] {
  return loadAll()
    .filter((p) => p.type === type)
    .map(strip);
}

export function getLatestPosts(limit = 6): PostMeta[] {
  return getAllPosts().slice(0, limit);
}

export function getPostBySlug(slug: string): Post | null {
  return loadAll().find((p) => p.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return loadAll().map((p) => p.slug);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of loadAll()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "ko"));
}

export function getPostsByTag(tag: string): PostMeta[] {
  const lower = tag.toLowerCase();
  return getAllPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === lower),
  );
}

export function getRelatedPosts(post: PostMeta, limit = 3): PostMeta[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const scored = others.map((p) => {
    let score = p.type === post.type ? 1 : 0;
    score += p.tags.filter((t) => post.tags.includes(t)).length * 2;
    return { p, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.p);
}

export function formatDate(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}
