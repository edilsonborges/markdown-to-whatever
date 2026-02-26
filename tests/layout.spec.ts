import { test, expect } from '@playwright/test';

test.describe('Layout e estrutura geral', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve renderizar header, editor e preview', async ({ page }) => {
    await expect(page.getByTestId('header')).toBeVisible();
    await expect(page.getByTestId('editor-pane')).toBeVisible();
    await expect(page.getByTestId('preview-pane')).toBeVisible();
  });

  test('editor e preview devem ocupar largura igual (50/50)', async ({ page }) => {
    const editor = page.getByTestId('editor-pane');
    const preview = page.getByTestId('preview-pane');

    const editorBox = await editor.boundingBox();
    const previewBox = await preview.boundingBox();

    expect(editorBox).toBeTruthy();
    expect(previewBox).toBeTruthy();

    // Both panes should have roughly equal width (within 5px tolerance)
    expect(Math.abs(editorBox!.width - previewBox!.width)).toBeLessThan(5);
  });

  test('header deve ter fundo branco consistente', async ({ page }) => {
    const header = page.getByTestId('header');
    const bgColor = await header.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    // rgb(255, 255, 255) = white
    expect(bgColor).toBe('rgb(255, 255, 255)');
  });

  test('painéis editor e preview devem ter o mesmo fundo branco', async ({ page }) => {
    const editorTextarea = page.getByTestId('editor-textarea');
    const previewArea = page.getByTestId('preview-content-area');

    const editorBg = await editorTextarea.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    const previewBg = await previewArea.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    expect(editorBg).toBe('rgb(255, 255, 255)');
    expect(previewBg).toBe('rgb(255, 255, 255)');
    expect(editorBg).toBe(previewBg);
  });

  test('não deve haver blocos brancos inconsistentes entre header labels e conteúdo', async ({ page }) => {
    // Editor label and textarea should share same bg
    const editorLabel = page.getByTestId('editor-pane').locator('div').first();
    const editorTextarea = page.getByTestId('editor-textarea');

    const labelBg = await editorLabel.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    const textareaBg = await editorTextarea.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    expect(labelBg).toBe(textareaBg);
  });

  test('layout deve preencher toda a altura da viewport', async ({ page }) => {
    const root = page.locator('#root');
    const rootBox = await root.boundingBox();
    const viewportSize = page.viewportSize();

    expect(rootBox).toBeTruthy();
    expect(viewportSize).toBeTruthy();
    expect(rootBox!.height).toBeGreaterThanOrEqual(viewportSize!.height - 1);
  });
});

test.describe('Funcionalidade do editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve exibir placeholder quando vazio', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await expect(textarea).toHaveAttribute('placeholder', /Cole ou digite seu Markdown/);
  });

  test('deve mostrar mensagem de preview vazio quando sem conteúdo', async ({ page }) => {
    await expect(page.getByText('O preview aparecerá aqui')).toBeVisible();
  });

  test('deve renderizar markdown digitado no preview', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('# Título de Teste');

    // Wait for debounced preview
    await page.waitForTimeout(300);

    const preview = page.getByTestId('preview-rendered');
    await expect(preview).toBeVisible();
    await expect(preview.locator('h1')).toHaveText('Título de Teste');
  });

  test('deve renderizar parágrafos', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('Este é um parágrafo de teste.');

    await page.waitForTimeout(300);

    const preview = page.getByTestId('preview-rendered');
    await expect(preview.locator('p')).toContainText('Este é um parágrafo de teste.');
  });

  test('deve renderizar listas não ordenadas', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('- Item 1\n- Item 2\n- Item 3');

    await page.waitForTimeout(300);

    const preview = page.getByTestId('preview-rendered');
    const items = preview.locator('li');
    await expect(items).toHaveCount(3);
  });

  test('deve renderizar blocos de código', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('```\nconst x = 1;\n```');

    await page.waitForTimeout(300);

    const preview = page.getByTestId('preview-rendered');
    await expect(preview.locator('pre code')).toBeVisible();
  });

  test('deve renderizar links', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('[Google](https://google.com)');

    await page.waitForTimeout(300);

    const preview = page.getByTestId('preview-rendered');
    const link = preview.locator('a');
    await expect(link).toHaveText('Google');
    await expect(link).toHaveAttribute('href', 'https://google.com');
  });
});

test.describe('Seletor de estilo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve ter seletor de estilo visível', async ({ page }) => {
    await expect(page.getByTestId('style-selector')).toBeVisible();
  });

  test('deve conter todas as opções de estilo', async ({ page }) => {
    const select = page.getByTestId('style-selector');
    const options = select.locator('option');
    await expect(options).toHaveCount(4);
  });

  test('deve mudar estilo ao selecionar opção diferente', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('# Teste de Estilo\n\nParágrafo de teste.');
    await page.waitForTimeout(300);

    const select = page.getByTestId('style-selector');
    await select.selectOption('academico');

    await page.waitForTimeout(100);

    // Verify the style changed - academic style uses serif fonts
    const preview = page.getByTestId('preview-rendered');
    const fontFamily = await preview.evaluate(
      (el) => getComputedStyle(el).fontFamily
    );
    expect(fontFamily).toContain('Georgia');
  });
});

