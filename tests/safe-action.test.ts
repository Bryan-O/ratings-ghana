import { describe, expect, it } from "vitest";
import { FAILED_MESSAGE, STALE_MESSAGE, withRecovery } from "@/lib/actions/safe-action";
import type { ActionState } from "@/lib/actions/state";

const fd = () => {
  const f = new FormData();
  f.set("name", "Drezzup Sneakers");
  f.set("password", "secret123");
  return f;
};

describe("withRecovery", () => {
  it("passes successful results through", async () => {
    const action = withRecovery(async () => ({ ok: true, message: "done" }) as ActionState);
    expect(await action({}, fd())).toEqual({ ok: true, message: "done" });
  });

  it("turns a missing Server Action (stale deployment) into a reload message and keeps typed values", async () => {
    const action = withRecovery(async (): Promise<ActionState> => {
      throw new Error('Server Action "abc" was not found on the server.');
    });
    const res = await action({}, fd());
    expect(res.errors?.form).toBe(STALE_MESSAGE);
    expect(res.values).toEqual({ name: "Drezzup Sneakers" }); // password never echoed
  });

  it("turns network/server failures into a retry message", async () => {
    const action = withRecovery(async (): Promise<ActionState> => {
      throw new TypeError("Failed to fetch");
    });
    expect((await action({}, fd())).errors?.form).toBe(FAILED_MESSAGE);
  });

  it("lets Next.js redirects propagate", async () => {
    const redirect = Object.assign(new Error("NEXT_REDIRECT"), { digest: "NEXT_REDIRECT;replace;/;307;" });
    const action = withRecovery(async (): Promise<ActionState> => {
      throw redirect;
    });
    await expect(action({}, fd())).rejects.toBe(redirect);
  });
});
