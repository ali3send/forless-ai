// lib/guest/guest.ts
import { v4 as uuidv4 } from "uuid";

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") {
    throw new Error("getOrCreateGuestId must be called on the client");
  }

  const key = "guest_id";
  let id = localStorage.getItem(key);

  if (!id) {
    id = uuidv4();
    localStorage.setItem(key, id);
  }

  return id;
}
