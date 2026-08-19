import type { Metadata } from "next";
import { Gowun_Batang, IBM_Plex_Sans_KR, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { AdsenseLoader } from "@/components/ads/adsense-loader";
import "./globals.css";

const display = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-newsreader",
  display: "swap",
});

const sans = IBM_Plex_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-kr",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author }],
  keywords: ["금융", "재테크", "주식", "투자", "종목분석", "시장뉴스"],
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={siteConfig.lang}>
      <body
        className={`${sans.variable} ${display.variable} ${mono.variable} min-h-dvh flex flex-col`}
      >
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <AdsenseLoader />
      </body>
    </html>
  );
}

function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t bg-[var(--color-paper-2)]/60">
      <div className="wrap py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div className="lg:col-span-2">
          <div className="font-display text-xl">{siteConfig.name}</div>
          <p className="mt-3 max-w-sm text-[var(--color-ink-soft)]">
            {siteConfig.description}
          </p>
        </div>
        <nav className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-[var(--color-ink-soft)]">
            콘텐츠
          </span>
          <Link href="/guide" className="hover:text-[var(--color-brand)]">
            가이드
          </Link>
          <Link href="/news" className="hover:text-[var(--color-brand)]">
            뉴스
          </Link>
          <Link href="/stock" className="hover:text-[var(--color-brand)]">
            종목
          </Link>
        </nav>
        <nav className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-[var(--color-ink-soft)]">
            정보
          </span>
          <Link href="/about" className="hover:text-[var(--color-brand)]">
            소개
          </Link>
          <Link href="/disclaimer" className="hover:text-[var(--color-brand)]">
            투자 유의사항
          </Link>
          <Link href="/privacy" className="hover:text-[var(--color-brand)]">
            개인정보처리방침
          </Link>
        </nav>
      </div>
      <div className="border-t">
        <div className="wrap py-6 text-xs text-[var(--color-ink-soft)] flex flex-wrap gap-2 justify-between">
          <span>
            © {year} {siteConfig.name}. 모든 콘텐츠는 정보 제공용이며 투자 권유가
            아닙니다.
          </span>
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    </footer>
  );
}
