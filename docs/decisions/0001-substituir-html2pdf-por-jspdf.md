# ADR-0001: Substituir html2pdf.js por jsPDF + html2canvas

## Status

**Aceito** — 2025-03-08

## Context

O botão "Baixar PDF" gerava arquivos PDF com todas as páginas em branco.
O html2pdf.js é um wrapper sobre html2canvas + jsPDF, mas possui bugs
conhecidos que causam renderização vazia — especialmente quando o elemento
HTML não está visível no viewport ou quando há conflito de estilos CSS.

Tentativas de correção:
1. Adicionar container ao DOM com `position: fixed; left: -9999px` — falhou
2. Usar `position: absolute; left: 0; z-index: -9999` com html2pdf.js — falhou

## Decision

Remover `html2pdf.js` e usar `jsPDF` + `html2canvas` diretamente:

- Container criado com `position: absolute; z-index: -9999` (visível no DOM)
- `html2canvas` renderiza o container em canvas
- `jsPDF` converte o canvas em PDF com suporte a multi-página
- CSS dedicado para PDF (classe `.pdf-doc`) separado dos estilos de preview
- Container removido do DOM no `finally`

## Consequences

### Positivo

- PDF exporta corretamente com todo o conteúdo
- Controle total sobre estilos do PDF (bordas decorativas, tipografia)
- Menos uma dependência no bundle
- Multi-página funciona corretamente

### Negativo

- Texto no PDF é rasterizado (imagem, não selecionável)
- Arquivo PDF maior (~50KB+ vs ~3KB do branco)
- Mais código para manter em `exportPdf.ts`
