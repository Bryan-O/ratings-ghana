import Link from "next/link";
import { UserCircleIcon } from "@/components/icons";

/** Figma Login/Register: dark backdrop with a centred white card. */
export function AuthCard({ title, children, footer }: { title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-backdrop">
      <Link href="/" className="px-4 pt-5 text-lg tracking-wide text-white/80 hover:text-white lg:px-12">
        RATINGS GHANA
      </Link>
      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:items-center">
        <div className="w-full max-w-[438px] rounded-[2px] bg-white px-6 py-8 sm:px-9">
          <div className="flex flex-col items-center text-center">
            <UserCircleIcon />
            <h1 className="mt-5 text-lg font-medium text-[#b0b0b0]">{title}</h1>
          </div>
          <div className="mt-5">{children}</div>
          {footer && <div className="mt-6 border-t border-[#d9d9d9] pt-4 text-center text-xs text-[#888]">{footer}</div>}
        </div>
      </main>
    </div>
  );
}

export function Terms() {
  return (
    <p className="text-center text-xs text-[#888]">
      By proceeding, you agree to RatingsGhana&apos;s <span className="font-semibold text-ink">Terms of Service</span> and acknowledge
      RatingsGhana&apos;s <span className="font-semibold text-ink">Privacy Policy</span>.
    </p>
  );
}

export const socialBtn =
  "flex h-11 w-full items-center gap-4 rounded-[2px] border border-[#cfcfcf] bg-white px-3 text-base font-medium text-ink hover:bg-[#f6f6f6]";

export function OrDivider() {
  return (
    <div className="my-5 flex items-center gap-4 text-sm font-medium text-ink" role="separator">
      <span className="h-0.5 flex-1 bg-[#d0d0d0]" />
      or
      <span className="h-0.5 flex-1 bg-[#d0d0d0]" />
    </div>
  );
}
