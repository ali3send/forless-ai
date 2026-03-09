"use client";

import { useEffect } from "react";

export function GoogleFontLoader({ fontFamily }: { fontFamily: string }) {
  useEffect(() => {
    const family = fontFamily.replace(/ /g, "+");
    const href = `https://fonts.googleapis.com/css2?family=${family}:wght@300;400;500;600;700&display=swap`;

    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [fontFamily]);

  return null;
}
