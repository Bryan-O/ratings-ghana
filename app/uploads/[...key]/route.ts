import { readLocalImage } from "@/lib/storage";

// Serves photos stored with STORAGE_PROVIDER=local (development). In production
// photos live on Vercel Blob and this route finds nothing.
export async function GET(_request: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const data = await readLocalImage(key.join("/"));
  if (!data) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
