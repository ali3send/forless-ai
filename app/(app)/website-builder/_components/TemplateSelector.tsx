"use client";

import { useState, useRef, useEffect } from "react";
import {
  TemplateKey,
  WEBSITE_TEMPLATES,
} from "@/components/websiteTemplates/templates";
import { useWebsiteStore } from "@/store/website.store";

export default function TemplateSelector() {
  const { data, setData } = useWebsiteStore();
  const active = data.template ?? "template1";

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative space-y-1.5">
      <span className="text-[11px] font-semibold text-secondary tracking-widest uppercase">
        Template
      </span>

      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex w-full items-center justify-between
          rounded-md border border-secondary-fade
          bg-secondary-soft px-2.5 py-1.5
          text-[11px] font-medium text-secondary-dark
          transition hover:bg-secondary-soft
        "
      >
        <span className="truncate">{WEBSITE_TEMPLATES[active].name}</span>
        <span className="text-secondary">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute z-50 mt-1 w-full
            rounded-md 
            bg-secondary-soft
          "
        >
          <div className="py-1">
            {(Object.keys(WEBSITE_TEMPLATES) as TemplateKey[]).map((key) => {
              const isActive = key === active;

              return (
                <button
                  key={key}
                  onClick={() => {
                    setData({ ...data, template: key });
                    setOpen(false);
                  }}
                  className={`
                    flex w-full items-center justify-between
                    px-2.5 py-1.5 text-left text-[11px]
                    transition
                    ${
                      isActive
                        ? "border rounded-md border-primary bg-primary-hover/20"
                        : "text-secondary-dark hover:bg-secondary-light"
                    }
                  `}
                >
                  <span className="truncate">
                    {WEBSITE_TEMPLATES[key].name}
                  </span>

                  {isActive && <span className="text-primary-active">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
