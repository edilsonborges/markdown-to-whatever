# Markdown to Whatever

Uma ferramenta web minimalista para conversão instantânea de Markdown para múltiplos formatos (PDF, HTML, DOCX).

## Características

- **Conversão em tempo real**: Preview atualiza automaticamente enquanto você digita
- **Múltiplos formatos de exportação**: PDF, HTML, DOCX
- **Estilos pré-definidos**:
  - Básico: Tipografia limpa e minimalista
  - Acadêmico: Fonte serifada, ideal para artigos
  - Técnico: Otimizado para documentação de código
  - Compacto: Maior densidade de conteúdo
- **Detecção automática de título**: O nome do arquivo é extraído do primeiro H1
- **Interface responsiva**: Funciona em desktop e tablets

## Tecnologias

- React 19 + TypeScript
- Vite
- Tailwind CSS
- marked (parsing Markdown)
- html2pdf.js (exportação PDF)
- docx (exportação DOCX)

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Uso

1. Cole ou digite seu Markdown no editor à esquerda
2. O preview aparece automaticamente à direita
3. Selecione o estilo desejado no seletor
4. Clique em "Baixar PDF", "Baixar HTML" ou "Baixar DOCX" para exportar

## Licença

MIT
