export type PlanKey = "free" | "gowebsite" | "creator" | "pro";

export const PLAN_LIMITS: Record<PlanKey, Record<string, number>> = {
  free: {
    website_generate: 1,
    website_regen: 0,
    websites_published: 0,
    projects: 1,
  },
  gowebsite: {
    website_generate: 1,
    website_regen: 10,
    websites_published: 1,
    projects: 1,
  },
  creator: {
    website_generate: 3,
    website_regen: 3,
    websites_published: 1,
    // projects: 10,
    projects: 5,
  },
  pro: {
    website_generate: 20,
    website_regen: 10,
    websites_published: 5,
    projects: 20,
  },
};
