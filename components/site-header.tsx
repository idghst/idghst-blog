import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-[var(--bg)]/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl leading-none text-[var(--fg)]">
            idghst
          </span>
          <span className="text-sm font-medium tracking-tight text-[var(--color-brand)]">
            blog
          </span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto text-sm font-medium">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-paper-2)] hover:text-[var(--fg)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
