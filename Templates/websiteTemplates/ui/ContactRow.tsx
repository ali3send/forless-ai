import { Mail, Phone, MessageCircle } from "lucide-react";

type Props = {
  type: "email" | "whatsapp" | "phone";
  value: string;
};

const CONFIG = {
  email: {
    label: "Email",
    Icon: Mail,
    iconColor: "var(--color-primary, #0149E1)",
    href: (v: string) => `mailto:${v}`,
  },
  phone: {
    label: "Phone",
    Icon: Phone,
    iconColor: "var(--color-primary, #0149E1)",
    href: (v: string) => `tel:${v.replace(/\s+/g, "")}`,
  },
  whatsapp: {
    label: "WhatsApp",
    Icon: MessageCircle,
    iconColor: "var(--color-primary, #0149E1)",
    href: (v: string) => `https://wa.me/${v.replace(/\D/g, "")}`,
  },
};

export function ContactRow({ type, value }: Props) {
  const { label, Icon, iconColor, href } = CONFIG[type];
  const link = href(value);

  return (
    <a
      href={link}
      className="group flex items-center gap-3 text-sm transition"
      target={type === "whatsapp" ? "_blank" : undefined}
      rel={type === "whatsapp" ? "noopener noreferrer" : undefined}
      style={{
      }}
    >
      <Icon className="h-4 w-4 shrink-0" style={{ color: iconColor }} />

      <span style={{ color: "var(--color-muted)" }}>{label}:</span>

      <span
        className="truncate font-medium group-hover:underline"
        style={{ color: "var(--color-text)" }}
      >
        {value}
      </span>
    </a>
  );
}
