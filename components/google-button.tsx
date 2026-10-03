import { googleSignInAction } from "@/lib/actions/auth";
import { googleEnabled } from "@/lib/auth";
import { socialBtn } from "@/components/auth-card";
import { GoogleIcon } from "@/components/icons";

export function GoogleButton({ next }: { next?: string }) {
  if (!googleEnabled) return null;
  return (
    <form action={googleSignInAction}>
      <input type="hidden" name="next" value={next ?? "/"} />
      <button type="submit" className={socialBtn}>
        <GoogleIcon /> Continue with Google
      </button>
    </form>
  );
}
