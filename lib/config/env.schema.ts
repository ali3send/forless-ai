import { z } from "zod";

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).optional(),
  APP_ENV: z.enum(["development", "preview", "production"]),

  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),

  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),

  STRIPE_PRICE_GO: z.string().min(1),
  STRIPE_PRICE_GO_YEARLY: z.string().min(1),

  STRIPE_PRICE_CREATOR: z.string().min(1),
  STRIPE_PRICE_CREATOR_YEARLY: z.string().min(1),

  STRIPE_PRICE_PRO: z.string().min(1),
  STRIPE_PRICE_PRO_YEARLY: z.string().min(1),
});

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_ROOT_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_APP_SUBDOMAIN: z.string().min(1),
  NEXT_PUBLIC_ADMIN_SUBDOMAIN: z.string().min(1),

  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  NEXT_PUBLIC_UNSPLASH_ACCESS_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
});
