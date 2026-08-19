import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-mono text-sm text-[var(--color-brand)]">404</p>
      <h1 className="mt-3 font-display text-4xl tracking-tight">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-3 max-w-md text-[var(--color-ink-soft)]">
        주소가 바뀌었거나 삭제된 글일 수 있어요. 홈으로 돌아가 최신 글을
        확인해 보세요.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-[var(--color-brand)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-ink)]"
      >
        홈으로
      </Link>
    </div>
  );
}