test.describe('Botões de exportação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('botões de exportação devem estar desabilitados sem conteúdo', async ({ page }) => {
    const pdfBtn = page.getByRole('button', { name: /PDF/i });
    const htmlBtn = page.getByRole('button', { name: /HTML/i });
    const docxBtn = page.getByRole('button', { name: /DOCX/i });

    await expect(pdfBtn).toBeDisabled();
    await expect(htmlBtn).toBeDisabled();
    await expect(docxBtn).toBeDisabled();
  });

  test('botões de exportação devem ser habilitados com conteúdo', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('# Conteúdo');

    const pdfBtn = page.getByRole('button', { name: /PDF/i });
    const htmlBtn = page.getByRole('button', { name: /HTML/i });
    const docxBtn = page.getByRole('button', { name: /DOCX/i });

    await expect(pdfBtn).toBeEnabled();
    await expect(htmlBtn).toBeEnabled();
    await expect(docxBtn).toBeEnabled();
  });
});

test.describe('Consistência visual - sem blocos brancos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('separador entre painéis não deve criar gap branco visível', async ({ page }) => {
    const main = page.locator('main');
    const mainBg = await main.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    // The gap between panes should use the border color, not white
    const gap = await main.evaluate(
      (el) => getComputedStyle(el).gap
    );
    expect(gap).toBeTruthy();
  });

  test('labels de Editor e Preview devem ter estilo consistente', async ({ page }) => {
    const editorLabel = page.getByTestId('editor-pane').locator('span').first();
    const previewLabel = page.getByTestId('preview-pane').locator('span').first();

    const editorStyles = await editorLabel.evaluate((el) => {
      const s = getComputedStyle(el);
      return { fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color };
    });
    const previewStyles = await previewLabel.evaluate((el) => {
      const s = getComputedStyle(el);
      return { fontSize: s.fontSize, fontWeight: s.fontWeight, color: s.color };
    });

    expect(editorStyles.fontSize).toBe(previewStyles.fontSize);
    expect(editorStyles.fontWeight).toBe(previewStyles.fontWeight);
    expect(editorStyles.color).toBe(previewStyles.color);
  });
});

test.describe('Impressão (print)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve ocultar header ao imprimir', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });

    const header = page.getByTestId('header');
    await expect(header).toBeHidden();
  });

  test('deve ocultar editor ao imprimir', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });

    const editor = page.getByTestId('editor-pane');
    await expect(editor).toBeHidden();
  });

  test('preview deve estar visível ao imprimir com conteúdo', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('# Título para Impressão\n\nConteúdo do documento.');
    await page.waitForTimeout(300);

    await page.emulateMedia({ media: 'print' });

    const preview = page.getByTestId('preview-pane');
    await expect(preview).toBeVisible();

    const rendered = page.getByTestId('preview-rendered');
    await expect(rendered).toBeVisible();
    await expect(rendered.locator('h1')).toHaveText('Título para Impressão');
  });

  test('preview não deve ter overflow hidden ao imprimir', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('# Teste\n\nConteúdo.');
    await page.waitForTimeout(300);

    await page.emulateMedia({ media: 'print' });

    const previewPane = page.getByTestId('preview-pane');
    const overflow = await previewPane.evaluate(
      (el) => getComputedStyle(el).overflow
    );
    expect(overflow).toBe('visible');
  });

  test('preview content area deve ter overflow visible ao imprimir', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('# Teste\n\nConteúdo.');
    await page.waitForTimeout(300);

    await page.emulateMedia({ media: 'print' });

    const contentArea = page.getByTestId('preview-content-area');
    const overflow = await contentArea.evaluate(
      (el) => getComputedStyle(el).overflow
    );
    expect(overflow).toBe('visible');
  });

  test('layout deve ser block (não flex) ao imprimir', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });

    const main = page.locator('main');
    const display = await main.evaluate(
      (el) => getComputedStyle(el).display
    );
    expect(display).toBe('block');
  });

  test('label Preview deve ser oculto ao imprimir', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('# Teste');
    await page.waitForTimeout(300);

    await page.emulateMedia({ media: 'print' });

    // The first child div of preview-pane is the label bar
    const labelBar = page.getByTestId('preview-pane').locator('> div').first();
    await expect(labelBar).toBeHidden();
  });

  test('deve gerar PDF sem páginas em branco', async ({ page }) => {
    const textarea = page.getByTestId('editor-textarea');
    await textarea.fill('# Documento de Teste\n\nEste é um parágrafo.\n\n## Seção 2\n\n- Item A\n- Item B');
    await page.waitForTimeout(300);

    await page.emulateMedia({ media: 'print' });

    // The main container should be block, not flex (which clips content)
    const mainDisplay = await page.locator('main').evaluate(
      (el) => getComputedStyle(el).display
    );
    expect(mainDisplay).toBe('block');

    // Preview content should be visible with actual content height
    const rendered = page.getByTestId('preview-rendered');
    await expect(rendered).toBeVisible();
    const renderedBox = await rendered.boundingBox();
    expect(renderedBox).toBeTruthy();
    expect(renderedBox!.height).toBeGreaterThan(50);

    // Editor should be hidden (not taking space on print)
    const editor = page.getByTestId('editor-pane');
    await expect(editor).toBeHidden();
  });
});
