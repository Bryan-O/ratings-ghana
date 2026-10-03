// Inline equivalents of the Iconify icons used in the Figma file.
type IconProps = { className?: string; size?: number };

export function StarIcon({ className, size = 18, filled = true }: IconProps & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d="M12 17.27 6.62 20.5a.75.75 0 0 1-1.12-.81l1.43-6.12-4.75-4.12a.75.75 0 0 1 .43-1.31l6.26-.53 2.44-5.78a.75.75 0 0 1 1.38 0l2.44 5.78 6.26.53a.75.75 0 0 1 .43 1.31l-4.75 4.12 1.43 6.12a.75.75 0 0 1-1.12.81z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function ChevronDownIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

export function LocationIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
      <path fill="currentColor" d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 5.16 6.32 11.5 6.6 11.77a1.25 1.25 0 0 0 1.8 0c.28-.27 6.6-6.61 6.6-11.77A7.5 7.5 0 0 0 12 2m0 10.25a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5" />
    </svg>
  );
}

export function PhoneIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
      <path fill="currentColor" d="m7.4 2.6 1.6 3.7a1.5 1.5 0 0 1-.4 1.7L7 9.4a11 11 0 0 0 7.6 7.6l1.4-1.6a1.5 1.5 0 0 1 1.7-.4l3.7 1.6a1.5 1.5 0 0 1 .8 1.9l-.9 2.4A2 2 0 0 1 19.4 22C10 21.5 2.5 14 2 4.6A2 2 0 0 1 3.1 2.7L5.5 1.8a1.5 1.5 0 0 1 1.9.8" />
    </svg>
  );
}

export function GlobeIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3" />
    </svg>
  );
}

export function MenuIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className, size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function MailIcon({ className, size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" aria-hidden className={className}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}

export function GoogleIcon({ className, size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38" />
    </svg>
  );
}

export function UserCircleIcon({ className, size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden className={className}>
      <circle cx="28" cy="28" r="28" fill="#e6e6e6" />
      <circle cx="28" cy="21" r="8" fill="#1e1e1e" />
      <path d="M12 44c2.5-7 9-10.5 16-10.5S41.5 37 44 44a24 24 0 0 1-32 0" fill="#1e1e1e" />
    </svg>
  );
}

export function ShieldCheckIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" />
      <path d="m8.8 12.2 2.3 2.3 4.2-4.6" />
    </svg>
  );
}
