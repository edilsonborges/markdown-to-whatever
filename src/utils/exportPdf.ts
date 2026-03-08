import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { marked } from 'marked';
import type { StyleType } from '../types';

const pdfStyles: Record<StyleType, string> = {
  basico: `
    .pdf-doc { font-family: Georgia, 'Times New Roman', serif; }
    .pdf-doc h1, .pdf-doc h2, .pdf-doc h3 { font-family: system-ui, -apple-system, sans-serif; }
  `,
  academico: `
    .pdf-doc { font-family: Georgia, 'Times New Roman', serif; line-height: 1.9; }
    .pdf-doc h1, .pdf-doc h2, .pdf-doc h3 { font-family: Georgia, serif; }
    .pdf-doc p { text-align: justify; }
  `,
  tecnico: `
    .pdf-doc { font-family: system-ui, -apple-system, sans-serif; }
    .pdf-doc h1, .pdf-doc h2, .pdf-doc h3 {
      font-family: system-ui, -apple-system, sans-serif;
      border-bottom: 2px solid #2563EB;
      padding-bottom: 6px;
    }
    .pdf-doc pre { background: #1E293B !important; color: #E2E8F0 !important; border-top-color: #3B82F6 !important; }
    .pdf-doc pre code { color: #E2E8F0 !important; }
    .pdf-doc code { background: #1E293B; color: #E2E8F0; }
  `,
  compacto: `
    .pdf-doc { font-family: system-ui, -apple-system, sans-serif; font-size: 13px !important; line-height: 1.5 !important; }
    .pdf-doc h1 { font-size: 1.5em !important; }
    .pdf-doc h2 { font-size: 1.25em !important; }
    .pdf-doc h3 { font-size: 1.1em !important; }
    .pdf-doc p { margin: 0.4em 0 !important; }
    .pdf-doc pre { padding: 10px 14px !important; margin: 0.6em 0 !important; }
    .pdf-doc blockquote { margin: 0.5em 0 !important; }
  `,
};

const basePdfCSS = `
  .pdf-doc {
    font-size: 15px;
    line-height: 1.7;
    color: #1a1a1a;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* Headings */
  .pdf-doc h1 {
    font-size: 1.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
    color: #111;
    letter-spacing: -0.01em;
  }
  .pdf-doc h2 {
    font-size: 1.4em;
    font-weight: 600;
    margin: 1.6em 0 0.4em 0;
    color: #222;
    padding-top: 0.8em;
    border-top: 1px solid #e0e0e0;
  }
  .pdf-doc h3 {
    font-size: 1.15em;
    font-weight: 600;
    margin: 1.3em 0 0.3em 0;
    color: #333;
  }
  .pdf-doc h4, .pdf-doc h5, .pdf-doc h6 {
    font-size: 1em;
    font-weight: 600;
    margin: 1em 0 0.3em 0;
    color: #444;
  }

  /* Paragraphs */
  .pdf-doc p {
    margin: 0.7em 0;
  }

  /* Lists */
  .pdf-doc ul, .pdf-doc ol {
    margin: 0.6em 0;
    padding-left: 1.8em;
  }
  .pdf-doc li {
    margin: 0.2em 0;
  }
  .pdf-doc li > ul, .pdf-doc li > ol {
    margin: 0.1em 0;
  }

  /* Code blocks - with decorative top border */
  .pdf-doc pre {
    background: #f8f8f8;
    border: 1px solid #e0e0e0;
    border-top: 3px solid #2563EB;
    border-radius: 0 0 6px 6px;
    padding: 14px 18px;
    margin: 1em 0;
    overflow-x: hidden;
    word-wrap: break-word;
    white-space: pre-wrap;
    page-break-inside: avoid;
  }
  .pdf-doc pre code {
    background: none !important;
    border: none !important;
    padding: 0 !important;
    font-size: 0.85em;
    line-height: 1.55;
    color: #1a1a1a;
  }

  /* Inline code */
  .pdf-doc code {
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 3px;
    padding: 1px 5px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.88em;
  }

  /* Blockquote - left accent bar */
  .pdf-doc blockquote {
    margin: 1em 0;
    padding: 8px 16px;
    border-left: 4px solid #2563EB;
    background: #f7f9fc;
    color: #444;
    border-radius: 0 4px 4px 0;
    page-break-inside: avoid;
  }
  .pdf-doc blockquote p {
    margin: 0.3em 0;
  }

  /* Tables */
  .pdf-doc table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    font-size: 0.92em;
    page-break-inside: avoid;
  }
  .pdf-doc th {
    background: #f0f4f8;
    font-weight: 600;
    text-align: left;
    border: 1px solid #d0d7de;
    padding: 8px 12px;
  }
  .pdf-doc td {
    border: 1px solid #d0d7de;
    padding: 8px 12px;
  }
  .pdf-doc tr:nth-child(even) td {
    background: #fafbfc;
  }

  /* Links */
  .pdf-doc a {
    color: #2563EB;
    text-decoration: none;
  }

  /* Horizontal rule */
  .pdf-doc hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 1.5em 0;
  }

  /* Images */
  .pdf-doc img {
    max-width: 100%;
    height: auto;
  }

  /* Strong & emphasis */
  .pdf-doc strong { font-weight: 700; }
  .pdf-doc em { font-style: italic; }
`;

export async function exportToPdf(
  markdown: string,
  title: string,
  styleType: StyleType
): Promise<void> {
  const html = marked(markdown) as string;
  const themeCSS = pdfStyles[styleType] || '';

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '714px'; // A4 minus margins
  container.style.padding = '0';
  container.style.background = 'white';
  container.style.zIndex = '-9999';
  container.innerHTML = `
    <style>${basePdfCSS}${themeCSS}</style>
    <div class="pdf-doc">${html}</div>
  `;

  document.body.appendChild(container);

  try {
    await document.fonts.ready;
    // Small delay for layout to settle
    await new Promise(r => setTimeout(r, 100));

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: 714,
      logging: false,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    if (contentHeight <= pageHeight - margin * 2) {
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, margin, contentWidth, contentHeight);
    } else {
      const pageContentHeight = pageHeight - margin * 2;
      const totalPages = Math.ceil(contentHeight / pageContentHeight);
      const sourceSliceHeight = (canvas.height / contentHeight) * pageContentHeight;

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const sourceY = page * sourceSliceHeight;
        const sliceHeight = Math.min(sourceSliceHeight, canvas.height - sourceY);
        const destHeight = (sliceHeight / sourceSliceHeight) * pageContentHeight;

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeight;
        const ctx = pageCanvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0, sourceY, canvas.width, sliceHeight,
          0, 0, canvas.width, sliceHeight
        );

        pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', margin, margin, contentWidth, destHeight);
      }
    }

    pdf.save(`${title}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
