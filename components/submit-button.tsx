"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText,
  className = "",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={`flex h-[45px] w-full items-center justify-center rounded-[4px] bg-btn-dark px-3 text-sm font-semibold text-white hover:bg-black disabled:opacity-60 ${className}`}
    >
      {pending ? (pendingText ?? "Please wait…") : children}
    </button>
  );
}
