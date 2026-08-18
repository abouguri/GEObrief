import OpenAI from "openai";

/**
 * Brief generation via Groq's `compound` system.
 *
 * Why Groq compound: web search is built in and runs automatically — the
 * model decides when to search, and the executed searches come back in the
 * response. That matters because the cited-sources section of a brief is only
 * worth anything if the URLs are real. A plain chat model asked to "list the
 * sources AI engines cite" will invent them.
 *
 * Groq is OpenAI-compatible, so the OpenAI SDK works with a different baseURL.
 *
 * Note: this is Groq (groq.com, fast inference of open models), not Grok
 * (xAI). If you switch to xAI later, web search there is a server-side tool on
 * the Responses API — `client.responses.create()` with
 * `tools: [{ type: "web_search" }]` — not this chat-completions shape.
 */

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

/** compound has full search+reasoning; compound-mini is faster and cheaper. */
const DEFAULT_MODEL = "groq/compound";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("Missing GROQ_API_KEY in environment variables");
    }

    client = new OpenAI({ apiKey, baseURL: GROQ_BASE_URL });
  }

  return client;
}

export interface GeoBriefInput {
  keyword: string;
  websiteUrl?: string;
  niche?: string;
}

/** A source the model actually retrieved, not one it recalled. */
export interface RetrievedSource {
  title: string;
  url: string;
  snippet: string;
  score: number;
}

export interface GeoBriefOutput {
  title: string;
  contentFormat: string;
  primaryAnswer: string;
  headingStructure: string[];
  keyQuestions: string[];
  schemaRecommendations: string[];
  eeatSignals: string[];
  citedSources: RetrievedSource[];
  geoScore: "Low" | "Medium" | "High";
  analysis: string;
  /** False when the model answered without searching — the brief is weaker. */
  searchPerformed: boolean;
}

/** Shape Groq adds to the message beyond the OpenAI types. */
interface CompoundMessage {
  content?: string | null;
  executed_tools?: Array<{
    search_results?: Array<{
      title?: string;
      url?: string;
      content?: string;
      score?: number;
    }>;
  }>;
}

/** The strategy fields we ask the model to produce as JSON. */
interface ModelBrief {
  title: string;
  contentFormat: string;
  primaryAnswer: string;
  headingStructure: string[];
  keyQuestions: string[];
  schemaRecommendations: string[];
  eeatSignals: string[];
  geoScore: "Low" | "Medium" | "High";
  analysis: string;
}

const SYSTEM_PROMPT = `You are a GEO (Generative Engine Optimization) expert.

Search the live web to find how this topic is currently answered, which sources
are cited, and what content format dominates. Base your recommendations on what
you actually find, not on general best practice.

Return ONLY a JSON object, with no markdown fences and no commentary:
{
  "title": "Title optimised for AI citation — specific and direct, not a curiosity gap",
  "contentFormat": "The format that currently wins for this query, and why",
  "primaryAnswer": "40-80 words, self-contained, no pronouns pointing off-screen. This is the passage engines should lift verbatim.",
  "headingStructure": ["Question-shaped H2", "Question-shaped H2", "..."],
  "keyQuestions": ["Real question users ask", "..."],
  "schemaRecommendations": ["FAQPage", "Article", "..."],
  "eeatSignals": ["Specific signal to include", "..."],
  "geoScore": "Low|Medium|High",
  "analysis": "Why this brief will or won't win a citation, given what you found"
}`;

/** Pull JSON out of a response that may be fenced or wrapped in prose. */
function extractJson(content: string): ModelBrief {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : content;

  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model did not return a JSON brief");
  }

  return JSON.parse(candidate.slice(start, end + 1)) as ModelBrief;
}

/** Deduplicate by URL and keep the strongest matches. */
function collectSources(message: CompoundMessage, limit = 5): RetrievedSource[] {
  const results = (message.executed_tools ?? []).flatMap(
    (tool) => tool.search_results ?? []
  );

  const seen = new Set<string>();
  const sources: RetrievedSource[] = [];

  for (const result of results) {
    if (!result.url || seen.has(result.url)) continue;
    seen.add(result.url);

    sources.push({
      title: result.title?.trim() || result.url,
      url: result.url,
      snippet: (result.content ?? "").trim().slice(0, 280),
      score: typeof result.score === "number" ? result.score : 0,
    });
  }

  return sources.sort((a, b) => b.score - a.score).slice(0, limit);
}

export async function generateGeoBrief(
  input: GeoBriefInput
): Promise<GeoBriefOutput> {
  const userPrompt = `Generate a GEO content brief for the keyword: "${input.keyword}"${
    input.websiteUrl ? `\nWebsite for context: ${input.websiteUrl}` : ""
  }${input.niche ? `\nNiche: ${input.niche}` : ""}

Search the web first to see how AI engines and top sources currently answer this.`;

  const response = await getClient().chat.completions.create({
    model: process.env.GROQ_MODEL || DEFAULT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.6,
    // Briefs run long; 2000 truncated them mid-JSON and broke parsing.
    max_tokens: 4000,
  });

  const message = response.choices[0]?.message as CompoundMessage | undefined;

  if (!message?.content) {
    throw new Error("No content returned from the model");
  }

  const brief = extractJson(message.content);
  const citedSources = collectSources(message);

  return {
    ...brief,
    citedSources,
    // Surfaced so the UI can be honest when a brief is unsearched.
    searchPerformed: citedSources.length > 0,
  };
}

export function formatBriefAsMarkdown(brief: GeoBriefOutput): string {
  let markdown = `# ${brief.title}\n\n`;

  markdown += `## Quick Analysis\n`;
  markdown += `**GEO Score:** ${brief.geoScore}\n\n`;
  markdown += `${brief.analysis}\n\n`;

  markdown += `## Content Format\n${brief.contentFormat}\n\n`;

  markdown += `## Primary Answer (AI Snapshot)\n> ${brief.primaryAnswer}\n\n`;

  markdown += `## Recommended Structure\n`;
  brief.headingStructure.forEach((heading) => {
    markdown += `- ${heading}\n`;
  });
  markdown += `\n`;

  markdown += `## Key Questions to Answer\n`;
  brief.keyQuestions.forEach((question) => {
    markdown += `- ${question}\n`;
  });
  markdown += `\n`;

  markdown += `## E-E-A-T Signals to Include\n`;
  brief.eeatSignals.forEach((signal) => {
    markdown += `- ${signal}\n`;
  });
  markdown += `\n`;

  markdown += `## Schema Markup Recommendations\n`;
  brief.schemaRecommendations.forEach((schema) => {
    markdown += `- ${schema}\n`;
  });
  markdown += `\n`;

  markdown += `## Sources Currently Ranking For This Topic\n`;
  if (brief.citedSources.length > 0) {
    brief.citedSources.forEach((source, i) => {
      markdown += `${i + 1}. **${source.title}** — [${source.url}](${source.url})\n`;
      if (source.snippet) {
        markdown += `   - ${source.snippet}\n`;
      }
    });
  } else {
    markdown += `_No live sources were retrieved for this brief, so the recommendations above are based on the model's general knowledge rather than current search results._\n`;
  }
  markdown += `\n`;

  markdown += `---\n*Generated by GEObrief.ai*\n`;

  return markdown;
}
