import { blogApiUrl } from "@/lib/posts";

type Params = { params: Promise<{ slug: string }> };

async function proxy(
  request: Request,
  slug: string,
  method: "GET" | "POST",
): Promise<Response> {
  const url = `${blogApiUrl()}/api/posts/${encodeURIComponent(slug)}/comments`;
  const init: RequestInit = {
    method,
    headers: { Accept: "application/json" },
    cache: "no-store",
  };
  if (method === "POST") {
    init.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    init.body = await request.text();
  }
  const upstream = await fetch(url, init);
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(request: Request, { params }: Params) {
  const { slug } = await params;
  return proxy(request, slug, "GET");
}

export async function POST(request: Request, { params }: Params) {
  const { slug } = await params;
  return proxy(request, slug, "POST");
}
