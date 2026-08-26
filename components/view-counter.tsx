"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "blog:visitor-id";

// 같은 기기를 다시 알아보기 위한 값. 새로고침으로 조회수가 늘지 않게
// 하려면 서버가 방문자를 구분할 수 있어야 한다.
function readVisitorId(): string | undefined {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    const fresh = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, fresh);
    return fresh;
  } catch {
    // 시크릿 모드 등 localStorage를 못 쓰는 경우. 서버가 IP로 대체한다.
    return undefined;
  }
}

export function ViewCounter({
  slug,
  initialCount,
}: {
  slug: string;
  initialCount?: number;
}) {
  const [count, setCount] = useState<number | undefined>(initialCount);

  useEffect(() => {
    let ignore = false;
    const visitorId = readVisitorId();
    fetch(`/api/posts/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitorId ? { visitorId } : {}),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("view");
        return (await res.json()) as { viewCount?: number };
      })
      .then((data) => {
        if (!ignore && typeof data.viewCount === "number") {
          setCount(data.viewCount);
        }
      })
      // 집계가 실패해도 글 읽기를 막지 않는다. 조회수만 감춘다.
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [slug]);

  if (typeof count !== "number") return null;

  return (
    <>
      <span aria-hidden>·</span>
      <span>조회 {new Intl.NumberFormat("ko-KR").format(count)}</span>
    </>
  );
}
