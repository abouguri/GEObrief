import { NextRequest, NextResponse } from "next/server";
import { generateGeoBrief, formatBriefAsMarkdown } from "@/lib/grok";
import { checkUsageLimit, incrementUsage, getUserUsageStats } from "@/lib/usage";
import { getUserFromRequest } from "@/lib/auth-server";
import { saveBrief } from "@/lib/briefs";

export const runtime = "nodejs";

interface GenerateBriefRequest {
  keyword: string;
  websiteUrl?: string;
  niche?: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Identify the caller before doing any billable work. The user id comes
    // from a verified access token, never from the request body.
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        {
          error: "Not authenticated",
          details: "Sign in to generate a brief.",
        } as ErrorResponse,
        { status: 401 }
      );
    }

    // Parse request body
    const body: GenerateBriefRequest = await request.json();
    const { keyword, websiteUrl, niche } = body;

    // Validate keyword
    if (!keyword || keyword.trim().length === 0) {
      return NextResponse.json(
        { error: "Keyword is required" } as ErrorResponse,
        { status: 400 }
      );
    }

    if (keyword.trim().length < 2) {
      return NextResponse.json(
        { error: "Keyword must be at least 2 characters" } as ErrorResponse,
        { status: 400 }
      );
    }

    // Enforce the free-plan gate server-side
    const canGenerate = await checkUsageLimit(user.id);
    if (!canGenerate) {
      return NextResponse.json(
        {
          error: "Usage limit reached",
          details: "You've used all 3 free briefs this month. Upgrade to Pro.",
        } as ErrorResponse,
        { status: 429 }
      );
    }

    // Generate brief via Grok
    const brief = await generateGeoBrief({
      keyword: keyword.trim(),
      websiteUrl: websiteUrl?.trim(),
      niche: niche?.trim(),
    });

    // Format as markdown
    const briefMarkdown = formatBriefAsMarkdown(brief);

    // Persist for the history page, then count the brief against the quota
    const briefId = await saveBrief({
      userId: user.id,
      keyword: keyword.trim(),
      websiteUrl: websiteUrl?.trim(),
      niche: niche?.trim(),
      brief,
      briefMarkdown,
    });

    await incrementUsage(user.id);
    const usage = await getUserUsageStats(user.id);

    return NextResponse.json(
      {
        success: true,
        briefId,
        keyword: keyword.trim(),
        brief,
        briefMarkdown,
        usage: {
          plan: usage.plan,
          usageCount: usage.usageCount,
          limit: usage.plan === "free" ? 3 : null,
          resetDate: usage.monthStart,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Brief generation error:", error);

    // Handle specific errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request format" } as ErrorResponse,
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("rate")) {
      return NextResponse.json(
        {
          error: "Rate limited",
          details: "Too many requests. Please try again later.",
        } as ErrorResponse,
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to generate brief",
        details: error instanceof Error ? error.message : "Unknown error",
      } as ErrorResponse,
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      status: "ok",
      message: "GEO Brief API is ready",
      endpoint: "/api/generate-brief",
      method: "POST",
      auth: "Authorization: Bearer <supabase access token>",
      requiredFields: ["keyword"],
      optionalFields: ["websiteUrl", "niche"],
    },
    { status: 200 }
  );
}
