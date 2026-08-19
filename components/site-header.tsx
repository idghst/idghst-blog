import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-[#181818]/92 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="text-lg font-semibold leading-none tracking-[0.14em] text-white">
            IDGHST
          </span>
          <span className="border-l border-[var(--color-line)] pl-3 text-[10px] font-semibold tracking-[0.16em] text-[var(--color-brand)]">
            BLOG
          </span>
        </Link>

        <nav
          aria-label="주요 메뉴"
          className="flex items-center gap-1 overflow-x-auto text-[11px] font-semibold tracking-[0.1em] [scrollbar-width:none]"
        >
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-12 items-center whitespace-nowrap px-3 text-[var(--color-ink-soft)] transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
