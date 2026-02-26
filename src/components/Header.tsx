import { Logo } from './Logo';
import { StyleSelector } from './StyleSelector';
import { ExportButtons } from './ExportButtons';
import type { StyleType, ExportFormat, ExportState } from '../types';

interface HeaderProps {
  selectedStyle: StyleType;
  onStyleChange: (style: StyleType) => void;
  onExport: (format: ExportFormat) => void;
  exportState: ExportState;
  hasContent: boolean;
}

export function Header({
  selectedStyle,
  onStyleChange,
  onExport,
  exportState,
  hasContent
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center justify-between gap-4 flex-wrap" data-testid="header">
      <Logo />
      <div className="flex items-center gap-4 flex-wrap">
        <StyleSelector
          selectedStyle={selectedStyle}
          onStyleChange={onStyleChange}
        />
        <ExportButtons
          onExport={onExport}
          exportState={exportState}
          disabled={!hasContent}
        />
      </div>
    </header>
  );
}
