"use client";

import { useEffect, useState } from "react";

type InstallPrompt = Event & { prompt: () => Promise<void> };

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js");
    }
  }, []);
  return null;
}

export function PwaInstall() {
  const [promptEvent, setPromptEvent] = useState<InstallPrompt | null>(null);
  const [standalone, setStandalone] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    setStandalone(isStandalone());
    setIos(isIos());
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPrompt);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (standalone) return null;

  async function install() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    setPromptEvent(null);
  }

  return (
    <details className="relative shrink-0">
      <summary
        onClick={() => void install()}
        className="flex min-h-12 w-max cursor-pointer list-none items-center whitespace-nowrap px-3 text-[11px] font-semibold tracking-[0.1em] text-[var(--color-brand)] transition-colors hover:text-white [&::marker]:hidden [&::-webkit-details-marker]:hidden"
      >
        앱 설치
      </summary>
      <p
        role="status"
        className="absolute right-0 top-full z-50 mt-1 w-56 border bg-[#181818] p-3 text-[11px] leading-5 text-[var(--color-ink-soft)]"
      >
        {ios
          ? '공유 버튼에서 "홈 화면에 추가"를 누르면 설치된다.'
          : "주소창의 설치 아이콘이나 브라우저 메뉴에서 앱을 설치한다."}
      </p>
    </details>
  );
}
