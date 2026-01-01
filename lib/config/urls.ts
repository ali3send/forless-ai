// lib/config/urls.ts
import { publicEnv } from "./env.public";
import { serverEnv } from "./env.server";

const IS_DEV = serverEnv.APP_ENV === "development";
const PROTOCOL = IS_DEV ? "http" : "https";
const PORT = IS_DEV ? ":3000" : "";

export const urls = {
  site: (slug: string) =>
    `${PROTOCOL}://${slug}.${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}${PORT}`,

  app: (path = "") =>
    `${PROTOCOL}://${publicEnv.NEXT_PUBLIC_APP_SUBDOMAIN}.${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}${PORT}${path}`,

  admin: (path = "") =>
    `${PROTOCOL}://${publicEnv.NEXT_PUBLIC_ADMIN_SUBDOMAIN}.${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}${PORT}${path}`,
};
