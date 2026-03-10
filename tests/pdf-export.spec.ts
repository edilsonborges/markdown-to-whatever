import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

test.describe('Exportação PDF', () => {
  test('deve gerar PDF com conteúdo visível e tamanho adequado', async ({ page }) => {
    await page.goto('/');

    // Insert rich markdown content
    const markdown = [
      '# Refatoração API Receituário Agronômico',
      '',
      '## Resumo do Documento',
      '',
      'Este é um teste de exportação para **PDF** com conteúdo real e *formatação completa*.',
      '',
      '### Objetivos',
      '',
      '- Melhorar a arquitetura da API',
      '- Reduzir acoplamento entre módulos',
      '- Aumentar a cobertura de testes',
      '',
      '### Exemplo de código',
      '',
      '```java',
      'public class ReceituarioService {',
      '    private final ReceituarioRepository repo;',
      '',
      '    public Receituario criar(ReceituarioDTO dto) {',
      '        return repo.save(dto.toEntity());',
      '    }',
      '}',
      '```',
      '',
      '> A refatoração deve ser feita de forma incremental, sem quebrar contratos existentes.',
      '',
      '| Módulo | Status | Prioridade |',
      '|--------|--------|------------|',
      '| Auth | Concluído | Alta |',
      '| Receitas | Em andamento | Alta |',
      '| Relatórios | Pendente | Média |',
    ].join('\n');

    await page.getByTestId('editor-textarea').fill(markdown);
    await page.waitForTimeout(300);

    // Verify preview rendered
    await expect(page.getByTestId('preview-rendered')).toBeVisible();

    // Setup download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });

    // Click PDF export button
    await page.getByRole('button', { name: /PDF/i }).click();

    // Wait for download
    const download = await downloadPromise;
    const filePath = path.join('/tmp', download.suggestedFilename());
    await download.saveAs(filePath);

    // Verify file exists and has real content (not blank)
    const stats = fs.statSync(filePath);
    // Vector PDF (pdfmake) is much smaller than rasterized — 3KB+ means real content
    expect(stats.size).toBeGreaterThan(3000);

    // Clean up
    fs.unlinkSync(filePath);
  });
});
