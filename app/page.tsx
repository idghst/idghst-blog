import Link from "next/link";
import { getLatestPosts, getPostsByType } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { siteConfig, typeMeta } from "@/lib/site";
import type { PostType } from "@/lib/site";

export default function HomePage() {
  const latest = getLatestPosts(5);
  const [featured, ...rest] = latest;
  const types: PostType[] = ["guide", "news", "stock"];

  return (
    <div className="wrap py-10 sm:py-14">
      <section className="border-b pb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-brand)]">
          금융 · 재테크 · 주식
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight tracking-tight sm:text-5xl">
          복잡한 돈 이야기를,
          <br />
          담백하게 읽는 곳
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-ink-soft)]">
          {siteConfig.description}
        </p>
      </section>

      <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="font-display text-2xl">최신 글</h2>
          <div className="mt-2">
            {featured ? <PostCard post={featured} featured /> : null}
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
            {latest.length === 0 ? (
              <p className="py-10 text-[var(--color-ink-soft)]">
                아직 발행된 글이 없습니다.
              </p>
            ) : null}
          </div>
        </div>

        <aside className="space-y-8">
          {types.map((type) => {
            const posts = getPostsByType(type).slice(0, 3);
            if (!posts.length) return null;
            return (
              <section key={type}>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl">
                    {typeMeta[type].label}
                  </h3>
                  <Link
                    href={`/${type}`}
                    className="text-sm text-[var(--color-brand)] hover:underline"
                  >
                    전체 →
                  </Link>
                </div>
                <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                  {typeMeta[type].blurb}
                </p>
                <ul className="mt-3 space-y-3">
                  {posts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={post.url}
                        className="text-[15px] leading-snug hover:text-[var(--color-brand)]"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
