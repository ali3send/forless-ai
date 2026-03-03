// // app/api/projects/[projectId]/websites/[websiteId]/route.ts

// import { NextResponse } from "next/server";
// import { createServerSupabaseClient } from "@/lib/supabase/server";

// export async function GET(
//   req: Request,
//   {
//     params,
//   }: {
//     params: { projectId: string; websiteId: string };
//   }
// ) {
//   const supabase = await createServerSupabaseClient();
//   console.log("API GET /projects/[projectId]/websites/[websiteId] called");

//   /* ──────────────────────────────
//      AUTH
//   ────────────────────────────── */
//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError || !user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { projectId, websiteId } = params;

//   /* ──────────────────────────────
//      FETCH WEBSITE
//   ────────────────────────────── */
//   const { data: websiteRow, error: websiteError } = await supabase
//     .from("websites")
//     .select(
//       `
//         id,
//         project_id,
//         user_id,
//         brand_id,
//         draft_data
//       `
//     )
//     .eq("id", websiteId)
//     .eq("project_id", projectId)
//     .eq("user_id", user.id)
//     .single();

//   if (websiteError || !websiteRow) {
//     return NextResponse.json({ error: "Website not found" }, { status: 404 });
//   }

//   let draftData: any = null;

//   try {
//     draftData =
//       typeof websiteRow.draft_data === "string"
//         ? JSON.parse(websiteRow.draft_data)
//         : websiteRow.draft_data;
//   } catch (err) {
//     return NextResponse.json(
//       { error: "Invalid draft_data JSON" },
//       { status: 500 }
//     );
//   }

//   let brand = null;

//   if (websiteRow.brand_id) {
//     const { data: brandRow } = await supabase
//       .from("brands")
//       .select("*")
//       .eq("id", websiteRow.brand_id)
//       .single();

//     brand = brandRow ?? null;
//   }

//   /* ──────────────────────────────
//      RESPONSE
//   ────────────────────────────── */
//   return NextResponse.json({
//     website: {
//       id: websiteRow.id,
//       draft_data: draftData,
//       brand_id: websiteRow.brand_id,
//     },
//     brand,
//   });
// }

export async function GET() {
  return new Response("Hello, this is a placeholder for the GET endpoint.");
}
