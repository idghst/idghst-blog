import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `'${decoded}' 태그가 붙은 글 모음`,
    alternates: { canonical: `/tags/${encodeURIComponent(decoded)}` },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded);
  if (!posts.length) notFound();

  return (
    <div className="wrap-narrow py-12 sm:py-20">
      <header className="border-b pb-10">
        <p className="eyebrow text-[var(--color-brand)]">
          태그
        </p>
        <h1 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
          #{decoded}
        </h1>
        <p className="mt-3 text-[var(--color-ink-soft)]">
          {posts.length}개의 글
        </p>
      </header>
      <div className="mt-4">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
