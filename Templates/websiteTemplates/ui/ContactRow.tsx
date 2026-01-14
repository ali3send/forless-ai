import { Mail, Phone, MessageCircle } from "lucide-react";

type Props = {
  type: "email" | "whatsapp" | "phone";
  value: string;
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

export function ContactRow({ type, value }: Props) {
  const { label, Icon, href } = CONFIG[type];
  const link = href(value);

  return (
    <a
      href={link}
      className="
        group flex items-center gap-3
        text-sm text-text
        transition
        hover:text-primary
      "
      target={type === "whatsapp" ? "_blank" : undefined}
      rel={type === "whatsapp" ? "noopener noreferrer" : undefined}
    >
      <Icon className="h-4 w-4 text-primary shrink-0" />

      <span className="text-(--color-muted)">{label}:</span>

      <span className="font-medium truncate group-hover:underline">
        {value}
      </span>
    </a>
  );
}
