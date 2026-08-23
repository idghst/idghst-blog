"use client";

import { useState, type FormEvent } from "react";
import type { PostType } from "@/lib/site";

const TYPES: PostType[] = ["guide", "news", "stock"];

export function AdminEditor() {
  const [key, setKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [status, setStatus] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PostType>("guide");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("");
  const [ticker, setTicker] = useState("");
  const [draft, setDraft] = useState(false);
  const [imageNote, setImageNote] = useState("");

  async function login(event: FormEvent) {
    event.preventDefault();
    setStatus("");
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    if (!res.ok) {
      setStatus("관리자 키가 올바르지 않습니다.");
      return;
    }
    setAuthed(true);
    setKey("");
    setStatus("로그인했습니다. 글은 API 테이블에만 저장됩니다.");
  }

  async function uploadImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("");
    const res = await fetch("/api/admin/blobs", { method: "POST", body: data });
    if (!res.ok) {
      setStatus("이미지를 올리지 못했습니다.");
      return;
    }
    const meta = (await res.json()) as { id: string; description: string };
    const snippet = `![${meta.description}](blob:${meta.id})`;
    setBody((prev) => `${prev.trim()}\n\n${snippet}\n\n`);
    setImageNote(`본문에 삽입: ${snippet}`);
    form.reset();
  }

  async function publish(event: FormEvent) {
    event.preventDefault();
    setStatus("");
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        title,
        description,
        type,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        body,
        ticker: ticker || null,
        draft,
      }),
    });
    if (!res.ok) {
      setStatus("글을 저장하지 못했습니다. 키와 본문을 확인하세요.");
      return;
    }
    setStatus(`저장했습니다. /posts/${slug}`);
  }

  if (!authed) {
    return (
      <form className="mt-10 grid max-w-md gap-3" onSubmit={login}>
        <label className="grid gap-1 text-sm">
          관리자 키
          <input
            type="password"
            name="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            required
            className="min-h-11 border bg-transparent px-3"
          />
        </label>
        {status ? <p className="text-sm text-[var(--color-brand)]">{status}</p> : null}
        <button type="submit" className="editorial-link w-fit">
          로그인
        </button>
      </form>
    );
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <form className="grid gap-3" onSubmit={publish}>
        <label className="grid gap-1 text-sm">
          슬러그
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="min-h-11 border bg-transparent px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          제목
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="min-h-11 border bg-transparent px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          요약
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="border bg-transparent px-3 py-2"
          />
        </label>
        <label className="grid gap-1 text-sm">
          유형
          <select
            value={type}
            onChange={(e) => setType(e.target.value as PostType)}
            className="min-h-11 border bg-transparent px-3"
          >
            {TYPES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          태그 (쉼표)
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="min-h-11 border bg-transparent px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          종목
          <input
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            className="min-h-11 border bg-transparent px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          본문 (마크다운, 그림은 ![설명](blob:id))
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={18}
            className="border bg-transparent px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
          />
          초고
        </label>
        {status ? <p className="text-sm text-[var(--color-ink-soft)]">{status}</p> : null}
        <button type="submit" className="editorial-link w-fit">
          테이블에 저장
        </button>
      </form>

      <form className="grid h-fit gap-3 border p-5" onSubmit={uploadImage}>
        <p className="eyebrow text-[var(--color-brand)]">Paper figure</p>
        <p className="text-sm text-[var(--color-ink-soft)]">
          논문 그림처럼 설명과 함께 올립니다. 영상은 받지 않습니다.
        </p>
        <label className="grid gap-1 text-sm">
          그림 설명
          <input
            name="description"
            required
            className="min-h-11 border bg-transparent px-3"
          />
        </label>
        <label className="grid gap-1 text-sm">
          이미지
          <input name="file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" required />
        </label>
        <button type="submit" className="editorial-link w-fit">
          블롭 저장 후 본문 삽입
        </button>
        {imageNote ? (
          <p className="break-all font-mono text-xs text-[var(--color-ink-soft)]">
            {imageNote}
          </p>
        ) : null}
      </form>
    </div>
  );
}
