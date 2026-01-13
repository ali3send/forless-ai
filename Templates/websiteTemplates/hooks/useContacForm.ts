"use client";

import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { useState } from "react";

export function useContactForm(projectId: string) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(form: HTMLFormElement) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");

      setSuccess(true);
      form.reset();

      uiToast.success("Message sent successfully");
    } catch (e: unknown) {
      const msg = getErrorMessage(e, "Failed to send message");
      setError(msg);
      uiToast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, success, error };
}
