import { blogApiUrl } from "@/lib/posts";

type Params = { params: Promise<{ slug: string }> };

// 조회수는 브라우저에서만 호출한다. 여기서 방문자 IP를 그대로 넘겨주지
// 않으면 FastAPI가 Vercel 서버 IP를 보게 되어, visitorId가 없는 방문자가
// 전부 한 사람으로 합쳐진다.
export async function POST(request: Request, { params }: Params) {
  const { slug } = await params;
  const forwarded =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "";

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (forwarded) headers["X-Forwarded-For"] = forwarded;
  const userAgent = request.headers.get("user-agent");
  if (userAgent) headers["User-Agent"] = userAgent;

  const upstream = await fetch(
    `${blogApiUrl()}/api/posts/${encodeURIComponent(slug)}/view`,
    {
      method: "POST",
      headers,
      body: await request.text(),
      cache: "no-store",
    },
  );
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
