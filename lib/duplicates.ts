// Pure helpers for spotting likely duplicate business listings.

// Generic words that don't identify a business ("Drezzup Stores" ≈ "Drezzup Sneakers").
const STOPWORDS = new Set([
  "the", "and", "of", "at", "in", "&",
  "ltd", "limited", "llc", "inc", "co", "company", "enterprise", "enterprises", "ventures",
  "group", "services", "store", "stores", "shop", "shops", "online", "official",
  "gh", "ghana", "accra", "kumasi", "branch",
]);

export function nameTokens(name: string): string[] {
  const tokens = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
  return [...new Set(tokens)];
}

/** Share of the shorter name's identifying words that appear in the other name (0–1). */
export function nameSimilarity(a: string, b: string): number {
  const ta = nameTokens(a);
  const tb = new Set(nameTokens(b));
  if (ta.length === 0 || tb.size === 0) return 0;
  const shared = ta.filter((t) => tb.has(t)).length;
  return shared / Math.min(ta.length, tb.size);
}

const SOCIAL_HOSTS = new Set(["instagram.com", "facebook.com", "tiktok.com", "x.com", "twitter.com", "wa.me"]);

/**
 * A comparable key for a website: the bare domain for normal sites, or
 * "instagram.com/handle" for social pages (where the domain alone means nothing).
 */
export function websiteKey(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    const host = u.hostname.toLowerCase().replace(/^(www\.|m\.|web\.)/, "");
    if (SOCIAL_HOSTS.has(host)) {
      const handle = u.pathname.split("/").filter(Boolean)[0]?.replace(/^@/, "").toLowerCase();
      return handle ? `${host}/${handle}` : null;
    }
    return host;
  } catch {
    return null;
  }
}

export type DuplicateCandidate = { id: string; name: string; website: string | null };

export type DuplicateMatch<T extends DuplicateCandidate> = T & { reason: "same-website" | "similar-name"; score: number };

/** Rank candidates against a business; keeps same-website matches and names ≥ 50% similar. */
export function rankDuplicates<T extends DuplicateCandidate>(
  business: { id: string; name: string; website: string | null },
  candidates: T[],
  limit = 3,
): DuplicateMatch<T>[] {
  const key = websiteKey(business.website);
  return candidates
    .filter((c) => c.id !== business.id)
    .map((c) => {
      if (key && websiteKey(c.website) === key) return { ...c, reason: "same-website" as const, score: 1.01 };
      return { ...c, reason: "similar-name" as const, score: nameSimilarity(business.name, c.name) };
    })
    .filter((m) => m.score >= 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
