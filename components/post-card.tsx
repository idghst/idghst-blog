import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/posts";
import { TypeBadge } from "@/components/type-badge";

export function PostCard({
  post,
  featured = false,
}: {
  post: PostMeta;
  featured?: boolean;
}) {
  return (
    <article
      className={`group relative flex flex-col border-b transition-colors ${
        featured
          ? "py-10 sm:py-14"
          : "py-7 hover:bg-[var(--color-paper-2)]/45 sm:px-4 sm:-mx-4"
      }`}
    >
      {featured ? (
        <span className="absolute right-0 top-10 font-mono text-[10px] tracking-[0.14em] text-[var(--color-brand)]">
          FEATURED
        </span>
      ) : null}
      <div className="flex flex-wrap items-center gap-3 text-[11px] tracking-wide text-[var(--color-ink-soft)]">
        <TypeBadge type={post.type} />
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes}분 읽기</span>
        {post.ticker ? (
          <span className="font-mono text-[var(--color-stock)]">
            {post.ticker}
          </span>
        ) : null}
      </div>

      <h3
        className={`mt-5 max-w-3xl font-display leading-[1.18] ${
          featured ? "text-3xl sm:text-5xl" : "text-xl sm:text-2xl"
        }`}
      >
        <Link
          href={post.url}
          className="transition-colors group-hover:text-[var(--color-brand)]"
        >
          {post.title}
        </Link>
      </h3>

      <p
        className={`mt-4 line-clamp-2 leading-7 text-[var(--color-ink-soft)] ${
          featured ? "max-w-2xl text-base sm:text-lg" : "text-sm"
        }`}
      >
        {post.description}
      </p>

      {post.tags.length ? (
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-soft)]">
          {post.tags.slice(0, 4).map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="border-l border-[var(--color-brand)] pl-2 transition-colors hover:text-white"
            >
              #{tag}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
