import type { FieldErrors } from "@/lib/validation";

export type ActionState = {
  ok?: boolean;
  message?: string;
  errors?: FieldErrors;
  /** Echo of submitted values so forms can repopulate after an error. */
  values?: Record<string, string>;
  /** Extra data some forms need (e.g. which phone an OTP was sent to). */
  data?: Record<string, string>;
};

export const initialState: ActionState = {};

export function formValues(formData: FormData, keys: string[]): Record<string, string> {
  return Object.fromEntries(keys.map((k) => [k, String(formData.get(k) ?? "")]));
}

/** Only allow same-site relative redirects. */
export function safeNext(next: FormDataEntryValue | string | null | undefined, fallback = "/"): string {
  const v = typeof next === "string" ? next : "";
  return v.startsWith("/") && !v.startsWith("//") && !v.startsWith("/\\") ? v : fallback;
}
