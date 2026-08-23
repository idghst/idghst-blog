import { aiDisclosure } from "@/lib/site";

/** 글 메타 줄에 붙는 AI 작성 표시. */
export function AiBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      title={aiDisclosure.short}
      className={`inline-flex items-center gap-1.5 border border-[var(--color-brand)] px-2 py-0.5 font-semibold uppercase tracking-[0.12em] text-[var(--color-brand-ink)] ${
        compact ? "text-[10px]" : "text-[11px]"
      }`}
    >
      <span aria-hidden>◆</span>
      {aiDisclosure.label}
    </span>
  );
}
