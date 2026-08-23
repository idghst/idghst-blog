import { AdminEditor } from "@/components/admin-editor";

export const metadata = {
  title: "글 작성",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <div className="wrap py-16 sm:py-24">
      <p className="eyebrow text-[var(--color-brand)]">Admin</p>
      <h1 className="mt-3 font-display text-4xl sm:text-6xl">글 작성</h1>
      <p className="mt-4 max-w-2xl text-[var(--color-ink-soft)]">
        관리자만 글을 테이블에 저장합니다. 본문 파일은 로컬에 남기지 않습니다.
        일반 독자는 글 읽기와 댓글만 가능합니다.
      </p>
      <AdminEditor />
    </div>
  );
}
