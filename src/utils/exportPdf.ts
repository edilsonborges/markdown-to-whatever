import html2pdf from 'html2pdf.js';
import { marked } from 'marked';
import { getStyleCSS } from '../styles/previewStyles';
import type { StyleType } from '../types';

/**
 * Export markdown content to PDF
 */
export async function exportToPdf(
  markdown: string,
  title: string,
  styleType: StyleType
): Promise<void> {
  const html = marked(markdown) as string;
  const css = getStyleCSS(styleType);

  // Create a container with the styled content
  const container = document.createElement('div');
  container.innerHTML = `
    <style>
      ${css}
      @page {
        margin: 10mm;
        size: A4;
      }
      body {
        font-family: 'Inter', system-ui, sans-serif;
      }
    </style>
    <div class="preview-content">${html}</div>
  `;

  const options = {
    margin: 10,
    filename: `${title}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait' as const,
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
    },
  };

  await html2pdf().set(options).from(container).save();
}
