import { unstable_rethrow } from "next/navigation";
import type { ActionState } from "@/lib/actions/state";

/**
 * Server-side wrapper for form actions: logs unexpected failures with context
 * (visible in the Vercel function logs) and returns a visible form error
 * instead of crashing the page. Redirects and other Next.js control flow pass through.
 */
export function guard(name: string, action: (prev: ActionState, formData: FormData) => Promise<ActionState>) {
  return async (prev: ActionState, formData: FormData): Promise<ActionState> => {
    try {
      return await action(prev, formData);
    } catch (e) {
      unstable_rethrow(e);
      console.error(`[action:${name}] failed`, e);
      return { errors: { form: "Something went wrong on our side. Please try again in a moment." } };
    }
  };
}
