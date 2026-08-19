import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

/**
 * Gumroad Ping receiver: POST /api/webhooks/gumroad?secret=<GUMROAD_SECRET_KEY>
 *
 * Authentication note: Gumroad Ping does not HMAC-sign its requests, so there
 * is no signature to verify. The supported approach is a shared secret carried
 * in the ping URL (configured in Gumroad Settings -> Advanced -> Ping), which
 * we compare in constant time and back up with a seller_id check. Keep the
 * ping URL secret. It is the credential.
 *
 * Gumroad posts application/x-www-form-urlencoded, not JSON.
 */

interface PlanUpdate {
  plan: "free" | "pro" | "annual";
  gumroad_sale_id?: string | null;
  gumroad_subscription_id?: string | null;
  plan_updated_at: string;
  usage_count?: number;
}

/** Compare two secrets without leaking length or content through timing. */
function secretMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);

  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

function isTruthy(value: string | null): boolean {
  return value === "true" || value === "1";
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const expectedSecret = process.env.GUMROAD_SECRET_KEY;

  if (!expectedSecret) {
    console.error("GUMROAD_SECRET_KEY is not configured; rejecting ping.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  // Accept the secret from the query string (Gumroad's ping URL) or a header,
  // whichever the seller configured.
  const provided =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("x-gumroad-secret");

  if (!secretMatches(provided, expectedSecret)) {
    return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const field = (name: string): string | null => {
      const value = form.get(name);
      return typeof value === "string" ? value : null;
    };

    // Optional second check: ignore pings from any other seller account.
    const expectedSeller = process.env.GUMROAD_SELLER_ID;
    const sellerId = field("seller_id");
    if (expectedSeller && sellerId && sellerId !== expectedSeller) {
      console.warn("Ignoring Gumroad ping from unexpected seller:", sellerId);
      return NextResponse.json({ received: true, ignored: "seller_mismatch" });
    }

    const email = field("email")?.trim().toLowerCase() || null;
    const saleId = field("sale_id");
    const subscriptionId = field("subscription_id");
    const productPermalink = field("product_permalink") || field("permalink");
    const recurrence = field("recurrence");

    const refunded = isTruthy(field("refunded"));
    const disputed = isTruthy(field("disputed"));
    const cancelled =
      isTruthy(field("cancelled")) ||
      Boolean(field("subscription_cancelled_at")) ||
      Boolean(field("subscription_ended_at")) ||
      Boolean(field("subscription_failed_at"));

    const client = supabaseAdmin();

    // Locate the account. A fresh sale carries the buyer's email; a
    // cancellation ping may only carry the subscription id we stored earlier.
    let userId: string | null = null;

    if (email) {
      const { data } = await client
        .from("users")
        .select("id")
        .ilike("email", email)
        .maybeSingle();

      userId = (data as { id: string } | null)?.id ?? null;
    }

    if (!userId && subscriptionId) {
      const { data } = await client
        .from("users")
        .select("id")
        .eq("gumroad_subscription_id", subscriptionId)
        .maybeSingle();

      userId = (data as { id: string } | null)?.id ?? null;
    }

    if (!userId) {
      // The buyer paid before creating an account (or used a different email).
      // Return 200 so Gumroad stops retrying, and log it for manual matching.
      console.warn("Gumroad ping for unknown account:", { email, saleId, subscriptionId });
      return NextResponse.json({
        received: true,
        matched: false,
        note: "No account found for this purchase email.",
      });
    }

    let update: PlanUpdate;

    if (refunded || disputed || cancelled) {
      // Access ends: drop to free and reset the counter so the customer still
      // gets that month's free allowance rather than an instant lockout.
      update = {
        plan: "free",
        gumroad_subscription_id: cancelled ? null : subscriptionId,
        plan_updated_at: new Date().toISOString(),
        usage_count: 0,
      };
    } else {
      // A lifetime purchase is one-time (no recurrence); Pro is recurring.
      const lifetimePermalink = process.env.GUMROAD_LIFETIME_PERMALINK;
      const isLifetime = lifetimePermalink
        ? productPermalink === lifetimePermalink
        : !recurrence;

      update = {
        plan: isLifetime ? "annual" : "pro",
        gumroad_sale_id: saleId,
        gumroad_subscription_id: subscriptionId,
        plan_updated_at: new Date().toISOString(),
      };
    }

    const { error: updateError } = await (client.from("users") as any)
      .update(update)
      .eq("id", userId);

    if (updateError) {
      console.error("Gumroad plan update failed:", updateError);
      // 500 tells Gumroad to retry the ping.
      return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
    }

    return NextResponse.json({
      received: true,
      matched: true,
      plan: update.plan,
    });
  } catch (error) {
    console.error("Gumroad webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

/** Gumroad's ping tester issues a GET first; make it obvious the route is live. */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: "ok",
    endpoint: "/api/webhooks/gumroad",
    method: "POST",
    contentType: "application/x-www-form-urlencoded",
    auth: "?secret=<GUMROAD_SECRET_KEY> in the ping URL",
  });
}
