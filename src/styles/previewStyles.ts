import type { StyleType } from '../types';

/**
 * Base CSS styles shared across all themes
 */
const baseStyles = `
  .preview-content {
    line-height: 1.6;
    color: #1A1A1A;
  }
  .preview-content h1,
  .preview-content h2,
  .preview-content h3,
  .preview-content h4,
  .preview-content h5,
  .preview-content h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
    line-height: 1.3;
  }
  .preview-content h1:first-child,
  .preview-content h2:first-child,
  .preview-content h3:first-child {
    margin-top: 0;
  }
  .preview-content h1 { font-size: 2em; }
  .preview-content h2 { font-size: 1.5em; }
  .preview-content h3 { font-size: 1.25em; }
  .preview-content h4 { font-size: 1.1em; }
  .preview-content p {
    margin: 1em 0;
  }
  .preview-content ul,
  .preview-content ol {
    margin: 1em 0;
    padding-left: 2em;
  }
  .preview-content li {
    margin: 0.25em 0;
  }
  .preview-content blockquote {
    margin: 1em 0;
    padding-left: 1em;
    border-left: 4px solid #E5E5E5;
    color: #666;
  }
  .preview-content a {
    color: #2563EB;
    text-decoration: underline;
  }
  .preview-content img {
    max-width: 100%;
    height: auto;
  }
  .preview-content hr {
    border: none;
    border-top: 1px solid #E5E5E5;
    margin: 2em 0;
  }
  .preview-content table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  .preview-content th,
  .preview-content td {
    border: 1px solid #E5E5E5;
    padding: 0.5em 1em;
    text-align: left;
  }
  .preview-content th {
    background-color: #FAFAFA;
    font-weight: 600;
  }
`;

/**
 * Style-specific CSS for each predefined theme
 */
export const styleConfigs: Record<StyleType, { name: string; description: string; css: string }> = {
  basico: {
    name: 'Básico',
    description: 'Tipografia limpa sem decorações',
    css: `
      ${baseStyles}
      .preview-content {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 16px;
      }
      .preview-content code {
        background-color: #F5F5F5;
        border: 1px solid #E5E5E5;
        border-radius: 3px;
        padding: 0.2em 0.4em;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.9em;
      }
      .preview-content pre {
        background-color: #F5F5F5;
        border: 1px solid #E5E5E5;
        border-radius: 4px;
        padding: 1em;
        overflow-x: auto;
        margin: 1em 0;
      }
      .preview-content pre code {
        background: none;
        border: none;
        padding: 0;
        font-size: 0.875em;
      }
    `
  },
  academico: {
    name: 'Acadêmico',
    description: 'Fonte serifada, ideal para artigos',
    css: `
      ${baseStyles}
      .preview-content {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 16px;
        line-height: 1.8;
      }
      .preview-content h1,
      .preview-content h2,
      .preview-content h3 {
        font-family: Georgia, 'Times New Roman', serif;
      }
      .preview-content blockquote {
        font-style: italic;
        margin-left: 2em;
        margin-right: 2em;
        padding-left: 1em;
        border-left: 3px solid #666;
      }
      .preview-content code {
        background-color: #F5F5F5;
        border: 1px solid #E5E5E5;
        border-radius: 3px;
        padding: 0.2em 0.4em;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
      }
      .preview-content pre {
        background-color: #F5F5F5;
        border: 1px solid #E5E5E5;
        border-radius: 4px;
        padding: 1em;
        overflow-x: auto;
        margin: 1.5em 0;
      }
      .preview-content pre code {
        background: none;
        border: none;
        padding: 0;
      }
      .preview-content p {
        text-align: justify;
        text-indent: 1.5em;
      }
      .preview-content p:first-of-type {
        text-indent: 0;
      }
    `
  },
  tecnico: {
    name: 'Técnico',
    description: 'Otimizado para documentação de código',
    css: `
      ${baseStyles}
      .preview-content {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 15px;
      }
      .preview-content code {
        background-color: #1E293B;
        color: #E2E8F0;
        border-radius: 3px;
        padding: 0.2em 0.4em;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.9em;
      }
      .preview-content pre {
        background-color: #1E293B;
        color: #E2E8F0;
        border-radius: 6px;
        padding: 1.25em;
        overflow-x: auto;
        margin: 1.25em 0;
      }
      .preview-content pre code {
        background: none;
        padding: 0;
        color: inherit;
        font-size: 0.875em;
        line-height: 1.6;
      }
      .preview-content table {
        font-size: 0.9em;
      }
      .preview-content th,
      .preview-content td {
        border: 1px solid #CBD5E1;
        padding: 0.75em 1em;
      }
      .preview-content th {
        background-color: #F1F5F9;
        font-weight: 600;
      }
      .preview-content h1,
      .preview-content h2,
      .preview-content h3 {
        border-bottom: 1px solid #E5E5E5;
        padding-bottom: 0.3em;
      }
    `
  },
  compacto: {
    name: 'Compacto',
    description: 'Margens menores, maior densidade',
    css: `
      ${baseStyles}
      .preview-content {
        font-family: 'Inter', system-ui, sans-serif;
        font-size: 14px;
        line-height: 1.4;
      }
      .preview-content h1 { font-size: 1.6em; margin-top: 1em; }
      .preview-content h2 { font-size: 1.3em; margin-top: 0.8em; }
      .preview-content h3 { font-size: 1.1em; margin-top: 0.6em; }
      .preview-content p {
        margin: 0.6em 0;
      }
      .preview-content ul,
      .preview-content ol {
        margin: 0.6em 0;
        padding-left: 1.5em;
      }
      .preview-content li {
        margin: 0.15em 0;
      }
      .preview-content code {
        background-color: #F5F5F5;
        border: 1px solid #E5E5E5;
        border-radius: 2px;
        padding: 0.1em 0.3em;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 0.85em;
      }
      .preview-content pre {
        background-color: #F5F5F5;
        border: 1px solid #E5E5E5;
        border-radius: 3px;
        padding: 0.75em;
        overflow-x: auto;
        margin: 0.75em 0;
      }
      .preview-content pre code {
        background: none;
        border: none;
        padding: 0;
        font-size: 0.8em;
      }
      .preview-content blockquote {
        margin: 0.6em 0;
        padding-left: 0.75em;
      }
    `
  }
};

/**
 * Get CSS for a specific style
 */
export function getStyleCSS(styleType: StyleType): string {
  return styleConfigs[styleType].css;
}

/**
 * Get all available style options
 */
export function getStyleOptions() {
  return Object.entries(styleConfigs).map(([id, config]) => ({
    id: id as StyleType,
    name: config.name,
    description: config.description
  }));
}
