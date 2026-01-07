import { publicEnv } from "./env.public";
import { serverEnv } from "./env.server";

const IS_DEV = serverEnv.APP_ENV === "development";

export const urls = {
  site: (slug: string) =>
    IS_DEV
      ? `http://${slug}.lvh.me:3000`
      : `https://${slug}.${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}`,

  app: (path = "") =>
    IS_DEV
      ? `http://localhost:3000${path}`
      : `https://${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}${path}`,

  admin: (path = "") =>
    IS_DEV
      ? `http://localhost:3000/admin${path}`
      : `https://${publicEnv.NEXT_PUBLIC_ADMIN_SUBDOMAIN}.${publicEnv.NEXT_PUBLIC_ROOT_DOMAIN}${path}`,
};
