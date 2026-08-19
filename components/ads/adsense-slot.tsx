"use client";

import { useEffect, useRef } from "react";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSenseSlotProps = {
  slot: string;
  format?: string;
  layout?: string;
  label?: string;
  className?: string;
};

/**
 * 단일 광고 슬롯. env가 없으면 렌더하지 않아 레이아웃에 빈 공간이 생기지 않는다.
 */
export function AdSenseSlot({
  slot,
  format = "auto",
  layout,
  label = "광고",
  className,
}: AdSenseSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* AdSense 스크립트 로드 전이면 조용히 무시 */
    }
  }, []);

  if (!CLIENT) return null;

  return (
    <div className={`my-8 ${className ?? ""}`} aria-hidden="true">
      <div className="mb-1 text-center text-[10px] uppercase tracking-widest text-[var(--color-ink-soft)]">
        {label}
      </div>
      <ins
        className="adsbygoogle block"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive="true"
      />
    </div>
  );
}
