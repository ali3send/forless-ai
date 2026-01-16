// lib/auth/getOwner.ts
export async function getOwner(req: Request, supabase: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return { type: "user", id: user.id };
  }

  const guestId = req.headers.get("x-guest-id");
  if (guestId) {
    return { type: "guest", id: guestId };
  }

  throw new Error("Unauthorized");
}
