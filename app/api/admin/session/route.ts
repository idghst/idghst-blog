import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/admin";
import { blogApiUrl } from "@/lib/posts";

export async function POST(request: Request) {
  const body = (await request.json()) as { key?: string };
  const key = body.key?.trim() ?? "";
  if (!key) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const probe = await fetch(`${blogApiUrl()}/api/posts?includeDrafts=true&limit=1`, {
    headers: { "X-Blog-Key": key, Accept: "application/json" },
    cache: "no-store",
  });
  if (!probe.ok) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, key, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  return Response.json({ ok: true });
}
