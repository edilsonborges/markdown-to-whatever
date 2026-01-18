import { useMemo } from 'react';
import { marked } from 'marked';
import { getStyleCSS } from '../styles/previewStyles';
import type { StyleType } from '../types';

interface PreviewPaneProps {
  markdown: string;
  styleType: StyleType;
}

// Configure marked for security
marked.setOptions({
  gfm: true, // GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
});

export function PreviewPane({ markdown, styleType }: PreviewPaneProps) {
  const html = useMemo(() => {
    if (!markdown.trim()) {
      return '';
    }
    return marked(markdown) as string;
  }, [markdown]);

  const styleCSS = useMemo(() => getStyleCSS(styleType), [styleType]);

  const isEmpty = !markdown.trim();

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="px-4 py-2 bg-secondary border-b border-border">
        <span className="text-sm font-medium text-gray-600">Preview</span>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-primary">
        <style>{styleCSS}</style>
        {isEmpty ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-400 text-sm">O preview aparecerá aqui</p>
          </div>
        ) : (
          <div
            className="preview-content max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
            aria-live="polite"
            role="region"
            aria-label="Preview do documento"
          />
        )}
      </div>
    </div>
  );
}
