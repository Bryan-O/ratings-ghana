// Ghana mobile numbers: +233 followed by 9 digits whose first two digits are a
// mobile network prefix (MTN, Telecel, AirtelTigo).
const GH_MOBILE_PREFIXES = new Set([
  "20", "23", "24", "25", "26", "27", "28", "50", "53", "54", "55", "56", "57", "59",
]);

/**
 * Normalise user input like "024 123 4567", "+233 24-123-4567" or
 * "233241234567" to E.164 ("+233241234567"). Returns null if the input is not
 * a valid Ghana mobile number.
 */
export function normalizeGhanaPhone(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, "");
  let national: string;

  if (/^\+233\d{9}$/.test(digits)) national = digits.slice(4);
  else if (/^233\d{9}$/.test(digits)) national = digits.slice(3);
  else if (/^0\d{9}$/.test(digits)) national = digits.slice(1);
  else if (/^\d{9}$/.test(digits)) national = digits;
  else return null;

  if (!GH_MOBILE_PREFIXES.has(national.slice(0, 2))) return null;
  return `+233${national}`;
}

/** "+233241234567" -> "+233 24 123 4567" */
export function formatGhanaPhone(e164: string): string {
  const m = /^\+233(\d{2})(\d{3})(\d{4})$/.exec(e164);
  return m ? `+233 ${m[1]} ${m[2]} ${m[3]}` : e164;
}

/** "+233241234567" -> "+233 24 *** 4567" for showing which number a code went to. */
export function maskGhanaPhone(e164: string): string {
  const m = /^\+233(\d{2})\d{3}(\d{4})$/.exec(e164);
  return m ? `+233 ${m[1]} *** ${m[2]}` : e164;
}
