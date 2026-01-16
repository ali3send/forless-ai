// lib/guest/guest.ts

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") {
    throw new Error("getOrCreateGuestId must be called on the client");
  }

  let id = localStorage.getItem("guest_id");

  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("guest_id", id);
  }

  return id;
}
