import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "투자 유의사항",
  description: "본 사이트 콘텐츠의 성격과 투자 책임에 대한 고지.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <div className="wrap-narrow py-10 sm:py-14">
      <h1 className="font-display text-4xl tracking-tight">투자 유의사항</h1>
      <div className="prose-blog prose prose-lg mt-8 max-w-none">
        <p>
          {siteConfig.name}에 게시된 모든 콘텐츠는 <strong>정보 제공</strong>을
          목적으로 작성되었으며, 특정 금융상품이나 종목의 매수·매도를 권유하는
          투자 자문이 아닙니다.
        </p>
        <h2>책임의 한계</h2>
        <ul>
          <li>
            모든 투자 판단과 그에 따른 손익의 책임은 전적으로 투자자 본인에게
            있습니다.
          </li>
          <li>
            과거의 수익률이나 성과가 미래의 수익을 보장하지 않습니다.
          </li>
          <li>
            게시 시점의 정보는 이후 시장 상황에 따라 사실과 달라질 수 있으며,
            내용의 정확성·완전성을 보증하지 않습니다.
          </li>
        </ul>
        <h2>전문가 상담 권고</h2>
        <p>
          구체적인 투자 결정을 내리기 전에는 자격을 갖춘 금융·세무 전문가와
          상담하시기 바랍니다. 본 사이트는 독자의 투자 결과에 대해 어떠한 법적
          책임도 지지 않습니다.
        </p>
        <h2>이해관계 고지</h2>
        <p>
          필자는 글에서 언급한 종목을 보유하고 있을 수 있습니다. 광고는 콘텐츠와
          구분되어 표시되며, 광고 노출이 특정 상품에 대한 추천을 의미하지
          않습니다.
        </p>
      </div>
    </div>
  );
}
