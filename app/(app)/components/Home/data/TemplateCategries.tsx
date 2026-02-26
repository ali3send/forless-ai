export type TemplateCategory = {
  id: string;
  title: string;
  image?: string;
};

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: "service", title: "Service Business Website", image: "/AI.jpeg" },
  { id: "local", title: "Local Business Website", image: "/AI.jpeg" },
  { id: "portfolio", title: "Professional / Portfolio Website", image: "/AI.jpeg" },
  { id: "booking", title: "Booking / Appointment Website", image: "/AI.jpeg" },
  { id: "company", title: "Business / Company Website", image: "/AI.jpeg" },
  { id: "landing", title: "Landing Page", image: "/AI.jpeg" },
];
