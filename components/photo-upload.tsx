"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadPhotoAction } from "@/lib/actions/photos";
import { initialState } from "@/lib/actions/state";
import { CheckIcon, CloseIcon, PlusIcon } from "@/components/icons";
import { btn, input, label } from "@/components/ui";

const MAX_FILES = 10;
const MAX_EDGE = 2000;
const MAX_BYTES = 4 * 1024 * 1024;

type Item = {
  id: string;
  file: File;
  preview: string;
  status: "ready" | "uploading" | "done" | "error";
  error?: string;
};

/** Shrink large phone photos in the browser so each upload stays well under the size limit. */
async function downscale(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
    if (blob) return blob;
  } catch {
    // Fall through: let the server decide whether it can read the original.
  }
  return file;
}

export function PhotoUpload({ businessId }: { businessId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [caption, setCaption] = useState("");
  const [rights, setRights] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Release preview URLs when the component goes away.
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.preview)), []);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setNotice(null);
    const images = Array.from(list).filter((f) => f.type.startsWith("image/"));
    const room = MAX_FILES - items.filter((i) => i.status !== "done").length;
    const added = images.slice(0, Math.max(0, room)).map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      file,
      preview: URL.createObjectURL(file),
      status: "ready" as const,
    }));
    if (images.length > added.length) setNotice(`You can add up to ${MAX_FILES} photos at a time.`);
    setItems((prev) => [...prev.filter((i) => i.status !== "done"), ...added]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(id: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  }

  const update = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  async function upload() {
    if (!rights) {
      setNotice("Please confirm you took these photos or have permission to share them.");
      return;
    }
    setBusy(true);
    setNotice(null);
    let anyDone = false;
    for (const item of items.filter((i) => i.status === "ready" || i.status === "error")) {
      update(item.id, { status: "uploading", error: undefined });
      const blob = await downscale(item.file);
      if (blob.size > MAX_BYTES) {
        update(item.id, { status: "error", error: "Too large (max 4 MB)." });
        continue;
      }
      const fd = new FormData();
      fd.set("businessId", businessId);
      fd.set("photo", blob, blob === item.file ? item.file.name : "photo.jpg");
      fd.set("rights", "on");
      if (caption.trim()) fd.set("caption", caption.trim());
      try {
        const res = await uploadPhotoAction(initialState, fd);
        if (res.ok) {
          update(item.id, { status: "done" });
          anyDone = true;
        } else {
          update(item.id, { status: "error", error: res.errors?.form ?? "Upload failed." });
        }
      } catch {
        update(item.id, { status: "error", error: "Upload failed. Check your connection and try again." });
      }
    }
    setBusy(false);
    if (anyDone) {
      setCaption("");
      router.refresh();
    }
  }

  const pending = items.filter((i) => i.status === "ready" || i.status === "error").length;
  const done = items.filter((i) => i.status === "done").length;

  return (
    <div className="flex flex-col gap-4">
      <label
        className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line-strong bg-brand-wash px-4 py-5 text-center transition-colors duration-200 hover:border-brand has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-brand text-white">
          <PlusIcon size={20} />
        </span>
        <span className="font-semibold text-ink">Choose photos</span>
        <span className="text-sm text-muted">JPEG, PNG or WebP · up to {MAX_FILES} at a time</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="sr-only"
          aria-label="Choose photos"
        />
      </label>

      {items.length > 0 && (
        <ul className="grid grid-cols-3 gap-2" aria-label="Selected photos">
          {items.map((item) => (
            <li key={item.id} className="relative aspect-square overflow-hidden rounded-xl bg-brand-soft">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
              <img src={item.preview} alt="" className="size-full object-cover" />
              {item.status === "uploading" && (
                <span className="absolute inset-0 flex items-center justify-center bg-brand-night/60">
                  <span className="size-6 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-label="Uploading" />
                </span>
              )}
              {item.status === "done" && (
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-cta py-1 text-xs font-semibold text-white">
                  <CheckIcon size={14} /> Sent for review
                </span>
              )}
              {item.status === "error" && (
                <span className="absolute inset-x-0 bottom-0 bg-red-700 px-1.5 py-1 text-[11px] leading-tight font-semibold text-white" role="alert">
                  {item.error}
                </span>
              )}
              {(item.status === "ready" || item.status === "error") && !busy && (
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.file.name}`}
                  className="absolute top-1 right-1 flex size-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow transition-colors duration-200 hover:bg-white"
                >
                  <CloseIcon size={16} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {pending > 0 && (
        <>
          <div>
            <label htmlFor={`caption-${businessId}`} className={label}>
              Caption <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              id={`caption-${businessId}`}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={140}
              placeholder="e.g. Jollof with grilled chicken"
              className={input}
            />
          </div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-body">
            <input
              type="checkbox"
              checked={rights}
              onChange={(e) => setRights(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand"
            />
            I took these photos myself or have permission to share them, and they show this business.
          </label>
          <button type="button" onClick={upload} disabled={busy} className={`${btn.cta} w-full`}>
            {busy && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            {busy ? "Uploading…" : `Upload ${pending} photo${pending === 1 ? "" : "s"}`}
          </button>
        </>
      )}

      {notice && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {notice}
        </p>
      )}
      {done > 0 && !busy && pending === 0 && (
        <p role="status" className="rounded-xl border border-green-200 bg-cta-soft px-4 py-3 text-sm font-medium text-green-900">
          Thanks! {done === 1 ? "Your photo" : `Your ${done} photos`} will appear once our team has reviewed {done === 1 ? "it" : "them"}.
        </p>
      )}
      <p className="text-xs text-muted">
        Photos are checked by our team before they appear. Location data is removed from every photo.
      </p>
    </div>
  );
}
