import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: `${siteConfig.name}의 개인정보 수집·이용 및 쿠키·광고 정책.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="wrap-narrow py-10 sm:py-14">
      <h1 className="font-display text-4xl tracking-tight">개인정보처리방침</h1>
      <div className="prose-blog prose prose-lg mt-8 max-w-none">
        <p>
          {siteConfig.name}(이하 &ldquo;사이트&rdquo;)은 이용자의 개인정보를
          중요하게 생각하며, 관련 법령을 준수합니다. 본 방침은 사이트가 어떤
          정보를 수집하고 어떻게 이용하는지 설명합니다.
        </p>

        <h2>1. 수집하는 정보</h2>
        <p>
          사이트는 회원가입 절차가 없으며 이름·연락처 등 직접적인 개인정보를
          요구하지 않습니다. 다만 서비스 운영과 통계, 광고 제공을 위해 쿠키와
          접속 로그(IP, 브라우저 종류, 방문 페이지 등)가 자동으로 수집될 수
          있습니다.
        </p>

        <h2>2. 쿠키와 광고</h2>
        <p>
          본 사이트는 Google AdSense를 포함한 제3자 광고 서비스를 이용할 수
          있습니다. Google을 비롯한 제3자 공급업체는 쿠키를 사용하여 이용자의
          이전 방문 기록을 바탕으로 광고를 게재합니다.
        </p>
        <ul>
          <li>
            이용자는{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Google 광고 설정
            </a>
            에서 맞춤 광고를 비활성화할 수 있습니다.
          </li>
          <li>
            브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있으며, 이 경우
            일부 기능 이용에 제한이 있을 수 있습니다.
          </li>
          <li>
            제3자 광고 관련 자세한 내용은{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Google 광고 정책
            </a>
            을 참고하세요.
          </li>
        </ul>

        <h2>3. 분석 도구</h2>
        <p>
          사이트는 방문 통계 분석을 위해 분석 도구를 사용할 수 있으며, 이때
          수집되는 데이터는 개인을 식별하지 않는 형태로 집계됩니다.
        </p>

        <h2>4. 정보의 보관과 파기</h2>
        <p>
          자동 수집된 접속 정보는 통계 및 보안 목적으로만 이용되며, 목적 달성 후
          지체 없이 파기합니다.
        </p>

        <h2>5. 문의</h2>
        <p>
          개인정보 관련 문의는{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> 로 연락
          주세요. 본 방침은 사이트 사정에 따라 변경될 수 있으며, 변경 시 본
          페이지를 통해 공지합니다.
        </p>
      </div>
    </div>
  );
}
