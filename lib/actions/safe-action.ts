import { unstable_isUnrecognizedActionError as isUnrecognizedActionError } from "next/navigation";
import type { ActionState } from "@/lib/actions/state";

export const STALE_MESSAGE = "This page is out of date because the site was just updated. Please reload the page and try again.";
export const FAILED_MESSAGE = "We couldn't send this — please check your connection and try again.";

/** Next.js control-flow errors (redirect / notFound) must keep propagating. */
function isNavigationError(e: unknown): boolean {
  const digest = (e as { digest?: unknown } | null)?.digest;
  return typeof digest === "string" && (digest.startsWith("NEXT_REDIRECT") || digest.startsWith("NEXT_HTTP_ERROR_FALLBACK"));
}

/**
 * Client-side wrapper for form actions used with useActionState. If the call
 * fails before the action can answer — the page was loaded from an older
 * deployment ("Server Action was not found"), the network dropped, or the
 * server crashed — show a recoverable message instead of failing silently.
 */
export function withRecovery<S extends ActionState>(action: (prev: S, formData: FormData) => Promise<S>) {
  return async (prev: S, formData: FormData): Promise<S> => {
    try {
      return await action(prev, formData);
    } catch (e) {
      if (isNavigationError(e)) throw e;
      const stale =
        isUnrecognizedActionError(e) ||
        (e instanceof Error && /server action/i.test(e.message) && /not found/i.test(e.message));
      return {
        ...prev,
        ok: false,
        message: undefined,
        // Keep what the user typed (React resets the form after submit). Never echo passwords.
        values: Object.fromEntries(
          [...formData.entries()].filter(([k, v]) => typeof v === "string" && !/password/i.test(k)),
        ) as Record<string, string>,
        errors: { form: stale ? STALE_MESSAGE : FAILED_MESSAGE },
        data: { ...prev.data, recoverable: stale ? "reload" : "retry" },
      } as S;
    }
  };
}
