import ReactMarkdown from 'react-markdown';

/** Shared brief renderer used by the dashboard and the history detail view. */
export default function BriefMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-invert max-w-none p-6 rounded-lg bg-white/5 border border-white/10 overflow-hidden">
      <ReactMarkdown
        components={{
          h1: (props) => (
            <h1 className="text-3xl font-bold text-white mt-6 mb-4 first:mt-0" {...props} />
          ),
          h2: (props) => <h2 className="text-2xl font-bold text-white mt-6 mb-3" {...props} />,
          h3: (props) => (
            <h3 className="text-xl font-semibold text-white/90 mt-4 mb-2" {...props} />
          ),
          p: (props) => <p className="text-white/80 mb-4 leading-relaxed" {...props} />,
          ul: (props) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-white/80" {...props} />
          ),
          ol: (props) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-white/80" {...props} />
          ),
          li: (props) => <li className="ml-2" {...props} />,
          code: (props) => (
            <code
              className="px-2 py-1 rounded bg-white/10 text-brand-accent text-sm font-mono"
              {...props}
            />
          ),
          pre: (props) => (
            <pre
              className="p-4 rounded-lg bg-black/30 overflow-x-auto mb-4 border border-white/10"
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="pl-4 border-l-2 border-brand-accent italic text-white/70 my-4"
              {...props}
            />
          ),
          a: (props) => (
            <a
              className="text-brand-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
