<script lang="ts">
  import type { ExportFormat, ExportState } from '../types'

  interface Props {
    onExport: (format: ExportFormat) => void
    exportState: ExportState
    disabled: boolean
  }

  let { onExport, exportState, disabled }: Props = $props()

  const buttons: { format: ExportFormat; label: string }[] = [
    { format: 'pdf', label: 'Baixar PDF' },
    { format: 'html', label: 'Baixar HTML' },
    { format: 'docx', label: 'Baixar DOCX' },
  ]
</script>

<div class="flex items-center gap-2">
  {#each buttons as { format, label }}
    {@const isExporting = exportState.isExporting && exportState.format === format}
    {@const isDisabled = disabled || exportState.isExporting}
    <button
      onclick={() => onExport(format)}
      disabled={isDisabled}
      class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 {isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-accent text-white hover:bg-blue-700 active:bg-blue-800'}"
      aria-label={label}
      aria-busy={isExporting}
    >
      {#if isExporting}
        <svg
          class="spinner w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      {:else}
        <svg
          class="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      {/if}
      <span class="hidden sm:inline">{label}</span>
      <span class="sm:hidden">{format.toUpperCase()}</span>
    </button>
  {/each}
</div>
