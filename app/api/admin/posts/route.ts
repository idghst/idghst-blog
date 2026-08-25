import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/admin";
import { blogApiUrl } from "@/lib/posts";

export async function POST(request: Request) {
  const jar = await cookies();
  const key = jar.get(ADMIN_COOKIE)?.value;
  if (!key) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const upstream = await fetch(`${blogApiUrl()}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Blog-Key": key,
    },
    body: await request.text(),
    cache: "no-store",
  });
  if (upstream.ok) {
    revalidatePath("/", "layout");
  }
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
