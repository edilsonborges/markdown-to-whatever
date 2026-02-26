import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { marked } from 'marked';
import { getStyleCSS } from '../styles/previewStyles';
import type { StyleType } from '../types';

/**
 * Export markdown content to PDF using jsPDF + html2canvas
 */
export async function exportToPdf(
  markdown: string,
  title: string,
  styleType: StyleType
): Promise<void> {
  const html = marked(markdown) as string;
  const css = getStyleCSS(styleType);

  // Create a visible container in the viewport (required by html2canvas)
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '794px'; // A4 width at 96dpi
  container.style.padding = '40px';
  container.style.background = 'white';
  container.style.zIndex = '-9999';
  container.style.opacity = '1';
  container.innerHTML = `
    <style>${css}</style>
    <div class="preview-content">${html}</div>
  `;

  document.body.appendChild(container);

  try {
    // Wait for fonts/images to load
    await document.fonts.ready;

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    // If content fits in one page
    if (contentHeight <= pageHeight - margin * 2) {
      pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight);
    } else {
      // Multi-page: slice the canvas into page-sized chunks
      const pageContentHeight = pageHeight - margin * 2;
      const totalPages = Math.ceil(contentHeight / pageContentHeight);
      const sourceSliceHeight = (canvas.height / contentHeight) * pageContentHeight;

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const sourceY = page * sourceSliceHeight;
        const sliceHeight = Math.min(sourceSliceHeight, canvas.height - sourceY);
        const destHeight = (sliceHeight / sourceSliceHeight) * pageContentHeight;

        // Create a temporary canvas for this page slice
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

        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(pageImgData, 'JPEG', margin, margin, contentWidth, destHeight);
      }
    }

    pdf.save(`${title}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
