import { supabaseAdmin } from "./supabase";

export interface UserUsage {
  userId: string;
  usageCount: number;
  plan: "free" | "pro" | "annual";
  monthStart: string; // ISO date string
}

interface UserRecord {
  id: string;
  usage_count: number;
  plan: "free" | "pro" | "annual";
  usage_reset_date: string;
}

/**
 * Check and enforce usage limits for a user
 * Returns true if user can generate a brief, false if limit reached
 */
export async function checkUsageLimit(userId: string): Promise<boolean> {
  try {
    const client = supabaseAdmin();
    const { data: user, error } = await client
      .from("users")
      .select("usage_count, plan, usage_reset_date")
      .eq("id", userId)
      .single();

    if (error || !user) {
      throw new Error("User not found");
    }

    const userData = user as UserRecord;

    // Pro and annual users have unlimited briefs
    if (userData.plan === "pro" || userData.plan === "annual") {
      return true;
    }

    // Check if monthly reset is needed
    const resetDate = new Date(userData.usage_reset_date);
    const now = new Date();
    const isNewMonth = now > resetDate;

    if (isNewMonth) {
      // Reset usage count
      await client
        .from("users")
        .update({
          usage_count: 0,
          usage_reset_date: new Date(now.getFullYear(), now.getMonth() + 1, 1)
            .toISOString()
            .split("T")[0],
        } as any)
        .eq("id", userId);

      return true;
    }

    // Free plan: max 3 briefs per month
    return userData.usage_count < 3;
  } catch (error) {
    console.error("Usage check error:", error);
    throw error;
  }
}

/**
 * Increment usage count for a user
 */
export async function incrementUsage(userId: string): Promise<void> {
  try {
    const client = supabaseAdmin();
    const { data: user, error: fetchError } = await client
      .from("users")
      .select("usage_count")
      .eq("id", userId)
      .single();

    if (fetchError || !user) {
      throw new Error("User not found");
    }

    const userData = user as { usage_count: number };

    await client
      .from("users")
      .update({ usage_count: userData.usage_count + 1 } as any)
      .eq("id", userId);
  } catch (error) {
    console.error("Usage increment error:", error);
    throw error;
  }
}

/**
 * Get user's current usage stats
 */
export async function getUserUsageStats(userId: string): Promise<UserUsage> {
  try {
    const client = supabaseAdmin();
    const { data: user, error } = await client
      .from("users")
      .select("id, usage_count, plan, usage_reset_date")
      .eq("id", userId)
      .single();

    if (error || !user) {
      throw new Error("User not found");
    }

    const userData = user as UserRecord;

    return {
      userId: userData.id,
      usageCount: userData.usage_count,
      plan: userData.plan,
      monthStart: userData.usage_reset_date,
    };
  } catch (error) {
    console.error("Usage stats error:", error);
    throw error;
  }
}

/**
 * Reset usage for a specific user (admin function)
 */
export async function resetUserUsage(userId: string): Promise<void> {
  try {
    const client = supabaseAdmin();
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await client
      .from("users")
      .update({
        usage_count: 0,
        usage_reset_date: nextMonth.toISOString().split("T")[0],
      } as any)
      .eq("id", userId);
  } catch (error) {
    console.error("Usage reset error:", error);
    throw error;
  }
}
