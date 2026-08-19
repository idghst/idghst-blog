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
      className={`group flex flex-col border-b py-6 ${
        featured ? "sm:py-8" : ""
      }`}
    >
      <div className="flex items-center gap-3 text-xs text-[var(--color-ink-soft)]">
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
        className={`mt-3 font-display leading-snug tracking-tight ${
          featured ? "text-2xl sm:text-3xl" : "text-xl"
        }`}
      >
        <Link
          href={post.url}
          className="transition-colors group-hover:text-[var(--color-brand)]"
        >
          {post.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-2 text-[var(--color-ink-soft)]">
        {post.description}
      </p>

      {post.tags.length ? (
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-ink-soft)]">
          {post.tags.slice(0, 4).map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-full bg-[var(--color-paper-2)] px-2 py-0.5 hover:text-[var(--color-brand)]"
            >
              #{tag}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
