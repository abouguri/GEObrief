import { supabaseAdmin } from "./supabase";

export interface UserUsage {
  userId: string;
  usageCount: number;
  plan: "free" | "pro" | "lifetime";
  monthStart: string; // ISO date string
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

    // Pro and lifetime users have unlimited briefs
    if (user.plan === "pro" || user.plan === "lifetime") {
      return true;
    }

    // Check if monthly reset is needed
    const resetDate = new Date(user.usage_reset_date);
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
        })
        .eq("id", userId);

      return true;
    }

    // Free plan: max 3 briefs per month
    return user.usage_count < 3;
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

    await client
      .from("users")
      .update({ usage_count: user.usage_count + 1 })
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

    return {
      userId: user.id,
      usageCount: user.usage_count,
      plan: user.plan,
      monthStart: user.usage_reset_date,
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
      })
      .eq("id", userId);
  } catch (error) {
    console.error("Usage reset error:", error);
    throw error;
  }
}
