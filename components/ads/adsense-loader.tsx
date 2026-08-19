import Script from "next/script";

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * AdSense 로더. env(NEXT_PUBLIC_ADSENSE_CLIENT)가 없으면 아무것도 렌더하지 않는다.
 */
export function AdsenseLoader() {
  if (!CLIENT) return null;
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`}
    />
  );
}
