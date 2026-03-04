"use client";

import { useState, FormEvent } from "react";

type Props = {
  onCancel?: () => void;
  onSuccess?: () => void;
  compact?: boolean;
};

export function AddTemplateForm({
  onCancel,
  onSuccess,
  compact = false,
}: Props) {
  const [name, setName] = useState("");
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: send to API / DB later
    setSubmitted(true);
    onSuccess?.();
  };

  const isLarge = !compact;
  const textareaClass = isLarge
    ? "input-base w-full font-mono text-sm min-h-[50vh] resize-y"
    : "input-base w-full font-mono text-xs min-h-[120px]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium text-secondary hover:text-primary"
        >
          ← Back to templates
        </button>
      )}

      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold text-secondary tracking-widest uppercase">
          Template name (optional)
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Landing v1"
          className="input-base w-full text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold text-secondary tracking-widest uppercase">
          HTML
        </span>
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          placeholder="<div>...</div>"
          rows={isLarge ? 24 : 6}
          className={textareaClass}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold text-secondary tracking-widest uppercase">
          CSS
        </span>
        <textarea
          value={css}
          onChange={(e) => setCss(e.target.value)}
          placeholder=".container { ... }"
          rows={isLarge ? 24 : 6}
          className={textareaClass}
        />
      </label>

      {submitted && (
        <div className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs text-primary-dark">
          Template received. DB save will be wired up next.
        </div>
      )}

      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-secondary-fade bg-white px-3 py-2 text-xs font-medium text-secondary-dark hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary-hover transition"
        >
          Save template
        </button>
      </div>
    </form>
  );
}
