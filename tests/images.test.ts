import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { ImageError, MAX_DIMENSION, MAX_UPLOAD_BYTES, detectImageType, processImage } from "@/lib/images";

const solid = (width: number, height: number) =>
  sharp({ create: { width, height, channels: 3, background: { r: 124, g: 58, b: 237 } } });

describe("detectImageType", () => {
  it("recognises JPEG, PNG and WebP by magic bytes", async () => {
    expect(detectImageType(await solid(10, 10).jpeg().toBuffer())).toBe("jpeg");
    expect(detectImageType(await solid(10, 10).png().toBuffer())).toBe("png");
    expect(detectImageType(await solid(10, 10).webp().toBuffer())).toBe("webp");
  });

  it("rejects GIF, text and spoofed content", async () => {
    expect(detectImageType(await solid(10, 10).gif().toBuffer())).toBeNull();
    expect(detectImageType(Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'/>"))).toBeNull();
    expect(detectImageType(Buffer.from("not really a jpeg.jpg"))).toBeNull();
    expect(detectImageType(new Uint8Array())).toBeNull();
  });
});

describe("processImage", () => {
  it("converts to WebP and shrinks large photos", async () => {
    const out = await processImage(await solid(4000, 3000).jpeg().toBuffer());
    expect(detectImageType(out.data)).toBe("webp");
    expect(Math.max(out.width, out.height)).toBe(MAX_DIMENSION);
    expect(out.width / out.height).toBeCloseTo(4 / 3, 1);
  });

  it("does not enlarge photos that are already small enough", async () => {
    const out = await processImage(await solid(800, 600).png().toBuffer());
    expect([out.width, out.height]).toEqual([800, 600]);
  });

  it("strips EXIF metadata (e.g. GPS location)", async () => {
    const withExif = await solid(800, 600)
      .jpeg()
      .withExif({ IFD0: { Copyright: "secret", Artist: "someone" } })
      .toBuffer();
    expect((await sharp(withExif).metadata()).exif).toBeDefined();

    const out = await processImage(withExif);
    expect((await sharp(out.data).metadata()).exif).toBeUndefined();
  });

  it("rejects tiny images, non-images and oversized uploads", async () => {
    await expect(processImage(await solid(200, 150).jpeg().toBuffer())).rejects.toBeInstanceOf(ImageError);
    await expect(processImage(Buffer.from("hello"))).rejects.toThrow("Only JPEG, PNG or WebP");
    await expect(processImage(Buffer.alloc(MAX_UPLOAD_BYTES + 1))).rejects.toThrow("4 MB");
  });

  it("rejects corrupt files that only look like images", async () => {
    const fake = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(500, 7)]);
    await expect(processImage(fake)).rejects.toBeInstanceOf(ImageError);
  });
});
