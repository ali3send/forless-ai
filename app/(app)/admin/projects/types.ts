export type AdminProject = {
  id: string;
  name: string | null;
  slug: string | null;
  user_id: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
};
