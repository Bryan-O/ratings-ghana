import sharp from "sharp";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_DIMENSION = 1600;
const MIN_LONG_EDGE = 300;
const MIN_SHORT_EDGE = 200;

export type ImageType = "jpeg" | "png" | "webp";

/** Identify an image by its magic bytes — never trust the declared MIME type or extension. */
export function detectImageType(buf: Uint8Array): ImageType | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (
    buf.length >= 8 &&
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
    buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) return "png";
  if (
    buf.length >= 12 &&
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 && // RIFF
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50 // WEBP
  ) return "webp";
  return null;
}

export class ImageError extends Error {}

export type ProcessedImage = { data: Buffer; width: number; height: number };

/**
 * Re-encode an uploaded photo: auto-rotate, shrink to MAX_DIMENSION, convert to WebP.
 * Re-encoding drops all metadata (EXIF, GPS location) and neutralises malformed files.
 */
export async function processImage(input: Buffer): Promise<ProcessedImage> {
  if (input.length > MAX_UPLOAD_BYTES) throw new ImageError("Photos must be 4 MB or smaller.");
  if (!detectImageType(input)) throw new ImageError("Only JPEG, PNG or WebP photos are allowed.");

  let meta: { width?: number; height?: number };
  try {
    meta = await sharp(input, { limitInputPixels: 50_000_000 }).metadata();
  } catch {
    throw new ImageError("We couldn't read this image. Try a different photo.");
  }
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (Math.max(w, h) < MIN_LONG_EDGE || Math.min(w, h) < MIN_SHORT_EDGE) {
    throw new ImageError("This photo is too small. Please upload one at least 300×200 pixels.");
  }

  try {
    const { data, info } = await sharp(input, { limitInputPixels: 50_000_000 })
      .rotate()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });
    return { data, width: info.width, height: info.height };
  } catch {
    throw new ImageError("We couldn't process this image. Try a different photo.");
  }
}
