import type { TocItem } from "@/lib/toc";

export function Toc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;
  return (
    <nav aria-label="목차" className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ink-soft)]">
        목차
      </p>
      <ul className="space-y-2 border-l border-[var(--color-line)]">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "pl-6" : "pl-4"}
          >
            <a
              href={`#${item.id}`}
              className="block text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-brand)]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
