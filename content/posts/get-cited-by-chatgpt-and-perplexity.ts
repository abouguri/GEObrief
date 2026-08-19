import { DEFAULT_AUTHOR, type Post } from '../types';

export const post: Post = {
  slug: 'get-cited-by-chatgpt-and-perplexity',
  title: 'How to Write Content That Gets Cited by ChatGPT and Perplexity',
  description:
    'AI engines quote passages, not pages. Here is how retrieval actually selects sources, and the writing patterns that make your content the one it lifts.',
  keyword: 'how to get cited by ChatGPT',
  keywords: [
    'how to get cited by ChatGPT',
    'get cited by Perplexity',
    'AI citation optimization',
    'Perplexity SEO strategy',
    'how AI engines choose sources',
  ],
  publishedAt: '2026-06-03',
  updatedAt: '2026-08-11',
  readingMinutes: 11,
  author: DEFAULT_AUTHOR,
  faqs: [
    {
      question: 'How do AI engines choose which sources to cite?',
      answer:
        'Most assistants retrieve candidate passages that are semantically close to the query, then a generator writes an answer grounded in the strongest of them. Selection favours passages that answer the question directly, in self-contained language, with specifics the model can safely repeat.',
    },
    {
      question: 'Do I need backlinks to get cited by ChatGPT?',
      answer:
        'Not directly, but they help indirectly. Links contribute to the authority signals that get your pages into the retrieval candidate pool in the first place. Once there, whether you are quoted depends far more on how the passage is written than on its link profile.',
    },
    {
      question: 'What length of passage gets quoted most often?',
      answer:
        'Roughly 40 to 80 words. Shorter than that rarely carries a complete answer; much longer and the engine has to summarise, which introduces the risk of dropping your framing or your attribution entirely.',
    },
    {
      question: 'Does blocking AI crawlers hurt my visibility?',
      answer:
        'Yes. If your robots.txt blocks an assistant’s crawler, that engine cannot retrieve your pages and cannot cite you. Blocking is a legitimate business choice, but it removes you from that engine’s answers entirely.',
    },
  ],
  content: `Most advice about getting cited by AI engines stops at "write high-quality content." That is true and useless. Quality is a threshold, not a differentiator. The pages competing with yours are also good.

What actually decides citation is narrower and more mechanical than most content teams expect. Here is the pipeline, and how to write for each stage of it.

## What happens between prompt and answer

When someone asks an assistant a question that needs current information, roughly this sequence runs:

1. **Query interpretation.** The prompt becomes one or more search queries, often several, expanding a single question into sub-questions.
2. **Retrieval.** A search layer returns candidate documents, and passages inside them are scored for semantic closeness to the query.
3. **Grounding.** A shortlist of passages is handed to the model as context.
4. **Generation.** The model writes an answer using that context, attaching citations to the passages it leaned on.
5. **Attribution.** Sources that materially shaped sentences get cited; sources that were retrieved but unused disappear silently.

Two implications fall out of this immediately.

**You are competing at the passage level.** A great page whose best insight is spread across five paragraphs loses to a mediocre page with one tight, complete paragraph on exactly that point.

**Retrieval and citation are separate battles.** Being retrieved is mostly a search problem: authority, relevance, crawlability. Being cited, once retrieved, is a writing problem. Most sites lose the second one.

## The self-contained passage

This is the single highest-leverage habit in GEO.

A passage is self-contained when it makes complete sense with no surrounding context. No "as we discussed above." No "this approach." No pronouns pointing at things off-screen.

Compare:

> **Weak:** As mentioned earlier, this makes it considerably faster than the alternative, which is why most teams end up preferring it.

> **Strong:** Server-side rendering delivers a complete HTML document on first request, so content is visible to crawlers and assistants without executing JavaScript. Client-side rendering requires the crawler to run a JavaScript bundle first, which some do inconsistently or not at all.

The second version can be lifted verbatim into an answer and still be correct and attributable. The first cannot be used at all, because nobody knows what "this" and "the alternative" refer to.

Practical rule: **name the subject in every passage.** Repetition that feels slightly clumsy to a human reader is what makes text portable.

## Answer-first architecture

Structure every substantive section as: direct answer, then support, then nuance.

\`\`\`
## How long does it take to see GEO results?

Most sites see citation changes within four to eight weeks of
restructuring a page, because AI engines re-retrieve content on
roughly the same cadence as search crawlers.

[then: what affects that timeline]
[then: how to measure it]
[then: the cases where it takes longer]
\`\`\`

The first paragraph does the citation work. Everything after it earns trust with the human who clicks through. You need both, in that order.

This inverts a lot of standard content advice about building narrative tension. Tension is for essays. This is reference material being read by something that does not experience suspense.

## Make claims safe to repeat

Generative systems are tuned to avoid stating things they cannot support. That gives you a lever: the easier you make a claim to verify, the safer it is to quote.

Weak claims get skipped. Strong ones get lifted.

| Weak | Quotable |
|---|---|
| "Most companies struggle with this." | "In a 2026 survey of 400 B2B marketing teams, 61% reported no formal process for updating existing content." |
| "It's much faster." | "Median generation time dropped from 14 seconds to 3.2 seconds after caching was added." |
| "Experts recommend it." | "Google's own documentation recommends this pattern for paginated collections." |

Every quotable version has the same three properties: a specific number or named authority, a scope, and a date or context. That triple is what makes a sentence portable into an answer with the hedging an engine needs.

If you do not have data, say what you do have. "In our own client work across roughly 30 sites, the pattern we see is…" is honest, scoped, and still citable. Inventing a statistic is not just unethical. It is fragile, because contradicting sources will outrank you.

## Question-shaped headings

Headings are retrieval anchors. Write them as the question the section answers, in the words a real person would use.

- ~~"Considerations"~~ → "When should you not use a GEO brief?"
- ~~"Our Methodology"~~ → "How do we score citation likelihood?"
- ~~"Pricing Deep Dive"~~ → "How much does generative engine optimization cost?"

Then answer the heading in the first sentence beneath it. The heading-answer pair is the most reliably retrieved unit on any page.

## Structured data that engines actually use

Schema markup does not force a citation, but it clarifies what your content is, which improves retrieval accuracy.

The three worth implementing:

**FAQPage**, for pages with genuine question-and-answer sections. The questions and answers must appear in the visible page content, not only in the markup.

**Article** with a real \`author\` object, including \`name\`, \`jobTitle\`, and a \`sameAs\` link to a verifiable profile. This connects the content to an entity, which matters for the trust evaluation.

**HowTo**, for genuine step sequences with an ordered structure. Do not use it for listicles that are not really procedures.

Skip the rest. Marking up a blog post as \`Product\` because it mentions a product is the kind of mismatch that gets ignored at best.

## Cover the comparison space

Assistants are asked to compare things constantly: "X vs Y," "best tool for Z," "alternatives to W." If your content only ever describes your own approach in isolation, you are structurally absent from that entire class of answers.

Write the comparisons yourself, honestly:

- Name real alternatives, including ones better than you for some use cases.
- State clearly who each option suits.
- Say where you lose. "If you need a full site audit, use a crawler instead; we only produce briefs."

Counter-intuitively, admitting limitations makes you *more* citable, because an engine synthesizing a balanced answer needs balanced sources. Pure advocacy reads as marketing copy and gets treated accordingly.

## Let the crawlers in

Some of this is plumbing, and the plumbing decides whether any of the writing matters.

- **Check robots.txt** for rules blocking assistant crawlers. If you block them, you have opted out of their answers.
- **Serve content server-side.** If the substance only appears after hydration, assume some engines will never see it.
- **Keep URLs stable.** A citation to a URL that later 404s is a citation you lose.
- **Use clean semantic HTML.** Real \`<h2>\`s, real \`<ul>\`s, real \`<table>\`s. Divs styled to look like headings carry no structural meaning.
- **Date everything visibly.** Published and updated dates, in the page text, not only in metadata.

## A concrete workflow

Take one important page and run this pass:

1. **Read it as a stranger.** Highlight every sentence containing "this," "that," "it," or "the above" where the referent is off-screen. Rewrite each one to name its subject.
2. **Rewrite the headings** as questions in the user's language.
3. **Move the answers up.** Under each heading, the first 40–80 words should fully answer it.
4. **Audit the claims.** Every assertion gets a number, a source, a date, or an explicit scope. Otherwise it gets cut.
5. **Add the author block.** Real name, real credentials, link to a verifiable profile.
6. **Add FAQPage markup** for the questions genuinely present on the page.
7. **Record your baseline.** Run ten target prompts across engines and note whether you appear. Re-check in four weeks.

## The uncomfortable summary

Getting cited is mostly a matter of writing with unusual discipline: shorter answers, named subjects, specific claims, honest comparisons, visible dates. None of it is clever. All of it is work most publishers will not do.

That is precisely why it is still an advantage.`,
};
