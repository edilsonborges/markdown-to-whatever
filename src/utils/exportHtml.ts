import { marked } from 'marked';
import { saveAs } from 'file-saver';
import { getStyleCSS } from '../styles/previewStyles';
import type { StyleType } from '../types';

/**
 * Export markdown content to HTML file
 */
export async function exportToHtml(
  markdown: string,
  title: string,
  styleType: StyleType
): Promise<void> {
  const html = marked(markdown) as string;
  const css = getStyleCSS(styleType);

  // Create a complete HTML document
  const htmlDocument = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 2rem;
      background: #fff;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    ${css}
  </style>
</head>
<body>
  <div class="container">
    <div class="preview-content">
      ${html}
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlDocument], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `${title}.html`);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
