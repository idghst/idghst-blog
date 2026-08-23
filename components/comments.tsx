"use client";

import { useEffect, useState, type FormEvent } from "react";

type Comment = {
  id: number;
  author: string;
  body: string;
  createdAt: string;
};

export function CommentSection({ slug }: { slug: string }) {
  const [items, setItems] = useState<Comment[]>([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/posts/${encodeURIComponent(slug)}/comments`)
      .then(async (res) => {
        if (!res.ok) throw new Error("load");
        return (await res.json()) as { items: Comment[] };
      })
      .then((data) => {
        if (!ignore) setItems(data.items ?? []);
      })
      .catch(() => {
        if (!ignore) setError("댓글을 불러오지 못했습니다.");
      });
    return () => {
      ignore = true;
    };
  }, [slug]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(slug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, body }),
      });
      if (!res.ok) {
        setError("댓글을 등록하지 못했습니다.");
        return;
      }
      const created = (await res.json()) as Comment;
      setItems((prev) => [...prev, created]);
      setBody("");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mt-14 border-t pt-8" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="font-display text-2xl">
        댓글
      </h2>
      <ul className="mt-6 space-y-5">
        {items.length === 0 ? (
          <li className="text-sm text-[var(--color-ink-soft)]">
            아직 댓글이 없습니다.
          </li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="border-l border-[var(--color-brand)] pl-4">
              <p className="text-sm font-semibold">{item.author}</p>
              <p className="mt-1 whitespace-pre-wrap text-[var(--color-ink-soft)]">
                {item.body}
              </p>
            </li>
          ))
        )}
      </ul>
      <form className="mt-8 grid gap-3" onSubmit={onSubmit}>
        <label className="grid gap-1 text-sm">
          이름
          <input
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            maxLength={80}
            className="min-h-11 border bg-transparent px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          내용
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            maxLength={2000}
            rows={4}
            className="border bg-transparent px-3 py-2"
          />
        </label>
        {error ? <p className="text-sm text-[var(--color-brand)]">{error}</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="editorial-link w-fit"
        >
          {pending ? "등록 중" : "댓글 등록"}
        </button>
      </form>
    </section>
  );
}
