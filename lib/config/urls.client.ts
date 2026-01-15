// lib/config/urls.client.ts
import { publicEnv } from "./env.public";

const IS_DEV = process.env.NODE_ENV === "development";

export const urls = {
  site: (slug: string) =>
    IS_DEV
      ? `http://${slug}.lvh.me:3000`
      : `https://${slug}.${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}`,

  preview: (slug: string) =>
    IS_DEV
      ? `http://localhost:3000/preview/${slug}`
      : `https://${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}/preview/${slug}`,

  app: (path = "") =>
    IS_DEV
      ? `http://localhost:3000${path}`
      : `https://${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}${path}`,

  admin: (path = "") =>
    IS_DEV
      ? `http://localhost:3000/admin${path}`
      : `https://${publicEnv.NEXT_PUBLIC_ADMIN_SUBDOMAIN}.${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}${path}`,
};
