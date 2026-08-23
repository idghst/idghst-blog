import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/admin";
import { blogApiUrl } from "@/lib/posts";

const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  const jar = await cookies();
  const key = jar.get(ADMIN_COOKIE)?.value;
  if (!key) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const form = await request.formData();
  const description = String(form.get("description") ?? "").trim();
  const file = form.get("file");
  if (!description || !(file instanceof File)) {
    return Response.json({ ok: false }, { status: 422 });
  }
  if (!ALLOWED.has(file.type)) {
    return Response.json({ ok: false }, { status: 422 });
  }
  const contentBase64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const upstream = await fetch(`${blogApiUrl()}/api/blobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Blog-Key": key,
    },
    body: JSON.stringify({
      description,
      mimeType: file.type,
      contentBase64,
    }),
    cache: "no-store",
  });
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
