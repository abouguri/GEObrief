import ReactMarkdown from 'react-markdown';

/**
 * Shared brief renderer used by the dashboard and the history detail view.
 * The brief is the product, so it gets the highest elevation and the
 * editorial serif — it should read like a document, not a data panel.
 */
export default function BriefMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-clay-border bg-clay-surface p-6 shadow-[0_1px_2px_rgba(26,22,19,0.04),0_18px_44px_-26px_rgba(26,22,19,0.2)] sm:p-8">
      <ReactMarkdown
        components={{
          h1: (props) => (
            <h1
              className="mb-[18px] font-serif text-[32px] font-bold leading-[1.15] tracking-tight text-clay-ink sm:text-4xl"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="mb-3 mt-[26px] font-serif text-[22px] font-semibold text-clay-ink sm:text-2xl"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="mb-2 mt-5 font-serif text-lg font-semibold text-clay-ink"
              {...props}
            />
          ),
          p: (props) => (
            <p className="mb-4 text-[15px] leading-[1.7] text-clay-body" {...props} />
          ),
          ul: (props) => (
            <ul
              className="mb-4 flex list-disc flex-col gap-2 pl-[22px] text-[15px] text-clay-body"
              {...props}
            />
          ),
          ol: (props) => (
            <ol
              className="mb-4 flex list-decimal flex-col gap-2 pl-[22px] text-[15px] text-clay-body"
              {...props}
            />
          ),
          li: (props) => <li className="leading-relaxed" {...props} />,
          strong: (props) => (
            <strong className="font-semibold text-clay-ink" {...props} />
          ),
          blockquote: (props) => (
            <blockquote
              className="my-4 border-l-2 border-clay-accent pl-[18px] font-serif text-[17px] italic leading-relaxed text-clay-quote [&>p]:mb-0 [&>p]:text-[17px] [&>p]:text-clay-quote"
              {...props}
            />
          ),
          code: (props) => (
            <code
              className="rounded bg-clay-shell px-1.5 py-0.5 font-mono text-[0.9em] text-clay-accent"
              {...props}
            />
          ),
          pre: (props) => (
            <pre
              className="mb-4 overflow-x-auto rounded-lg border border-clay-border bg-clay-shell p-4 text-sm [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-clay-body"
              {...props}
            />
          ),
          a: (props) => (
            <a
              className="text-clay-accent underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          hr: () => <hr className="my-8 border-clay-border" />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
