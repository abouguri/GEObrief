import { DEFAULT_AUTHOR, type Post } from '../types';

export const post: Post = {
  slug: 'geo-content-brief-template',
  title: 'The GEO Content Brief Template (Copy It Free)',
  description:
    'A complete, copy-paste content brief template built for AI citation, with a worked example and notes on what each section is actually for.',
  keyword: 'GEO content brief template',
  keywords: [
    'GEO content brief template',
    'content brief template',
    'AI content brief',
    'generative engine optimization brief',
    'SEO brief template 2026',
  ],
  publishedAt: '2026-06-24',
  readingMinutes: 10,
  author: DEFAULT_AUTHOR,
  faqs: [
    {
      question: 'What is a GEO content brief?',
      answer:
        'A GEO content brief is a writing spec built for AI answer engines rather than for ranked link lists. Alongside the usual title and heading structure, it specifies the primary answer block, the questions the page must resolve, the E-E-A-T signals to include, and the schema markup to add.',
    },
    {
      question: 'How is a GEO brief different from a normal SEO brief?',
      answer:
        'A traditional SEO brief targets keyword placement and word count. A GEO brief adds a designated answer passage written to be quoted verbatim, question-shaped headings, required evidence for each claim, and the specific sources currently cited by AI engines for that topic.',
    },
    {
      question: 'How long should a GEO brief be?',
      answer:
        'One to two pages. A brief long enough to need its own summary defeats the purpose. The test is whether a competent writer unfamiliar with the topic could produce a publishable draft from it without asking follow-up questions.',
    },
  ],
  content: `A content brief exists to answer one question: what would make this page the best possible source on this topic?

For twenty years, briefs answered that with keyword targets and word counts. That produced pages that ranked. It does not reliably produce pages that get quoted inside AI answers, because the thing doing the quoting cares about different properties.

Below is the template we use, the reasoning behind each section, and a filled-in example.

## The template

Copy this wholesale.

\`\`\`markdown
# GEO Content Brief: [Target Keyword]

**Prepared:** [Date]
**Writer:** [Name]
**Target publish date:** [Date]

## 1. Target query & intent
- Primary query: [the exact phrasing a person would use]
- Intent type: [definition | comparison | procedure | evaluation | troubleshooting]
- Prompt variants this page must also satisfy:
  - [variant 1]
  - [variant 2]
  - [variant 3]

## 2. Recommended title
[Direct, specific, no curiosity gap. Should read like the answer to the query.]

## 3. Content format
[Which shape wins for this query today: definition + examples,
step-by-step procedure, comparison table, decision framework, etc.
Note what format currently dominates AI answers for this topic.]

## 4. Primary answer block  ← the most important section
[40–80 words, self-contained, no pronouns pointing off-screen.
This is the passage engines are most likely to lift verbatim.
It sits directly under the H1, before any preamble.]

## 5. Heading structure
- H2: [question-shaped heading]
  - Answer in first sentence: [what it must say]
- H2: [question-shaped heading]
  - Answer in first sentence: [what it must say]
- H2: [question-shaped heading]
  - H3: [sub-point]
  - H3: [sub-point]

## 6. Questions the page must answer
[Sourced from real prompts, People-Also-Ask, support tickets,
sales calls, and forum threads. Each becomes a heading or an
FAQ entry, and must be answered in one self-contained passage.]
1. [question]
2. [question]
3. [question]

## 7. Required evidence
[Every claim that needs support, and what support to attach.
"No source available" is an acceptable answer: it means the
claim gets explicitly scoped or cut.]
| Claim | Support to attach |
|---|---|
| [claim] | [study, dataset, doc link, own data + scope] |

## 8. E-E-A-T signals to include
- Author: [name, credential, link to verifiable profile]
- Experience marker: [first-hand detail only a practitioner has]
- Sources: [minimum count, must be linked inline]
- Published + updated dates: visible in page body
- Limitations section: [what this approach does not do]

## 9. Schema markup
- [ ] Article (with full author object + sameAs)
- [ ] FAQPage (only for Q&As visible in the body)
- [ ] HowTo (only if genuinely procedural)

## 10. Currently cited sources to outperform
[The pages AI engines cite for this query today. For each:
what it does well, and the specific gap to exploit.]
1. [URL] (strong: [x] / gap: [y])
2. [URL] (strong: [x] / gap: [y])
3. [URL] (strong: [x] / gap: [y])

## 11. Internal links
- Link out to: [pages]
- Link in from: [pages]

## 12. GEO score estimate
[Low | Medium | High] ([one line on the limiting factor])
\`\`\`

## Why each section is there

**Sections 1 and 6 (queries and questions)** exist because prompts are longer and more specific than keywords. One page usually has to satisfy a cluster of related phrasings, not one term. Listing them stops the writer from optimizing for a phrasing nobody uses.

**Section 4 (primary answer block)** is the section that most distinguishes a GEO brief. You are pre-writing the passage you want quoted. If you leave this to chance, the engine picks whichever paragraph happens to be most extractable, often a throwaway line from your introduction.

**Section 5 (heading structure)** specifies both the heading *and* what its first sentence must assert. Requiring the answer up front is the difference between a section that gets retrieved and one that gets skipped.

**Section 7 (required evidence)** turns vagueness into a decision. Forcing a writer to name the support for each claim surfaces which claims they cannot actually back, which is exactly the set that will get you contradicted by better-sourced competitors.

**Section 8 (E-E-A-T)** matters because trust evaluation is partly entity-level. Anonymous content competes badly against content attached to a person with verifiable expertise.

**Section 10 (sources to outperform)** keeps the work grounded in reality. You are not optimizing against an abstraction; you are trying to be a better source than three specific pages an engine currently prefers.

## A worked example

Filled in for the query "how often should you update old blog posts":

\`\`\`markdown
# GEO Content Brief: how often should you update old blog posts

## 1. Target query & intent
- Primary query: "how often should you update old blog posts"
- Intent type: procedure + evaluation
- Prompt variants:
  - "how often should I refresh old content for SEO"
  - "is it worth updating old blog posts in 2026"
  - "how do I decide which blog posts to update"

## 2. Recommended title
How Often to Update Old Blog Posts (A Decision Framework, Not a Schedule)

## 3. Content format
Decision framework + triage table. AI answers on this topic currently
default to vague intervals ("every 6–12 months"); a framework keyed to
content type is a differentiated, more accurate answer.

## 4. Primary answer block
There is no universal interval. Update frequency should follow how fast
a topic's underlying facts change: pricing and tool comparisons need
review every 3–6 months, tactical how-tos every 9–12 months, and
conceptual explainers only when the concept itself shifts. Auditing on a
fixed calendar wastes effort on pages that have not decayed.

## 5. Heading structure
- H2: How do you know a post needs updating?
  - First sentence: three signals: falling impressions with stable
    rank, factual drift, and competitor pages with newer dates.
- H2: Which posts should you update first?
  - First sentence: prioritise by traffic value multiplied by decay rate.
- H2: What counts as a real update?
  - First sentence: material change to facts, structure, or scope,
    not a date change.
- H2: How often should each content type be reviewed?
  - Table by type with review intervals.

## 6. Questions the page must answer
1. Does updating a post help it get cited by AI engines?
2. Should you change the publish date when you update?
3. Is it better to update or write a new post?
4. How long until an update shows an effect?

## 7. Required evidence
| Claim | Support to attach |
|---|---|
| Updated pages get re-crawled faster | Google docs on crawl scheduling |
| Date changes without content changes don't help | Google guidance on dates |
| Decay rates vary by topic type | Own data, scope explicitly to our client set |

## 8. E-E-A-T signals
- Author: named practitioner, link to LinkedIn
- Experience marker: describe an actual audit, with real numbers
- Sources: minimum 4, linked inline
- Visible published + updated dates
- Limitations: framework assumes you have 12+ months of analytics

## 9. Schema
- [x] Article (full author object)
- [x] FAQPage (the four questions in section 6)
- [ ] HowTo (not procedural enough)

## 10. Currently cited sources to outperform
1. [major SEO blog guide] (strong: comprehensive / gap: recommends a
   flat 6-month interval regardless of topic)
2. [agency post] (strong: good screenshots / gap: undated, no author)
3. [forum thread] (strong: real practitioner detail / gap: unstructured)

## 12. GEO score estimate
High. The framework angle is genuinely absent from current answers.
\`\`\`

## Using it well

Three habits separate briefs that work from briefs that get ignored:

**Fill in section 10 by hand, at least once.** Actually run your target prompts through two or three assistants and record which sources come back. It is the fastest education available in why some pages get cited and yours does not.

**Keep it to two pages.** A brief is a spec, not a research dump. If it needs a summary, it has failed.

**Write section 4 yourself.** Even if a writer produces everything else, the primary answer block deserves your attention. It is the sentence most likely to be read by strangers who never visit your site.

---

Filling in section 10 manually is the slow part, because it means running prompts across engines and reading what comes back. That is the step [GEObrief.ai](/) automates: it searches live, reports which sources are currently cited for your keyword, and returns the rest of this structure filled in. Three briefs a month are free.`,
};
