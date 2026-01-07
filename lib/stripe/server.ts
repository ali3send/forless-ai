import { serverEnv } from "./../config/env.server";
// lib/stripe/server.ts
import Stripe from "stripe";

const key = serverEnv.STRIPE_SECRET_KEY;
if (!key) throw new Error("Missing STRIPE_SECRET_KEY");

export const stripe = new Stripe(key, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});
