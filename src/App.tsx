import { useState, useCallback } from 'react';
import { Header, EditorPane, PreviewPane, ToastNotifications } from './components';
import { useDebounce } from './hooks/useDebounce';
import { useToast } from './hooks/useToast';
import { extractTitle } from './utils/titleExtractor';
import { exportToPdf } from './utils/exportPdf';
import { exportToHtml } from './utils/exportHtml';
import { exportToDocx } from './utils/exportDocx';
import type { StyleType, ExportFormat, ExportState } from './types';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StyleType>('basico');
  const [exportState, setExportState] = useState<ExportState>({
    isExporting: false,
    format: null,
  });

  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Debounce markdown for preview rendering (150ms)
  const debouncedMarkdown = useDebounce(markdown, 150);

  const hasContent = markdown.trim().length > 0;

  const handleExport = useCallback(
    async (format: ExportFormat) => {
      if (!hasContent) return;

      setExportState({ isExporting: true, format });

      try {
        const title = extractTitle(markdown);

        switch (format) {
          case 'pdf':
            await exportToPdf(markdown, title, selectedStyle);
            showSuccess(`PDF "${title}.pdf" exportado com sucesso!`);
            break;
          case 'html':
            await exportToHtml(markdown, title, selectedStyle);
            showSuccess(`HTML "${title}.html" exportado com sucesso!`);
            break;
          case 'docx':
            await exportToDocx(markdown, title);
            showSuccess(`DOCX "${title}.docx" exportado com sucesso!`);
            break;
        }
      } catch (error) {
        console.error('Export error:', error);
        showError('Algo deu errado. Tente novamente.');
      } finally {
        setExportState({ isExporting: false, format: null });
      }
    },
    [markdown, selectedStyle, hasContent, showSuccess, showError]
  );

  return (
    <div className="h-full flex flex-col bg-neutral-100">
      <Header
        selectedStyle={selectedStyle}
        onStyleChange={setSelectedStyle}
        onExport={handleExport}
        exportState={exportState}
        hasContent={hasContent}
      />

      <main className="flex-1 flex min-h-0 gap-px bg-border">
        <EditorPane value={markdown} onChange={setMarkdown} />
        <PreviewPane markdown={debouncedMarkdown} styleType={selectedStyle} />
      </main>

      <ToastNotifications toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;
