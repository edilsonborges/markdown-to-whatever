import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFontsHelvetica from 'pdfmake/build/standard-fonts/Helvetica';
import * as pdfFontsCourier from 'pdfmake/build/standard-fonts/Courier';
import * as pdfFontsTimes from 'pdfmake/build/standard-fonts/Times';
import htmlToPdfmake from 'html-to-pdfmake';
import { marked } from 'marked';
import type { StyleType } from '../types';

// Register standard PDF fonts (no external font files needed)
pdfMake.fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique',
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic',
  },
};

// Load font data into VFS
const fontsData = {
  ...(pdfFontsHelvetica as Record<string, unknown>),
  ...(pdfFontsCourier as Record<string, unknown>),
  ...(pdfFontsTimes as Record<string, unknown>),
};
if ('vfs' in fontsData && typeof fontsData.vfs === 'object') {
  pdfMake.vfs = fontsData.vfs as Record<string, string>;
} else {
  // Fallback: merge all vfs objects from individual font modules
  const vfs: Record<string, string> = {};
  for (const mod of [pdfFontsHelvetica, pdfFontsCourier, pdfFontsTimes]) {
    const m = mod as Record<string, unknown>;
    if (m.vfs && typeof m.vfs === 'object') {
      Object.assign(vfs, m.vfs);
    } else if (m.default && typeof m.default === 'object') {
      const d = m.default as Record<string, unknown>;
      if (d.vfs && typeof d.vfs === 'object') {
        Object.assign(vfs, d.vfs);
      }
    }
  }
  pdfMake.vfs = vfs as Record<string, string>;
}

interface ThemeConfig {
  defaultFont: string;
  fontSize: number;
  lineHeight: number;
  headingFont: string;
  codeFont: string;
  codeFontSize: number;
  accentColor: string;
  textColor: string;
  headingColor: string;
  pageMargins: [number, number, number, number];
  paragraphSpacing: number;
  justifyText: boolean;
}

const themeConfigs: Record<StyleType, ThemeConfig> = {
  basico: {
    defaultFont: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
    headingFont: 'Helvetica',
    codeFont: 'Courier',
    codeFontSize: 9,
    accentColor: '#2563EB',
    textColor: '#1A1A1A',
    headingColor: '#111111',
    pageMargins: [40, 40, 40, 40],
    paragraphSpacing: 6,
    justifyText: false,
  },
  academico: {
    defaultFont: 'Times',
    fontSize: 12,
    lineHeight: 1.6,
    headingFont: 'Times',
    codeFont: 'Courier',
    codeFontSize: 9,
    accentColor: '#333333',
    textColor: '#1A1A1A',
    headingColor: '#000000',
    pageMargins: [50, 50, 50, 50],
    paragraphSpacing: 8,
    justifyText: true,
  },
  tecnico: {
    defaultFont: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.35,
    headingFont: 'Helvetica',
    codeFont: 'Courier',
    codeFontSize: 9,
    accentColor: '#2563EB',
    textColor: '#1A1A1A',
    headingColor: '#1E293B',
    pageMargins: [40, 40, 40, 40],
    paragraphSpacing: 5,
    justifyText: false,
  },
  compacto: {
    defaultFont: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.25,
    headingFont: 'Helvetica',
    codeFont: 'Courier',
    codeFontSize: 8,
    accentColor: '#2563EB',
    textColor: '#1A1A1A',
    headingColor: '#222222',
    pageMargins: [30, 30, 30, 30],
    paragraphSpacing: 3,
    justifyText: false,
  },
};

function buildStyles(theme: ThemeConfig) {
  return {
    'html-h1': {
      fontSize: theme.fontSize * 2,
      bold: true,
      color: theme.headingColor,
      font: theme.headingFont,
      margin: [0, 0, 0, theme.paragraphSpacing * 2] as [number, number, number, number],
    },
    'html-h2': {
      fontSize: theme.fontSize * 1.5,
      bold: true,
      color: theme.headingColor,
      font: theme.headingFont,
      margin: [0, theme.paragraphSpacing * 3, 0, theme.paragraphSpacing] as [number, number, number, number],
    },
    'html-h3': {
      fontSize: theme.fontSize * 1.25,
      bold: true,
      color: theme.headingColor,
      font: theme.headingFont,
      margin: [0, theme.paragraphSpacing * 2, 0, theme.paragraphSpacing] as [number, number, number, number],
    },
    'html-h4': {
      fontSize: theme.fontSize * 1.1,
      bold: true,
      color: theme.headingColor,
      font: theme.headingFont,
      margin: [0, theme.paragraphSpacing * 2, 0, theme.paragraphSpacing] as [number, number, number, number],
    },
    'html-p': {
      margin: [0, theme.paragraphSpacing, 0, theme.paragraphSpacing] as [number, number, number, number],
      alignment: theme.justifyText ? ('justify' as const) : ('left' as const),
    },
    'html-a': {
      color: theme.accentColor,
      decoration: 'underline' as const,
    },
    'html-strong': {
      bold: true,
    },
    'html-em': {
      italics: true,
    },
    'html-code': {
      font: theme.codeFont,
      fontSize: theme.codeFontSize,
      background: '#F0F0F0',
    },
    'html-pre': {
      font: theme.codeFont,
      fontSize: theme.codeFontSize,
      margin: [0, theme.paragraphSpacing, 0, theme.paragraphSpacing] as [number, number, number, number],
      background: '#F5F5F5',
    },
    'html-blockquote': {
      italics: true,
      color: '#555555',
      margin: [20, theme.paragraphSpacing, 0, theme.paragraphSpacing] as [number, number, number, number],
    },
    'html-li': {
      margin: [0, 2, 0, 2] as [number, number, number, number],
    },
    'html-table': {
      margin: [0, theme.paragraphSpacing, 0, theme.paragraphSpacing] as [number, number, number, number],
    },
    'html-th': {
      bold: true,
      fillColor: '#F0F4F8',
      color: theme.textColor,
    },
    'html-td': {
      color: theme.textColor,
    },
  };
}

