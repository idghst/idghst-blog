import Link from "next/link";
import { typeMeta } from "@/lib/site";
import type { PostType } from "@/lib/site";

export function TypeBadge({
  type,
  asLink = true,
}: {
  type: PostType;
  asLink?: boolean;
}) {
  const cls =
    "inline-flex items-center rounded-full border bg-[var(--color-paper-2)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white";
  const label = typeMeta[type].label;
  if (!asLink) return <span className={cls}>{label}</span>;
  return (
    <Link href={`/${type}`} className={`${cls} hover:opacity-80`}>
      {label}
    </Link>
  );
}
