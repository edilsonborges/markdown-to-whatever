<script lang="ts">
  import Logo from './Logo.svelte'
  import StyleSelector from './StyleSelector.svelte'
  import ExportButtons from './ExportButtons.svelte'
  import type { StyleType, ExportFormat, ExportState } from '../types'

  interface Props {
    selectedStyle: StyleType
    onStyleChange: (style: StyleType) => void
    onExport: (format: ExportFormat) => void
    exportState: ExportState
    hasContent: boolean
  }

  let { selectedStyle, onStyleChange, onExport, exportState, hasContent }: Props = $props()
</script>

<header class="sticky top-0 z-10 bg-white border-b border-border px-4 py-3 flex items-center justify-between gap-4 flex-wrap" data-testid="header">
  <Logo />
  <div class="flex items-center gap-4 flex-wrap">
    <StyleSelector {selectedStyle} {onStyleChange} />
    <ExportButtons {onExport} {exportState} disabled={!hasContent} />
  </div>
</header>
