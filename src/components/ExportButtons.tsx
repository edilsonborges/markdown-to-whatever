import type { ExportFormat, ExportState } from '../types';

interface ExportButtonsProps {
  onExport: (format: ExportFormat) => void;
  exportState: ExportState;
  disabled: boolean;
}

function Spinner() {
  return (
    <svg
      className="spinner w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExportButtons({ onExport, exportState, disabled }: ExportButtonsProps) {
  const buttons: { format: ExportFormat; label: string }[] = [
    { format: 'pdf', label: 'Baixar PDF' },
    { format: 'html', label: 'Baixar HTML' },
    { format: 'docx', label: 'Baixar DOCX' },
  ];

  return (
    <div className="flex items-center gap-2">
      {buttons.map(({ format, label }) => {
        const isExporting = exportState.isExporting && exportState.format === format;
        const isDisabled = disabled || exportState.isExporting;

        return (
          <button
            key={format}
            onClick={() => onExport(format)}
            disabled={isDisabled}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md
              transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
              ${isDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-accent text-white hover:bg-blue-700 active:bg-blue-800'
              }
            `}
            aria-label={label}
            aria-busy={isExporting}
          >
            {isExporting ? <Spinner /> : <DownloadIcon />}
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{format.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}
