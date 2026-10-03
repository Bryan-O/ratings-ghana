"use client";

import { useFormStatus } from "react-dom";
import { btn } from "@/components/ui";

export function SubmitButton({
  children,
  pendingText,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "cta";
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-disabled={pending} className={`${btn[variant]} w-full ${className}`}>
      {pending && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      {pending ? (pendingText ?? "Please wait…") : children}
    </button>
  );
}
