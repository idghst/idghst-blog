export type PostType = "guide" | "news" | "stock";

export const siteConfig = {
  name: "idghst blog",
  title: "idghst blog — 금융·재테크·주식 인사이트",
  description:
    "복잡한 금융을 쉽게 푸는 한국어 재테크 블로그. 투자 가이드, 시장 뉴스 해설, 종목 분석을 담백하게 정리합니다.",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://blog.idghst.co.kr"
  ).replace(/\/$/, ""),
  locale: "ko_KR",
  lang: "ko",
  author: "idghst",
  email: "hello@idghst.co.kr",
  nav: [
    { href: "/guide", label: "가이드", type: "guide" as PostType },
    { href: "/news", label: "뉴스", type: "news" as PostType },
    { href: "/stock", label: "종목", type: "stock" as PostType },
    { href: "/about", label: "소개", type: null },
  ],
} as const;

export const typeMeta: Record<
  PostType,
  { label: string; blurb: string; accent: string }
> = {
  guide: {
    label: "가이드",
    blurb: "기초부터 실전까지, 돈이 되는 재테크 원리",
    accent: "guide",
  },
  news: {
    label: "뉴스",
    blurb: "오늘의 시장을 맥락과 함께 읽는 법",
    accent: "news",
  },
  stock: {
    label: "종목",
    blurb: "숫자로 뜯어보는 개별 종목 분석",
    accent: "stock",
  },
};

export function absoluteUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${p}`;
}
