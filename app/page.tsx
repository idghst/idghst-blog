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
    <div>
      <section className="hero-grid flex min-h-[34rem] items-end border-b sm:min-h-[42rem]">
        <div className="wrap pb-16 pt-28 sm:pb-24">
          <div className="hero-reveal">
            <p className="eyebrow text-[var(--color-brand)]">
              Finance · Market · Equity
            </p>
            <h1 className="mt-5 max-w-5xl font-display text-5xl leading-[0.98] tracking-[-0.045em] sm:text-7xl lg:text-[5.5rem]">
              복잡한 돈 이야기를,
              <br />
              <span className="text-[var(--color-ink-soft)]">
                선명하게 읽는 곳
              </span>
            </h1>
            <div className="mt-8 flex max-w-3xl flex-col gap-8 border-l border-[var(--color-brand)] pl-5 sm:flex-row sm:items-end sm:justify-between sm:pl-8">
              <p className="max-w-xl text-base leading-7 text-[var(--color-ink-soft)] sm:text-lg">
                {siteConfig.description}
              </p>
              {featured ? (
                <Link href={featured.url} className="editorial-link shrink-0">
                  최신 글 읽기
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="wrap grid gap-16 py-16 sm:py-24 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
        <div>
          <div className="flex items-end justify-between border-b pb-5">
            <div>
              <p className="eyebrow text-[var(--color-brand)]">Latest</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl">최신 글</h2>
            </div>
            <span className="font-mono text-xs text-[var(--color-ink-soft)]">
              {String(latest.length).padStart(2, "0")}
            </span>
          </div>
          <div>
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

        <aside className="space-y-12 lg:border-l lg:pl-10">
          <div className="border-b pb-5">
            <p className="eyebrow text-[var(--color-brand)]">Sections</p>
            <h2 className="mt-2 font-display text-3xl">분류별 읽기</h2>
          </div>
          {types.map((type) => {
            const posts = getPostsByType(type).slice(0, 3);
            if (!posts.length) return null;
            return (
              <section key={type} className="border-b pb-8">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl">
                    {typeMeta[type].label}
                  </h3>
                  <Link
                    href={`/${type}`}
                    className="eyebrow text-[var(--color-brand)] hover:text-white"
                  >
                    전체 →
                  </Link>
                </div>
                <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
                  {typeMeta[type].blurb}
                </p>
                <ul className="mt-5">
                  {posts.map((post, index) => (
                    <li
                      key={post.slug}
                      className="grid grid-cols-[1.75rem_1fr] gap-3 border-t py-4 first:border-t-0"
                    >
                      <span className="font-mono text-[10px] text-[var(--color-brand)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Link
                        href={post.url}
                        className="text-sm leading-snug transition-colors hover:text-[var(--color-brand)]"
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
