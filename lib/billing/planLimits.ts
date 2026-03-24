export type PlanKey = "free" | "gowebsite" | "creator";

export const PLAN_LIMITS: Record<PlanKey, Record<string, number>> = {
  free: {
    website_generate: 1,
    website_regen: 0,
    websites_published: 0,
    projects: 1,
  },
  gowebsite: {
    website_generate: 2,
    website_regen: 10,
    websites_published: 2,
    projects: 2,
  },
  creator: {
    website_generate: 3,
    website_regen: 10,
    websites_published: 3,
    projects: 5,
  },
};
