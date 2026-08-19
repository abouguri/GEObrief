import { supabaseAdmin } from "./supabase";
import type { GeoBriefOutput } from "./ai";

export interface BriefRecord {
  id: string;
  user_id: string;
  keyword: string;
  website_url: string | null;
  niche: string | null;
  brief_data: GeoBriefOutput;
  brief_markdown: string;
  created_at: string;
}

/** Shape returned to the history list. Omits the heavy JSONB payload. */
export type BriefSummary = Pick<
  BriefRecord,
  "id" | "keyword" | "website_url" | "niche" | "created_at"
>;

export interface SaveBriefInput {
  userId: string;
  keyword: string;
  websiteUrl?: string;
  niche?: string;
  brief: GeoBriefOutput;
  briefMarkdown: string;
}

/**
 * Persist a generated brief so it shows up on the history page.
 *
 * Runs with the service role because it is called from the API route right
 * after generation. Returns the new row id, or null if the insert failed,
 * a storage failure should never discard a brief the user already paid a
 * model call for, so callers log and continue.
 */
export async function saveBrief(input: SaveBriefInput): Promise<string | null> {
  try {
    const client = supabaseAdmin();
    const { data, error } = await (client.from("briefs") as any)
      .insert({
        user_id: input.userId,
        keyword: input.keyword,
        website_url: input.websiteUrl ?? null,
        niche: input.niche ?? null,
        brief_data: input.brief,
        brief_markdown: input.briefMarkdown,
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("Brief save error:", error);
      return null;
    }

    return (data as { id: string }).id;
  } catch (error) {
    console.error("Brief save error:", error);
    return null;
  }
}
