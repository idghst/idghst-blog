import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByType } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { typeMeta } from "@/lib/site";
import type { PostType } from "@/lib/site";

const TYPES: PostType[] = ["guide", "news", "stock"];

export const dynamicParams = false;

export function generateStaticParams() {
  return TYPES.map((type) => ({ type }));
}

function isPostType(value: string): value is PostType {
  return (TYPES as string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  if (!isPostType(type)) return {};
  const meta = typeMeta[type];
  return {
    title: `${meta.label} 모아보기`,
    description: meta.blurb,
    alternates: { canonical: `/${type}` },
  };
}

export default async function TypeListPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!isPostType(type)) notFound();

  const meta = typeMeta[type];
  const posts = await getPostsByType(type);

  return (
    <div className="wrap-narrow py-12 sm:py-20">
      <header className="border-b pb-10">
        <p className="eyebrow text-[var(--color-brand)]">
          {meta.label}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-none sm:text-6xl">
          {meta.label} 모아보기
        </h1>
        <p className="mt-3 text-lg text-[var(--color-ink-soft)]">{meta.blurb}</p>
      </header>

      <div className="mt-4">
        {posts.length ? (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p className="py-10 text-[var(--color-ink-soft)]">
            아직 발행된 글이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
