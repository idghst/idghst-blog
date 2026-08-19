import readingTime from "reading-time";
import type { PostType } from "./site";

const API_BASE = (
  process.env.BLOG_API_URL?.trim() ||
  process.env.NEXT_PUBLIC_BLOG_API_URL?.trim() ||
  "https://api-blog.idghst.co.kr"
).replace(/\/$/, "");

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

type ApiPost = {
  slug: string;
  title: string;
  description: string;
  type: PostType;
  tags: string[];
  body: string;
  ticker?: string | null;
  cover?: string | null;
  draft: boolean;
  publishedAt?: string | null;
  updatedAt?: string;
};

function toPost(row: ApiPost): Post {
  const content = row.body ?? "";
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    type: row.type,
    tags: Array.isArray(row.tags) ? row.tags : [],
    publishedAt: row.publishedAt ?? "",
    updatedAt: row.updatedAt,
    ticker: row.ticker ?? undefined,
    cover: row.cover ?? undefined,
    draft: Boolean(row.draft),
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    url: `/posts/${row.slug}`,
    content,
  };
}

function strip(post: Post): PostMeta {
  const { content, ...meta } = post;
  void content;
  return meta;
}

async function apiGet<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Blog API ${res.status}`);
  }
  return (await res.json()) as T;
}

async function loadAll(): Promise<Post[]> {
  const data = await apiGet<{ items: ApiPost[] }>("/api/posts?limit=200");
  return (data?.items ?? []).map(toPost);
}

export async function getAllPosts(): Promise<PostMeta[]> {
  return (await loadAll()).map(strip);
}

export async function getPostsByType(type: PostType): Promise<PostMeta[]> {
  const data = await apiGet<{ items: ApiPost[] }>(
    `/api/posts?limit=200&type=${type}`,
  );
  return (data?.items ?? []).map((row) => strip(toPost(row)));
}

export async function getLatestPosts(limit = 6): Promise<PostMeta[]> {
  return (await getAllPosts()).slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const row = await apiGet<ApiPost>(`/api/posts/${encodeURIComponent(slug)}`);
  return row ? toPost(row) : null;
}

export async function getAllSlugs(): Promise<string[]> {
  return (await getAllPosts()).map((p) => p.slug);
}

export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const counts = new Map<string, number>();
  for (const post of await loadAll()) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "ko"));
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const lower = tag.toLowerCase();
  return (await getAllPosts()).filter((p) =>
    p.tags.some((t) => t.toLowerCase() === lower),
  );
}

export async function getRelatedPosts(
  post: PostMeta,
  limit = 3,
): Promise<PostMeta[]> {
  const others = (await getAllPosts()).filter((p) => p.slug !== post.slug);
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
