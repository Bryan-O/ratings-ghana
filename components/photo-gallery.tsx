"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/icons";

/** Photo strip on a business page. Tapping a photo opens it full size (arrow keys to browse, Esc to close). */
export function PhotoGallery({ images, name }: { images: string[]; name: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const shown = images.slice(0, 5);

  function open(i: number) {
    setIndex(i);
    dialog.current?.showModal();
  }
  const step = (d: number) => setIndex((i) => (i + d + images.length) % images.length);

  return (
    <>
      <section aria-label="Photos" className="grid h-[260px] grid-cols-4 grid-rows-2 gap-3 sm:h-[420px]">
        {shown.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => open(i)}
            aria-label={`Open photo ${i + 1} of ${images.length}`}
            className={`group relative cursor-pointer overflow-hidden rounded-2xl ${i === 0 ? "col-span-4 row-span-2 sm:col-span-2" : "hidden sm:block"}`}
          >
            <Image
              src={src}
              alt={`${name}, photo ${i + 1}`}
              fill
              sizes={i === 0 ? "(max-width: 640px) 100vw, 50vw" : "25vw"}
              priority={i === 0}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </section>

      <dialog
        ref={dialog}
        aria-label={`Photos of ${name}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        className="m-auto h-[min(90vh,900px)] w-[min(94vw,1200px)] max-w-none overflow-hidden rounded-2xl bg-ink p-0 text-white backdrop:bg-ink/80 open:animate-rise"
      >
        <div className="relative size-full">
          {images[index] && (
            <Image key={images[index]} src={images[index]} alt={`${name}, photo ${index + 1}`} fill sizes="94vw" className="animate-rise object-contain" />
          )}
          <p className="absolute top-4 left-4 rounded-full bg-ink/80 px-3 py-1 text-sm font-semibold">
            {index + 1} / {images.length}
          </p>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close photos"
            className="absolute top-3 right-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-paper text-ink transition-[background-color,scale] duration-200 ease-spring hover:bg-coral active:scale-90"
          >
            <CloseIcon />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="absolute top-[calc(50%-1.375rem)] left-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-paper text-ink transition-[background-color,scale] duration-200 ease-spring hover:bg-coral active:scale-90"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="absolute top-[calc(50%-1.375rem)] right-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-paper text-ink transition-[background-color,scale] duration-200 ease-spring hover:bg-coral active:scale-90"
              >
                <ChevronRightIcon />
              </button>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
