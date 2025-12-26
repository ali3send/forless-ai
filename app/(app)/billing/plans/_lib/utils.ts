export function cx(...s: Array<string | false | undefined | null>) {
  return s.filter(Boolean).join(" ");
}

export const PROFILE_CACHE_KEY = "billing_profile_cache_v1";
