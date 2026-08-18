import { NextRequest } from "next/server";
import { supabaseAdmin } from "./supabase";

export interface AuthedUser {
  id: string;
  email: string;
}

/**
 * Resolve the authenticated user from a request's Authorization header.
 *
 * The browser client stores its session locally, so API routes receive the
 * access token as `Authorization: Bearer <token>` and verify it here. Never
 * trust a user id sent in the request body — it would let any caller spend
 * another account's quota (or skip the quota entirely).
 *
 * Returns null when the header is missing or the token does not verify.
 */
export async function getUserFromRequest(
  request: NextRequest
): Promise<AuthedUser | null> {
  const header = request.headers.get("authorization");

  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = header.slice(7).trim();
  if (!token) {
    return null;
  }

  try {
    const client = supabaseAdmin();
    const { data, error } = await client.auth.getUser(token);

    if (error || !data.user) {
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email ?? "",
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}
