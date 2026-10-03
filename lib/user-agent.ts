/** Short, human-readable device summary from a User-Agent string, e.g. "Chrome on Android". */
export function describeUserAgent(ua: string | null | undefined): string {
  if (!ua) return "Unknown device";
  const browser =
    /SamsungBrowser/i.test(ua) ? "Samsung Internet"
    : /OPR\/|Opera/i.test(ua) ? "Opera"
    : /Edg\//i.test(ua) ? "Edge"
    : /Firefox\//i.test(ua) ? "Firefox"
    : /CriOS|Chrome\//i.test(ua) ? "Chrome"
    : /Safari\//i.test(ua) ? "Safari"
    : "Browser";
  const os =
    /Android/i.test(ua) ? "Android"
    : /iPhone|iPad|iPod/i.test(ua) ? "iOS"
    : /Windows/i.test(ua) ? "Windows"
    : /Mac OS X|Macintosh/i.test(ua) ? "macOS"
    : /Linux/i.test(ua) ? "Linux"
    : "unknown OS";
  return `${browser} on ${os}`;
}

/** Escape a CSV cell and neutralise spreadsheet formula injection (=, +, -, @). */
export function csvCell(value: unknown): string {
  let s = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
