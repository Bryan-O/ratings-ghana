// Inline SVG icons in the Lucide style (24×24, 2px stroke) so the set stays consistent.
type IconProps = { className?: string; size?: number };

function Stroke({ className, size = 20, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

export function StarIcon({ className, size = 18, filled = true }: IconProps & { filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        d={STAR}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.6}
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Stroke>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m6 9 6 6 6-6" />
  </Stroke>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m15 18-6-6 6-6" />
  </Stroke>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m9 18 6-6-6-6" />
  </Stroke>
);

export const ShareIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
    <path d="m16 6-4-4-4 4" />
    <path d="M12 2v13" />
  </Stroke>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Stroke>
);

export const LocationIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Stroke>
);

export const PhoneIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2" />
  </Stroke>
);

export const GlobeIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10" />
  </Stroke>
);

export const MenuIcon = (p: IconProps) => (
  <Stroke size={24} {...p}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </Stroke>
);

export const CloseIcon = (p: IconProps) => (
  <Stroke size={24} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Stroke>
);

export const MailIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </Stroke>
);

export const CheckIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Stroke>
);

export const ShieldCheckIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </Stroke>
);

export const BadgeCheckIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76" />
    <path d="m9 12 2 2 4-4" />
  </Stroke>
);

export const SmartphoneIcon = (p: IconProps) => (
  <Stroke {...p}>
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M12 18h.01" />
  </Stroke>
);

export const FlagIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7" />
  </Stroke>
);

export const PlusIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M12 5v14M5 12h14" />
  </Stroke>
);

export const UserIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </Stroke>
);

export const StoreIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m2 7 1.6-3.2A2 2 0 0 1 5.4 3h13.2a2 2 0 0 1 1.8 1.1L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M2 7h20v2a3 3 0 0 1-5.5 1.6A3 3 0 0 1 12 12a3 3 0 0 1-4.5-1.4A3 3 0 0 1 2 9z" />
  </Stroke>
);

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

/** Brand mark: white star in a rounded purple square. */
// Geometric five-pointed star (sharp points, never rounded), shared by the logo and ratings.
const STAR = "M12 1.5l3.09 6.26 6.91 1-5 4.88 1.18 6.88L12 17.27l-6.18 3.25L7 13.64 2 8.76l6.91-1z";

/**
 * The mark: a bold speech bubble whose corner resolves into a coral star.
 * `mono` draws it in one colour (all-white on dark, all-ink on light); `bg` is the
 * surface colour, used to cut the star out of the bubble. Never rotate or recolour it.
 */
export function LogoMark({
  className = "",
  size = 32,
  mono = false,
  bg = "#fff",
}: IconProps & { mono?: boolean; bg?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden className={className}>
      <path fill="currentColor" d="M7 3h17a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5H13.5L7 28.5V22a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5z" />
      <path
        d={STAR}
        transform="translate(19.2 15.4) scale(0.58)"
        fill={mono ? "currentColor" : "#ff4d5e"}
        stroke={bg}
        strokeWidth={2.6}
        strokeLinejoin="miter"
        paintOrder="stroke"
      />
    </svg>
  );
}

// --- Category icons ---

const CATEGORY_PATHS: Record<string, React.ReactNode> = {
  Restaurant: (
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
    </>
  ),
  "Fast Food": (
    <>
      <path d="M4 11a8 6 0 0 1 16 0z" />
      <path d="M3 15h18M5 19h14a1 1 0 0 0 1-1v-1H4v1a1 1 0 0 0 1 1" />
    </>
  ),
  Hotel: (
    <>
      <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />
    </>
  ),
  "Bar & Lounge": (
    <>
      <path d="M8 22h8M12 11v11M5 3h14l-1.5 5.5a5.7 5.7 0 0 1-11 0z" />
    </>
  ),
  "Online Store": (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  Electronics: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  Fashion: (
    <>
      <path d="M20.4 3.5 16 2a4 4 0 0 1-8 0L3.6 3.5a2 2 0 0 0-1.3 2.2l.6 3.5a1 1 0 0 0 1 .8H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.2a1 1 0 0 0 1-.8l.6-3.5a2 2 0 0 0-1.4-2.2" />
    </>
  ),
  "Beauty & Salon": (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
    </>
  ),
  Telecom: (
    <>
      <path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16" />
    </>
  ),
  "Bank & Fintech": (
    <>
      <path d="M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z" />
    </>
  ),
  "Transport & Delivery": (
    <>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4A1 1 0 0 0 17.5 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </>
  ),
  Health: (
    <>
      <path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z" />
      <path d="M3.2 12H9l.5-1 2 4.5 2-7 1.5 3.5h5.3" />
    </>
  ),
  Education: (
    <>
      <path d="M22 10 12 5 2 10l10 5z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
    </>
  ),
};

export function CategoryIcon({ category, className, size = 22 }: IconProps & { category: string }) {
  return (
    <Stroke className={className} size={size}>
      {CATEGORY_PATHS[category] ?? (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </>
      )}
    </Stroke>
  );
}

export const AlertIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3" />
    <path d="M12 9v4M12 17h.01" />
  </Stroke>
);

export const ClockIcon = (p: IconProps) => (
  <Stroke {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Stroke>
);

export const MessageIcon = (p: IconProps) => (
  <Stroke {...p}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z" />
    <path d="M8 10h8M8 14h5" />
  </Stroke>
);
