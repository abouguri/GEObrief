import { NextRequest, NextResponse } from "next/server";
import { generateGeoBrief, formatBriefAsMarkdown } from "@/lib/grok";
import { checkUsageLimit, incrementUsage } from "@/lib/usage";

export const runtime = "nodejs";

interface GenerateBriefRequest {
  keyword: string;
  websiteUrl?: string;
  niche?: string;
  userId?: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body: GenerateBriefRequest = await request.json();
    const { keyword, websiteUrl, niche, userId } = body;

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

    // Check usage limit if userId provided (future: after auth is built)
    if (userId) {
      const canGenerate = await checkUsageLimit(userId);
      if (!canGenerate) {
        return NextResponse.json(
          {
            error: "Usage limit reached",
            details: "You've used all 3 free briefs this month. Upgrade to Pro.",
          } as ErrorResponse,
          { status: 429 }
        );
      }
    }

    // Generate brief via Grok
    const brief = await generateGeoBrief({
      keyword: keyword.trim(),
      websiteUrl: websiteUrl?.trim(),
      niche: niche?.trim(),
    });

    // Format as markdown
    const briefMarkdown = formatBriefAsMarkdown(brief);

    // Increment usage if userId provided
    if (userId) {
      await incrementUsage(userId);
    }

    return NextResponse.json(
      {
        success: true,
        keyword: keyword.trim(),
        brief,
        briefMarkdown,
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
      requiredFields: ["keyword"],
      optionalFields: ["websiteUrl", "niche", "userId"],
    },
    { status: 200 }
  );
}
