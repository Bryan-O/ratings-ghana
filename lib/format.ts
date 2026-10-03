/** Reviewers are shown by first name only, to protect their privacy. */
export function displayName(name: string | null | undefined): string {
  return name?.trim().split(/\s+/)[0] || "Verified reviewer";
}

export function initials(name: string | null | undefined): string {
  return (name?.trim()[0] ?? "R").toUpperCase();
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Accra" });
}
