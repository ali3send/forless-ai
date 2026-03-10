import { Mail, Phone, MessageCircle } from "lucide-react";

type Props = {
  type: "email" | "whatsapp" | "phone";
  value: string;
  textColor?: string;
  accentColor?: string;
};

const CONFIG = {
  email: {
    label: "Email",
    Icon: Mail,
    href: (v: string) => `mailto:${v}`,
  },
  phone: {
    label: "Phone",
    Icon: Phone,
    href: (v: string) => `tel:${v.replace(/\s+/g, "")}`,
  },
  whatsapp: {
    label: "WhatsApp",
    Icon: MessageCircle,
    href: (v: string) => `https://wa.me/${v.replace(/\D/g, "")}`,
  },
};

export function ContactRow({ type, value, textColor, accentColor }: Props) {
  const { label, Icon, href } = CONFIG[type];
  const link = href(value);

  return (
    <a
      href={link}
      className="
        group flex items-center gap-3
        text-sm
        transition
        hover:opacity-80
      "
      style={{ color: textColor || "var(--color-text)" }}
      target={type === "whatsapp" ? "_blank" : undefined}
      rel={type === "whatsapp" ? "noopener noreferrer" : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" style={{ color: accentColor || "var(--color-primary)" }} />

      <span style={{ color: textColor || "var(--color-muted)" }}>{label}:</span>

      <span className="font-medium truncate group-hover:underline">
        {value}
      </span>
    </a>
  );
}
