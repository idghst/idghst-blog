export type PostType = "guide" | "news" | "stock";

export const siteConfig = {
  name: "IDGHST",
  title: "IDGHST — 금융·재테크·주식 인사이트",
  description:
    "복잡한 금융을 쉽게 푸는 한국어 재테크 블로그. 투자 가이드, 시장 뉴스 해설, 종목 분석을 담백하게 정리합니다.",
  url: (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://blog.idghst.co.kr"
  ).replace(/\/$/, ""),
  locale: "ko_KR",
  lang: "ko",
  author: "IDGHST",
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

/**
 * AI 작성 고지. 화면에 노출되는 문구는 여기 한 곳에서 관리한다.
 */
export const aiDisclosure = {
  label: "AI 작성",
  short: "이 글은 AI가 작성했습니다.",
  long: "이 글은 공개된 자료를 바탕으로 AI가 작성했습니다. 본문의 수치와 날짜는 원문에서 확인한 값을 쓰지만, 사실과 다르거나 최신이 아닐 수 있습니다. 중요한 판단 전에는 원문과 공식 자료를 직접 확인하세요.",
  siteWide: "이 사이트의 글은 AI가 작성합니다.",
} as const;

export function absoluteUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${p}`;
}
