# Arquitetura — Markdown to Whatever

## System Design

Aplicação SPA (Single Page Application) 100% client-side. Todo processamento
de Markdown e geração de documentos ocorre no browser do usuário.

## Component Diagram

```
┌─────────────────────────────────────────────────┐
│                    App.tsx                        │
│  State: markdown, selectedStyle, exportState     │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │              Header.tsx                      │ │
│  │  ┌──────────────┐  ┌────────────────────┐   │ │
│  │  │ StyleSelector│  │  ExportButtons     │   │ │
│  │  │ (4 temas)    │  │  (PDF/HTML/DOCX)   │   │ │
│  │  └──────────────┘  └────────────────────┘   │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌──────────────────┐  ┌──────────────────────┐ │
│  │  EditorPane.tsx   │  │  PreviewPane.tsx     │ │
│  │                   │  │                      │ │
│  │  <textarea>       │  │  marked() → HTML     │ │
│  │  Markdown input   │  │  + styleCSS theme    │ │
│  │                   │  │                      │ │
│  └──────────────────┘  └──────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │          ToastNotifications.tsx              │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Data Flow

1. Usuário digita Markdown no `EditorPane`
2. `useDebounce(150ms)` atrasa atualização do preview
3. `PreviewPane` converte Markdown → HTML via `marked()`
4. Estilo CSS do tema selecionado é injetado via `<style>`
5. Ao exportar:
   - **PDF**: `exportPdf.ts` cria container temporário no DOM → html2canvas → jsPDF
   - **HTML**: `exportHtml.ts` monta documento HTML completo → file-saver
   - **DOCX**: `exportDocx.ts` parseia Markdown → docx lib → file-saver

## Key Decisions

| Decisão | Motivo |
|---------|--------|
| Client-side only | Zero custo de infra, deploy simples |
| jsPDF + html2canvas | html2pdf.js gerava PDFs em branco |
| CSS dedicado para PDF | Preview e PDF têm necessidades visuais diferentes |
| Tailwind inline | Projeto pequeno, sem necessidade de CSS modules |
| Playwright E2E | Testa o fluxo real incluindo export e print |

## Trade-offs

- **html2canvas** rasteriza em imagem (perde seleção de texto no PDF) mas é confiável
- **Sem syntax highlighting** simplifica mas limita uso técnico
- **4 temas hardcoded** suficiente agora, mas não extensível por usuário
- **Debounce 150ms** bom equilíbrio entre responsividade e performance
