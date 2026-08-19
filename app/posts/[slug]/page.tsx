import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatDate,
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/posts";
import { absoluteUrl, siteConfig, typeMeta } from "@/lib/site";
import { extractToc, splitAtMiddle } from "@/lib/toc";
import { Mdx } from "@/components/mdx/mdx";
import { Toc } from "@/components/toc";
import { TypeBadge } from "@/components/type-badge";
import { Disclaimer } from "@/components/disclaimer";
import { AdSenseSlot } from "@/components/ads/adsense-slot";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = absoluteUrl(post.url);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const toc = extractToc(post.content);
  const [first, second] = splitAtMiddle(post.content);
  const related = await getRelatedPosts(post, 3);
  const meta = typeMeta[post.type];

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    inLanguage: siteConfig.lang,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Person", name: siteConfig.author },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(post.url) },
    keywords: post.tags.join(", "),
    articleSection: meta.label,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: meta.label,
        item: absoluteUrl(`/${post.type}`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: absoluteUrl(post.url),
      },
    ],
  };

  return (
    <div className="wrap py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <nav
        aria-label="breadcrumb"
        className="text-sm text-[var(--color-ink-soft)]"
      >
        <Link href="/" className="hover:text-[var(--color-brand)]">
          홈
        </Link>{" "}
        <span aria-hidden>/</span>{" "}
        <Link href={`/${post.type}`} className="hover:text-[var(--color-brand)]">
          {meta.label}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_16rem]">
        <article className="min-w-0">
          <header className="border-b pb-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-ink-soft)]">
              <TypeBadge type={post.type} />
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
              <span aria-hidden>·</span>
              <span className="font-mono">{post.readingMinutes} MIN READ</span>
              {post.ticker ? (
                <span className="font-mono text-[var(--color-stock)]">
                  {post.ticker}
                </span>
              ) : null}
            </div>
            <h1 className="mt-6 max-w-4xl font-display text-4xl leading-[1.08] sm:text-6xl">
              {post.title}
            </h1>
            <p className="mt-3 text-lg text-[var(--color-ink-soft)]">
              {post.description}
            </p>
          </header>

          {/* 광고 1: 제목 아래 */}
          <AdSenseSlot slot="1111111111" />

          <div className="prose-blog prose prose-lg mt-8 max-w-none">
            <Mdx source={first} />

            {/* 광고 2: 본문 중턱 */}
            {second ? <AdSenseSlot slot="2222222222" /> : null}

            {second ? <Mdx source={second} /> : null}
          </div>

          {/* 광고 3: 글 끝 */}
          <AdSenseSlot slot="3333333333" />

          <Disclaimer />

          {post.tags.length ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="border-l border-[var(--color-brand)] py-1 pl-3 text-xs font-semibold tracking-wide text-[var(--color-ink-soft)] hover:text-white"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}

          {related.length ? (
            <section className="mt-14 border-t pt-8">
              <h2 className="font-display text-2xl">함께 읽으면 좋은 글</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug} className="border p-5 transition-colors hover:bg-[var(--color-paper-2)]">
                    <TypeBadge type={r.type} />
                    <Link
                      href={r.url}
                      className="mt-2 block font-display text-lg leading-snug hover:text-[var(--color-brand)]"
                    >
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Toc items={toc} />
          </div>
        </aside>
      </div>
    </div>
  );
}
