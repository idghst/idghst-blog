import type { Metadata } from "next";
import { IBM_Plex_Sans_KR, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { AdsenseLoader } from "@/components/ads/adsense-loader";
import "./globals.css";

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
        className={`${sans.variable} ${mono.variable} min-h-dvh flex flex-col`}
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
    <footer className="mt-24 border-t bg-[#141414]">
      <div className="wrap grid gap-12 py-16 text-sm sm:grid-cols-2 lg:grid-cols-4 lg:py-24">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--color-brand)]" />
            <span className="text-lg font-semibold tracking-[0.14em]">
              {siteConfig.name}
            </span>
          </div>
          <p className="mt-6 max-w-sm leading-6 text-[var(--color-ink-soft)]">
            {siteConfig.description}
          </p>
        </div>
        <nav className="flex flex-col gap-2">
          <span className="eyebrow mb-3 text-[var(--color-brand)]">
            콘텐츠
          </span>
          <Link href="/guide" className="min-h-8 hover:text-[var(--color-brand)]">
            가이드
          </Link>
          <Link href="/news" className="min-h-8 hover:text-[var(--color-brand)]">
            뉴스
          </Link>
          <Link href="/stock" className="min-h-8 hover:text-[var(--color-brand)]">
            종목
          </Link>
        </nav>
        <nav className="flex flex-col gap-2">
          <span className="eyebrow mb-3 text-[var(--color-brand)]">
            정보
          </span>
          <Link href="/about" className="min-h-8 hover:text-[var(--color-brand)]">
            소개
          </Link>
          <Link href="/disclaimer" className="min-h-8 hover:text-[var(--color-brand)]">
            투자 유의사항
          </Link>
          <Link href="/privacy" className="min-h-8 hover:text-[var(--color-brand)]">
            개인정보처리방침
          </Link>
        </nav>
      </div>
      <div className="border-t">
        <div className="wrap flex flex-wrap justify-between gap-2 py-6 font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-soft)]">
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
