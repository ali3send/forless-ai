import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

type ConfirmBase = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

export const uiToast = {
  /* ---------------- basic ---------------- */

  success(message: string) {
    return toast.success(message);
  },

  error(error: unknown, fallback = "Something went wrong") {
    return toast.error(getErrorMessage(error, fallback));
  },

  loading(message: string) {
    return toast.loading(message);
  },
  warning(message: string) {
    return toast.warning(message);
  },
  dismiss(id?: string | number) {
    toast.dismiss(id);
  },

  /* ---------------- confirm (no input) ---------------- */

  confirm({
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = false,
    onConfirm,
  }: ConfirmBase & { onConfirm: () => void | Promise<void> }) {
    const id = toast.error(title, {
      description,
      duration: Infinity,
      action: {
        label: confirmLabel,
        onClick: () => {
          toast.dismiss(id);
          void onConfirm();
        },
      },
      cancel: {
        label: cancelLabel,
        onClick: () => {
          toast.dismiss(id);
        },
      },
      classNames: {
        actionButton: destructive
          ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
          : "bg-primary/10 text-primary hover:bg-primary/20",
      },
    });

    return id;
  },

  /* ---------------- confirm WITH input ---------------- */

  confirmWithInput({
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    destructive = false,
    placeholder = "Optional reason",
    onConfirm,
  }: ConfirmBase & {
    placeholder?: string;
    onConfirm: (value?: string) => void | Promise<void>;
  }) {
    let value = "";

    const id = toast.error(title, {
      icon: null,
      duration: Infinity,
      description: (
        <div className="space-y-2">
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}

          <input
            autoFocus
            className="
              w-full rounded-md border
              px-3 py-2 text-sm outline-none
              bg-background
            "
            placeholder={placeholder}
            onChange={(e) => {
              value = e.target.value;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                toast.dismiss(id);
                onConfirm(value.trim() || undefined);
              }
            }}
          />
        </div>
      ),

      action: {
        label: confirmLabel,
        onClick: () => {
          toast.dismiss(id);
          onConfirm(value.trim() || undefined);
        },
      },

      cancel: {
        label: cancelLabel,
        onClick: () => {
          toast.dismiss(id);
        },
      },

      classNames: destructive
        ? {
            actionButton: "bg-red-600 text-white hover:bg-red-700",
          }
        : undefined,
    });

    return id;
  },
};
