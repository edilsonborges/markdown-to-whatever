export type StyleType = 'basico' | 'academico' | 'tecnico' | 'compacto';

export interface StyleOption {
  id: StyleType;
  name: string;
  description: string;
}

export type ExportFormat = 'pdf' | 'html' | 'docx';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ExportState {
  isExporting: boolean;
  format: ExportFormat | null;
}
