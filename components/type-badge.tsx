import Link from "next/link";
import { typeMeta } from "@/lib/site";
import type { PostType } from "@/lib/site";

const colorByType: Record<PostType, string> = {
  guide: "text-[var(--color-guide)] border-[var(--color-guide)]",
  news: "text-[var(--color-news)] border-[var(--color-news)]",
  stock: "text-[var(--color-stock)] border-[var(--color-stock)]",
};

export function TypeBadge({
  type,
  asLink = true,
}: {
  type: PostType;
  asLink?: boolean;
}) {
  const cls = `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${colorByType[type]}`;
  const label = typeMeta[type].label;
  if (!asLink) return <span className={cls}>{label}</span>;
  return (
    <Link href={`/${type}`} className={`${cls} hover:opacity-80`}>
      {label}
    </Link>
  );
}
