import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';

interface ParsedElement {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'blockquote' | 'hr' | 'table';
  level?: number;
  content?: string;
  items?: string[];
  ordered?: boolean;
  rows?: string[][];
}

/**
 * Export markdown content to DOCX file
 */
export async function exportToDocx(
  markdown: string,
  title: string
): Promise<void> {
  const elements = parseMarkdown(markdown);
  const children = elements.flatMap(elementToDocx);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${title}.docx`);
}

/**
 * Simple markdown parser that extracts structure
 */
function parseMarkdown(markdown: string): ParsedElement[] {
  const lines = markdown.split('\n');
  const elements: ParsedElement[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      elements.push({
        type: 'heading',
        level: headingMatch[1].length,
        content: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      elements.push({ type: 'hr' });
      i++;
      continue;
    }

    // Code block
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push({
        type: 'code',
        content: codeLines.join('\n'),
      });
      i++;
      continue;
    }

    // Blockquote
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      elements.push({
        type: 'blockquote',
        content: quoteLines.join('\n'),
      });
      continue;
    }

    // Unordered list
    if (/^[\-\*]\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[\-\*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].replace(/^[\-\*]\s+/, '').trim());
        i++;
      }
      elements.push({
        type: 'list',
        items,
        ordered: false,
      });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].replace(/^\d+\.\s+/, '').trim());
        i++;
      }
      elements.push({
        type: 'list',
        items,
        ordered: true,
      });
      continue;
    }

    // Table
    if (line.includes('|')) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|')) {
        const row = lines[i]
          .split('|')
          .map(cell => cell.trim())
          .filter(cell => cell !== '');
        // Skip separator row
        if (!row.every(cell => /^[-:]+$/.test(cell))) {
          rows.push(row);
        }
        i++;
      }
      if (rows.length > 0) {
        elements.push({
          type: 'table',
          rows,
        });
      }
      continue;
    }

    // Regular paragraph
    const paragraphLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].match(/^#{1,6}\s/) &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('```') &&
      !/^[\-\*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !lines[i].includes('|')
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }
    elements.push({
      type: 'paragraph',
      content: paragraphLines.join(' '),
    });
  }

  return elements;
}

/**
 * Convert parsed element to docx elements
 */
function elementToDocx(element: ParsedElement): (Paragraph | Table)[] {
  switch (element.type) {
    case 'heading': {
      const headingLevel = getHeadingLevel(element.level || 1);
      return [
        new Paragraph({
          text: element.content || '',
          heading: headingLevel,
          spacing: { before: 240, after: 120 },
        }),
      ];
    }

    case 'paragraph': {
      const runs = parseInlineFormatting(element.content || '');
      return [
        new Paragraph({
          children: runs,
          spacing: { before: 120, after: 120 },
        }),
      ];
    }

    case 'list': {
      return (element.items || []).map(
        (item) =>
          new Paragraph({
            children: parseInlineFormatting(item),
            bullet: element.ordered
              ? { level: 0 }
              : { level: 0 },
            numbering: element.ordered
              ? { reference: 'default-numbering', level: 0 }
              : undefined,
            spacing: { before: 60, after: 60 },
          })
      );
    }

    case 'code': {
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: element.content || '',
              font: 'Courier New',
              size: 20,
            }),
          ],
          spacing: { before: 120, after: 120 },
          shading: { fill: 'F5F5F5' },
        }),
      ];
    }

    case 'blockquote': {
      return [
        new Paragraph({
          children: parseInlineFormatting(element.content || ''),
          indent: { left: 720 },
          spacing: { before: 120, after: 120 },
          border: {
            left: {
              color: 'CCCCCC',
              size: 24,
              style: BorderStyle.SINGLE,
            },
          },
        }),
      ];
    }

    case 'hr': {
      return [
        new Paragraph({
          children: [
            new TextRun({
              text: '─'.repeat(50),
              color: 'CCCCCC',
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 240 },
        }),
      ];
    }

    case 'table': {
      if (!element.rows || element.rows.length === 0) {
        return [];
      }
      const tableRows = element.rows.map(
        (row, rowIndex) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  children: [
                    new Paragraph({
                      children: parseInlineFormatting(cell),
                      spacing: { before: 60, after: 60 },
                    }),
                  ],
                  shading: rowIndex === 0 ? { fill: 'F5F5F5' } : undefined,
                })
            ),
          })
      );
      return [
        new Table({
          rows: tableRows,
          width: { size: 100, type: WidthType.PERCENTAGE },
        }),
      ];
    }

    default:
      return [];
  }
}

/**
 * Get docx heading level
 */
function getHeadingLevel(level: number): (typeof HeadingLevel)[keyof typeof HeadingLevel] {
  switch (level) {
    case 1:
      return HeadingLevel.HEADING_1;
    case 2:
      return HeadingLevel.HEADING_2;
    case 3:
      return HeadingLevel.HEADING_3;
    case 4:
      return HeadingLevel.HEADING_4;
    case 5:
      return HeadingLevel.HEADING_5;
    case 6:
      return HeadingLevel.HEADING_6;
    default:
      return HeadingLevel.HEADING_1;
  }
}

/**
 * Parse inline formatting (bold, italic, code, links)
 */
function parseInlineFormatting(text: string): (TextRun | ExternalHyperlink)[] {
  const runs: (TextRun | ExternalHyperlink)[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Bold: **text** or __text__
    const boldMatch = remaining.match(/^(\*\*|__)(.+?)\1/);
    if (boldMatch) {
      runs.push(new TextRun({ text: boldMatch[2], bold: true }));
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic: *text* or _text_
    const italicMatch = remaining.match(/^(\*|_)([^*_]+)\1/);
    if (italicMatch) {
      runs.push(new TextRun({ text: italicMatch[2], italics: true }));
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code: `code`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      runs.push(
        new TextRun({
          text: codeMatch[1],
          font: 'Courier New',
          shading: { fill: 'F5F5F5' },
        })
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Link: [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      runs.push(
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: linkMatch[1],
              color: '2563EB',
              underline: {},
            }),
          ],
          link: linkMatch[2],
        })
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Regular text - find next special character
    const nextSpecial = remaining.search(/[\*_`\[]/);
    if (nextSpecial === -1) {
      runs.push(new TextRun({ text: remaining }));
      break;
    } else if (nextSpecial === 0) {
      // Special character at start but didn't match any pattern
      runs.push(new TextRun({ text: remaining[0] }));
      remaining = remaining.slice(1);
    } else {
      runs.push(new TextRun({ text: remaining.slice(0, nextSpecial) }));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return runs.length > 0 ? runs : [new TextRun({ text: '' })];
}
