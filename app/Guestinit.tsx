"use client";

import { useEffect } from "react";
import { getOrCreateGuestId } from "@/lib/guest/guest";

export function GuestInit() {
  useEffect(() => {
    // Ensures guest_id exists in localStorage + cookie
    getOrCreateGuestId();
  }, []);

  return null;
}