function buildDefaultStyles(theme: ThemeConfig) {
  return {
    b: { bold: true },
    strong: { bold: true },
    i: { italics: true },
    em: { italics: true },
    h1: {
      fontSize: theme.fontSize * 2,
      bold: true,
      color: theme.headingColor,
      font: theme.headingFont,
      marginBottom: theme.paragraphSpacing * 2,
    },
    h2: {
      fontSize: theme.fontSize * 1.5,
      bold: true,
      color: theme.headingColor,
      font: theme.headingFont,
      marginBottom: theme.paragraphSpacing,
    },
    h3: {
      fontSize: theme.fontSize * 1.25,
      bold: true,
      color: theme.headingColor,
      font: theme.headingFont,
      marginBottom: theme.paragraphSpacing,
    },
    h4: {
      fontSize: theme.fontSize * 1.1,
      bold: true,
      color: theme.headingColor,
      font: theme.headingFont,
    },
    a: {
      color: theme.accentColor,
      decoration: 'underline',
    },
    th: {
      bold: true,
      fillColor: '#F0F4F8',
    },
    code: {
      font: theme.codeFont,
      fontSize: theme.codeFontSize,
      background: '#F0F0F0',
      margin: [0, 0, 0, 0],
    },
    pre: {
      font: theme.codeFont,
      fontSize: theme.codeFontSize,
      background: '#F5F5F5',
      margin: [0, 2, 0, 2],
    },
  };
}

function buildTableLayouts() {
  return {
    cleanLayout: {
      hLineWidth: (i: number, node: { table: { body: unknown[] } }) => {
        return (i === 0 || i === node.table.body.length) ? 1 : 0.5;
      },
      vLineWidth: (i: number, node: { table: { widths: unknown[] } }) => {
        return (i === 0 || i === node.table.widths.length) ? 1 : 0.5;
      },
      hLineColor: () => '#D0D7DE',
      vLineColor: () => '#D0D7DE',
      paddingLeft: () => 6,
      paddingRight: () => 6,
      paddingTop: () => 4,
      paddingBottom: () => 4,
    },
  };
}

/**
 * Percorre a árvore do pdfmake e transforma nodes de inline code
 * para incluir espaços internos com o mesmo background,
 * simulando padding CSS no texto.
 */
function addCodePadding(nodes: unknown[]): void {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node || typeof node !== 'object') continue;
    const n = node as Record<string, unknown>;

    // Se é inline code, adicionar espaços finos dentro do texto (mesmo background)
    if (n.style && Array.isArray(n.style) && (n.style as string[]).includes('html-code')) {
      if (typeof n.text === 'string') {
        n.text = ` ${n.text} `;
        n.lineHeight = 1.6;
      }
    }

    // Recursão em filhos
    if (Array.isArray(n.text)) addCodePadding(n.text as unknown[]);
    if (Array.isArray(n.stack)) addCodePadding(n.stack as unknown[]);
    if (Array.isArray(n.columns)) addCodePadding(n.columns as unknown[]);
    if (n.table && typeof n.table === 'object') {
      const table = n.table as Record<string, unknown>;
      if (Array.isArray(table.body)) {
        for (const row of table.body as unknown[][]) {
          if (Array.isArray(row)) {
            for (const cell of row) {
              if (cell && typeof cell === 'object') {
                const c = cell as Record<string, unknown>;
                if (Array.isArray(c.text)) addCodePadding(c.text as unknown[]);
                if (Array.isArray(c.stack)) addCodePadding(c.stack as unknown[]);
              }
            }
          }
        }
      }
    }
  }
}

export async function exportToPdf(
  markdown: string,
  title: string,
  styleType: StyleType
): Promise<void> {
  const html = marked(markdown) as string;
  const theme = themeConfigs[styleType];

  const converted = htmlToPdfmake(html, {
    tableAutoSize: true,
    defaultStyles: buildDefaultStyles(theme),
  });

  // Adicionar espaços ao redor de inline code para simular padding
  addCodePadding(converted);

  const docDefinition = {
    content: converted,
    defaultStyle: {
      font: theme.defaultFont,
      fontSize: theme.fontSize,
      lineHeight: theme.lineHeight,
      color: theme.textColor,
    },
    styles: buildStyles(theme),
    pageMargins: theme.pageMargins,
    pageSize: 'A4' as const,
  };

  const tableLayouts = buildTableLayouts();

  const pdf = pdfMake.createPdf(docDefinition, tableLayouts);
  pdf.download(`${title}.pdf`);
}
