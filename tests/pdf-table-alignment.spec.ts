import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import * as zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const markdownContent = fs.readFileSync(
  path.join(__dirname, '..', 'demo', 'markdown-example.md'),
  'utf-8'
);

/**
 * Extrai texto de um PDF vetorial gerado por pdfmake.
 * O texto fica em streams comprimidos (FlateDecode),
 * dentro de blocos BT...ET, codificado em hex (<...>) nos operadores TJ.
 * Remove espaços de kerning para formar palavras completas.
 */
function extractTextFromPdf(buffer: Buffer): string {
  const raw = buffer.toString('binary');
  const texts: string[] = [];

  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let streamMatch;
  while ((streamMatch = streamRegex.exec(raw)) !== null) {
    let content: string;
    try {
      content = zlib.inflateSync(Buffer.from(streamMatch[1], 'binary')).toString('utf-8');
    } catch {
      continue;
    }

    const btRegex = /BT\n([\s\S]*?)ET/g;
    let btMatch;
    while ((btMatch = btRegex.exec(content)) !== null) {
      const hexRegex = /<([0-9a-fA-F]+)>/g;
      let hexMatch;
      while ((hexMatch = hexRegex.exec(btMatch[1])) !== null) {
        const hex = hexMatch[1];
        let text = '';
        for (let i = 0; i < hex.length; i += 2) {
          text += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
        }
        if (text.trim()) texts.push(text.trim());
      }
    }
  }

  // Juntar fragmentos e normalizar espaços de kerning
  return texts.join(' ').replace(/\s+/g, ' ');
}

/**
 * Verifica presença de texto no PDF ignorando espaços de kerning.
 * pdfmake pode quebrar "Tarefa" em "T arefa", então normalizamos.
 */
function pdfContains(pdfText: string, expected: string): boolean {
  const normalize = (s: string) => s.replace(/\s+/g, '').toLowerCase();
  return normalize(pdfText).includes(normalize(expected));
}

test.describe('PDF — Tabela com inline code (demo markdown)', () => {
  test('deve gerar PDF com todo o conteúdo da tabela preservado', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('editor-textarea').fill(markdownContent);
    await page.waitForTimeout(300);

    // Verificar preview
    const preview = page.getByTestId('preview-rendered');
    await expect(preview).toBeVisible();
    await expect(preview.locator('table')).toBeVisible();
    await expect(preview.locator('th')).toHaveCount(3);

    // Exportar PDF
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    await page.getByRole('button', { name: /PDF/i }).click();
    const download = await downloadPromise;

    const filePath = path.join('/tmp', 'pdf-table-alignment-test.pdf');
    await download.saveAs(filePath);

    // Verificar tamanho
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(2000);

    // Extrair texto do PDF
    const pdfBuffer = fs.readFileSync(filePath);
    const text = extractTextFromPdf(pdfBuffer);

    // Título
    expect(pdfContains(text, 'TF pela Terefa com VDC')).toBe(true);

    // Cabeçalhos da tabela
    expect(pdfContains(text, 'Dado do TF')).toBe(true);
    expect(pdfContains(text, 'Na Tarefa?')).toBe(true);
    expect(pdfContains(text, 'Fonte na Tarefa')).toBe(true);

    // Inline code dentro de cells
    expect(pdfContains(text, 'Campo Tipo de Tarefa')).toBe(true);
    expect(pdfContains(text, 'Campo Local da Tarefa')).toBe(true);
    expect(pdfContains(text, 'Funcionário Responsável')).toBe(true);
    expect(pdfContains(text, 'Checklist Resposta Tarefa')).toBe(true);

    // Dados da tabela
    expect(pdfContains(text, 'Fiscal responsável')).toBe(true);
    expect(pdfContains(text, 'Respostas VDC')).toBe(true);
    expect(pdfContains(text, 'Propriedade/Local')).toBe(true);
    expect(pdfContains(text, 'Coordenadas geográficas')).toBe(true);
    expect(pdfContains(text, 'Município fiscalizado')).toBe(true);
    expect(pdfContains(text, 'Dados Complementares')).toBe(true);

    // O texto total deve ser substancial
    expect(text.length).toBeGreaterThan(200);

    fs.unlinkSync(filePath);
  });

  test('deve gerar PDF em todos os 4 estilos sem erro', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('editor-textarea').fill(markdownContent);
    await page.waitForTimeout(300);

    const estilos = ['basico', 'academico', 'tecnico', 'compacto'] as const;

    for (const estilo of estilos) {
      await page.getByTestId('style-selector').selectOption(estilo);
      await page.waitForTimeout(100);

      // Esperar botão estar habilitado
      const pdfBtn = page.getByRole('button', { name: /PDF/i });
      await expect(pdfBtn).toBeEnabled({ timeout: 10000 });

      const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
      await pdfBtn.click();
      const download = await downloadPromise;

      const filePath = path.join('/tmp', `pdf-table-${estilo}.pdf`);
      await download.saveAs(filePath);

      const stats = fs.statSync(filePath);
      expect(stats.size).toBeGreaterThan(2000);

      const pdfBuffer = fs.readFileSync(filePath);
      const text = extractTextFromPdf(pdfBuffer);

      // Cada estilo deve ter o conteúdo completo
      expect(pdfContains(text, 'Campo Tipo de Tarefa')).toBe(true);
      expect(pdfContains(text, 'Dado do TF')).toBe(true);
      expect(text.length).toBeGreaterThan(200);

      fs.unlinkSync(filePath);

      // Esperar export terminar antes do próximo
      await expect(pdfBtn).toBeEnabled({ timeout: 10000 });
    }
  });
});
