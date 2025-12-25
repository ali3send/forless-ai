import React from "react";

export function Menu({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="relative">
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-2 z-50 w-56 rounded-xl border border-secondary-active bg-bg shadow-lg">
        {children}
      </div>
    </div>
  );
}
