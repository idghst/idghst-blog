import Link from "next/link";

export function Disclaimer() {
  return (
    <aside className="mt-12 rounded-xl border border-[var(--color-line)] bg-[var(--color-paper-2)]/60 p-5 text-sm text-[var(--color-ink-soft)]">
      <p className="font-semibold text-[var(--fg)]">투자 유의사항</p>
      <p className="mt-2 leading-relaxed">
        이 글은 정보 제공을 목적으로 하며, 특정 종목·상품의 매수·매도를 권유하지
        않습니다. 모든 투자 판단과 그 결과에 대한 책임은 투자자 본인에게 있습니다.
        과거 수익률이 미래 수익을 보장하지 않습니다. 자세한 내용은{" "}
        <Link href="/disclaimer" className="underline hover:text-[var(--color-brand)]">
          투자 유의사항
        </Link>
        을 확인하세요.
      </p>
    </aside>
  );
}
