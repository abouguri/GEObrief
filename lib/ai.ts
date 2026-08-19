import OpenAI from "openai";

/**
 * Brief generation is two separate Groq calls, not one.
 *
 * Why: `groq/compound`'s web search is genuinely automatic and returns real
 * results, verified directly against the API. But on Groq's free/on-demand
 * tier, a single request that asks Compound to both search AND write a full
 * structured multi-field brief regularly exceeds the underlying reasoning
 * model's per-request token ceiling (measured at about 8,000 tokens/min on
 * this tier) and fails with 413 request_too_large. This is confirmed
 * reproducible even at max_tokens as low as 50, with the account's overall
 * token budget nearly full. A single search call alone can use about 8,000
 * tokens on its own, leaving no room in the same request to also write
 * hundreds of tokens of JSON.
 *
 * The fix: split retrieval from generation.
 *   1. `retrieveSources`: a lean, search-only call to `groq/compound-mini`.
 *      We don't need its prose output, only the search results it retrieves.
 *   2. `synthesizeBrief`: a plain, non-search model (`openai/gpt-oss-20b`,
 *      no Compound overhead, comfortably higher effective budget) writes the
 *      brief from those real results.
 *
 * This is also a better design than a single call, not just a workaround.
 * `citedSources` is assembled by this code directly from step 1's results,
 * never re-typed by the model in step 2. The URLs in a brief are exactly what
 * search returned; there is no step where an LLM could misremember one.
 *
 * Groq is OpenAI-compatible, so the OpenAI SDK works with a different baseURL.
 * Note: this is Groq (groq.com), not Grok (xAI); they are different
 * companies. If you switch to xAI later, its web search is a server-side
 * tool on the Responses API (`client.responses.create()` with
 * `tools: [{ type: "web_search" }]`), not this chat-completions shape.
 */

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

/** Search-only step: compound-mini has proven, working web search. */
const RETRIEVAL_MODEL = "groq/compound-mini";

/**
 * Synthesis step: a plain model with no search tool, so none of its token
 * budget is spent on Compound's internal search/reasoning overhead. Verified
 * directly against the API to complete a full brief in about 1,300 tokens
 * total, comfortably inside an 8,000/min budget with the retrieval call
 * included.
 */
const SYNTHESIS_MODEL = "openai/gpt-oss-20b";

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

/** A source actually returned by search, never model-generated text. */
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
  /** False when retrieval found nothing. The brief says so rather than guessing. */
  searchPerformed: boolean;
}

/**
 * Groq's tool-call shape, confirmed directly against the live API:
 * `executed_tools[].search_results` is `{ results: [...] }`, one level
 * deeper than the field name suggests. Easy to get wrong from docs alone.
 */
interface CompoundMessage {
  content?: string | null;
  executed_tools?: Array<{
    search_results?: {
      results?: Array<{
        title?: string;
        url?: string;
        content?: string;
        score?: number;
      }>;
    };
  }>;
}

/** The fields we ask the synthesis model to produce as JSON. */
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

/** Deduplicate by URL, strongest matches first. */
function collectSources(message: CompoundMessage, limit = 5): RetrievedSource[] {
  const results = (message.executed_tools ?? []).flatMap(
    (tool) => tool.search_results?.results ?? []
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

/**
 * Step 1: search only. Deliberately asks for a short response; the prose
 * `content` is discarded, only the retrieved search results matter, and
 * keeping the ask small leaves headroom under the per-request token ceiling.
 */
async function retrieveSources(input: GeoBriefInput): Promise<RetrievedSource[]> {
  const userPrompt = `Search the web to find how the topic below is currently covered:
what pages rank, what they say, and what current pricing or specifics look like.

Topic: "${input.keyword}"${input.niche ? `\nNiche: ${input.niche}` : ""}

Reply with one short sentence. The search itself is what matters, not the reply.`;

  const response = await getClient().chat.completions.create({
    model: RETRIEVAL_MODEL,
    messages: [{ role: "user", content: userPrompt }],
    temperature: 0.3,
    max_tokens: 200,
  });

  const message = response.choices[0]?.message as CompoundMessage | undefined;
  return message ? collectSources(message) : [];
}

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

const SYNTHESIS_SYSTEM_PROMPT = `You are a GEO (Generative Engine Optimization) expert.

You will be given real search results retrieved for a keyword: actual pages,
titles and excerpts. Base your brief on what they show, not on general
knowledge. If the results are sparse, say so in your analysis rather than
inventing detail.

Return ONLY a JSON object, with no markdown fences and no commentary:
{
  "title": "Title optimised for AI citation, specific and direct, not a curiosity gap",
  "contentFormat": "The format that currently wins for this query, and why",
  "primaryAnswer": "40-80 words, self-contained, no pronouns pointing off-screen. This is the passage engines should lift verbatim.",
  "headingStructure": ["Question-shaped H2", "Question-shaped H2", "..."],
  "keyQuestions": ["Real question users ask", "..."],
  "schemaRecommendations": ["FAQPage", "Article", "..."],
  "eeatSignals": ["Specific signal to include", "..."],
  "geoScore": "Low|Medium|High",
  "analysis": "Why this brief will or won't win a citation, given what the search results show"
}`;

/** Step 2: write the brief from real, already-retrieved sources. */
async function synthesizeBrief(
  input: GeoBriefInput,
  sources: RetrievedSource[]
): Promise<ModelBrief> {
  const sourceBlock =
    sources.length > 0
      ? sources
          .map(
            (s, i) =>
              `${i + 1}. ${s.title}\n   URL: ${s.url}\n   Excerpt: ${s.snippet || "(no excerpt)"}`
          )
          .join("\n\n")
      : "(No search results were retrieved. Write the brief from general best practice, and say so plainly in the analysis.)";

  const userPrompt = `Keyword: "${input.keyword}"${
    input.websiteUrl ? `\nWebsite for context: ${input.websiteUrl}` : ""
  }${input.niche ? `\nNiche: ${input.niche}` : ""}

Search results retrieved:
${sourceBlock}

Write the GEO brief now.`;

  const response = await getClient().chat.completions.create({
    model: SYNTHESIS_MODEL,
    messages: [
      { role: "system", content: SYNTHESIS_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.6,
    max_tokens: 3000,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No content returned from the model");
  }

  return extractJson(content);
}

export async function generateGeoBrief(
  input: GeoBriefInput
): Promise<GeoBriefOutput> {
  // Retrieval failing is not fatal. A brief written without live sources is
  // weaker but still useful, and the markdown says so explicitly rather than
  // pretending otherwise. Synthesis failing IS fatal: there is no brief.
  let sources: RetrievedSource[] = [];
  try {
    sources = await retrieveSources(input);
  } catch (error) {
    console.error("Source retrieval failed, continuing without sources:", error);
  }

  const brief = await synthesizeBrief(input, sources);

  return {
    ...brief,
    citedSources: sources,
    searchPerformed: sources.length > 0,
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
      markdown += `${i + 1}. **${source.title}**: [${source.url}](${source.url})\n`;
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
