import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "소개",
  description: `${siteConfig.name} 소개 — 금융·재테크·주식 콘텐츠를 다루는 이유와 편집 원칙.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="wrap-narrow py-10 sm:py-14">
      <h1 className="font-display text-4xl tracking-tight">소개</h1>
      <div className="prose-blog prose prose-lg mt-8 max-w-none">
        <p>
          <strong>{siteConfig.name}</strong>은 복잡한 금융 이야기를 초보 투자자도
          이해할 수 있게 정리하는 한국어 재테크 블로그입니다. 자산배분 같은 기초
          <strong>가이드</strong>, 시장 흐름을 맥락과 함께 읽는{" "}
          <strong>뉴스</strong> 해설, 숫자로 뜯어보는 <strong>종목</strong> 분석을
          다룹니다.
        </p>
        <h2>편집 원칙</h2>
        <ul>
          <li>예측보다 원리. 맞히기보다 이해하고 버티는 법을 다룹니다.</li>
          <li>근거 우선. 감이 아니라 숫자와 출처로 이야기합니다.</li>
          <li>중립. 특정 종목·상품을 추천하거나 홍보하지 않습니다.</li>
        </ul>
        <h2>수익 모델</h2>
        <p>
          이 사이트는 Google AdSense 등 광고를 통해 운영될 수 있습니다. 광고는
          콘텐츠와 명확히 구분되며, 광고주가 편집 방향에 영향을 주지 않습니다.
        </p>
        <h2>연락</h2>
        <p>
          제보·문의는{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> 로 보내
          주세요.
        </p>
      </div>
    </div>
  );
}
