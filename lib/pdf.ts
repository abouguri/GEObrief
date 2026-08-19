/**
 * Markdown -> PDF export for generated briefs.
 *
 * jsPDF is imported dynamically so it never lands in the initial bundle;
 * only users who actually click Download pay for the ~350kB.
 */

const PAGE_MARGIN = 48;
const LINE_GAP = 6;

interface Block {
  text: string;
  size: number;
  style: "bold" | "normal" | "italic";
  spaceBefore: number;
  indent: number;
}

/**
 * Flatten brief markdown into styled blocks. Handles the subset that
 * formatBriefAsMarkdown emits: headings, bullets, numbered items,
 * blockquotes, horizontal rules and paragraphs.
 */
function parseMarkdown(markdown: string): Block[] {
  const blocks: Block[] = [];

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      continue;
    }

    // Horizontal rule: render as spacing rather than a glyph
    if (/^---+$/.test(line.trim())) {
      blocks.push({ text: "", size: 11, style: "normal", spaceBefore: 12, indent: 0 });
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      blocks.push({
        text: stripInline(heading[2]),
        size: level === 1 ? 20 : level === 2 ? 15 : 13,
        style: "bold",
        spaceBefore: level === 1 ? 0 : 16,
        indent: 0,
      });
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      blocks.push({
        text: stripInline(quote[1]),
        size: 11,
        style: "italic",
        spaceBefore: 8,
        indent: 16,
      });
      continue;
    }

    const bullet = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (bullet) {
      blocks.push({
        text: `•  ${stripInline(bullet[2])}`,
        size: 11,
        style: "normal",
        spaceBefore: 2,
        indent: 12 + bullet[1].length,
      });
      continue;
    }

    const numbered = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (numbered) {
      blocks.push({
        text: `${numbered[2]}.  ${stripInline(numbered[3])}`,
        size: 11,
        style: "normal",
        spaceBefore: 2,
        indent: 12 + numbered[1].length,
      });
      continue;
    }

    blocks.push({
      text: stripInline(line),
      size: 11,
      style: "normal",
      spaceBefore: 8,
      indent: 0,
    });
  }

  return blocks;
}

/** Remove inline markdown syntax that has no meaning in a flat PDF. */
function stripInline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|\s)\*([^*]+)\*/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

/** Turn a keyword into a safe, readable file name stem. */
export function briefFileName(keyword: string): string {
  const slug = keyword
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  return `geo-brief-${slug || "export"}`;
}

/**
 * Render brief markdown to a downloaded PDF.
 * Runs in the browser only. Call from an event handler.
 */
export async function downloadBriefAsPdf(
  markdown: string,
  keyword: string
): Promise<void> {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  let cursorY = PAGE_MARGIN;

  for (const block of parseMarkdown(markdown)) {
    cursorY += block.spaceBefore;

    if (!block.text) {
      continue;
    }

    doc.setFont("helvetica", block.style);
    doc.setFontSize(block.size);

    const maxWidth = pageWidth - PAGE_MARGIN * 2 - block.indent;
    const lines: string[] = doc.splitTextToSize(block.text, maxWidth);
    const lineHeight = block.size + LINE_GAP;

    for (const line of lines) {
      if (cursorY + lineHeight > pageHeight - PAGE_MARGIN) {
        doc.addPage();
        cursorY = PAGE_MARGIN;
      }

      doc.text(line, PAGE_MARGIN + block.indent, cursorY);
      cursorY += lineHeight;
    }
  }

  doc.save(`${briefFileName(keyword)}.pdf`);
}
