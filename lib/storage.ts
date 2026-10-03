import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

export type StoredFile = { url: string; key: string };

const LOCAL_DIR = path.join(process.cwd(), ".uploads");
/** `<businessId>/<random>.webp` — anything else is rejected before touching the filesystem. */
export const LOCAL_KEY_PATTERN = /^[a-z0-9]{10,40}\/[a-f0-9]{24}\.webp$/;

function provider(): "local" | "vercel-blob" {
  const p = process.env.STORAGE_PROVIDER ?? "local";
  if (p === "local") {
    if (process.env.NODE_ENV === "production") {
      throw new Error("STORAGE_PROVIDER=local is not allowed in production; use vercel-blob");
    }
    return p;
  }
  if (p === "vercel-blob") return p;
  throw new Error(`Unknown STORAGE_PROVIDER "${p}"`);
}

/** Store a processed WebP photo for a business and return its public URL. */
export async function storeImage(businessId: string, data: Buffer): Promise<StoredFile> {
  const name = `${randomBytes(12).toString("hex")}.webp`;

  if (provider() === "vercel-blob") {
    const blob = await put(`businesses/${businessId}/${name}`, data, {
      access: "public",
      contentType: "image/webp",
      addRandomSuffix: false,
    });
    return { url: blob.url, key: blob.url };
  }

  const key = `${businessId}/${name}`;
  await mkdir(path.join(LOCAL_DIR, businessId), { recursive: true });
  await writeFile(path.join(LOCAL_DIR, key), data);
  return { url: `/uploads/${key}`, key };
}

export async function deleteStoredImage(key: string): Promise<void> {
  if (provider() === "vercel-blob") {
    await del(key);
    return;
  }
  if (!LOCAL_KEY_PATTERN.test(key)) return;
  await rm(path.join(LOCAL_DIR, key), { force: true });
}

/** Dev only: read a locally stored upload (used by the /uploads route). */
export async function readLocalImage(key: string): Promise<Buffer | null> {
  if (!LOCAL_KEY_PATTERN.test(key)) return null;
  try {
    return await readFile(path.join(LOCAL_DIR, key));
  } catch {
    return null;
  }
}
