import { blogApiUrl } from "@/lib/posts";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const upstream = await fetch(
    `${blogApiUrl()}/api/blobs/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": upstream.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
