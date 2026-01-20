"use client";

import { useEffect } from "react";
import { getOrCreateGuestId } from "@/lib/guest/guest";

export function GuestInit() {
  useEffect(() => {
    getOrCreateGuestId();
  }, []);

  return null;
}
