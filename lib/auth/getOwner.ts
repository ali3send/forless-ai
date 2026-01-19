import { z } from "zod";
export type Owner =
  | { type: "user"; userId: string }
  | { type: "guest"; guestId: string };

const GuestIdSchema = z.uuid();

export async function getOwner(req: Request, supabase: any): Promise<Owner> {
  // 1️⃣ Authenticated user always wins
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user && !error) {
    return { type: "user", userId: user.id };
  }

  const rawGuestId = req.headers.get("x-guest-id");

  if (rawGuestId) {
    const parsed = GuestIdSchema.safeParse(rawGuestId);
    if (!parsed.success) {
      throw new Error("Invalid guest id");
    }

    return { type: "guest", guestId: parsed.data };
  }

  throw new Error("Unauthorized");
}
