<script lang="ts">
  import Header from './components/Header.svelte'
  import EditorPane from './components/EditorPane.svelte'
  import PreviewPane from './components/PreviewPane.svelte'
  import ToastNotifications from './components/ToastNotifications.svelte'
  import { toasts, removeToast, showSuccess, showError } from './stores/toast'
  import { extractTitle } from './utils/titleExtractor'
  import { exportToPdf } from './utils/exportPdf'
  import { exportToHtml } from './utils/exportHtml'
  import { exportToDocx } from './utils/exportDocx'
  import type { StyleType, ExportFormat, ExportState } from './types'

  let markdown = $state('')
  let selectedStyle = $state<StyleType>('basico')
  let exportState = $state<ExportState>({ isExporting: false, format: null })

  let debouncedMarkdown = $state('')
  let debounceTimer: ReturnType<typeof setTimeout>

  $effect(() => {
    const current = markdown // read reactively in sync scope
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedMarkdown = current
    }, 150)
    return () => clearTimeout(debounceTimer)
  })

  let hasContent = $derived(markdown.trim().length > 0)

  async function handleExport(format: ExportFormat) {
    if (!hasContent) return

    exportState = { isExporting: true, format }

    try {
      const title = extractTitle(markdown)

      switch (format) {
        case 'pdf':
          await exportToPdf(markdown, title, selectedStyle)
          showSuccess(`PDF "${title}.pdf" exportado com sucesso!`)
          break
        case 'html':
          await exportToHtml(markdown, title, selectedStyle)
          showSuccess(`HTML "${title}.html" exportado com sucesso!`)
          break
        case 'docx':
          await exportToDocx(markdown, title)
          showSuccess(`DOCX "${title}.docx" exportado com sucesso!`)
          break
      }
    } catch (error) {
      console.error('Export error:', error)
      showError('Algo deu errado. Tente novamente.')
    } finally {
      exportState = { isExporting: false, format: null }
    }
  }
</script>

<div class="h-full flex flex-col bg-neutral-100">
  <Header
    {selectedStyle}
    onStyleChange={(style) => selectedStyle = style}
    onExport={handleExport}
    {exportState}
    {hasContent}
  />

  <main class="flex-1 flex min-h-0 gap-px bg-border">
    <EditorPane value={markdown} onChange={(v) => markdown = v} />
    <PreviewPane markdown={debouncedMarkdown} styleType={selectedStyle} />
  </main>

  <ToastNotifications toasts={$toasts} onRemove={removeToast} />
</div>
