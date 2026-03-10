<script lang="ts">
  import { marked } from 'marked'
  import { getStyleCSS } from '../styles/previewStyles'
  import type { StyleType } from '../types'

  interface Props {
    markdown: string
    styleType: StyleType
  }

  let { markdown, styleType }: Props = $props()

  marked.setOptions({
    gfm: true,
    breaks: true,
  })

  let html = $derived(markdown.trim() ? marked(markdown) as string : '')
  let styleCSS = $derived(getStyleCSS(styleType))
  let isEmpty = $derived(!markdown.trim())

  let styleEl: HTMLStyleElement

  $effect(() => {
    if (styleEl) {
      styleEl.textContent = styleCSS
    }
  })
</script>

<div class="flex-1 flex flex-col min-h-0 overflow-hidden" data-testid="preview-pane">
  <div class="px-4 py-2 bg-white border-b border-border">
    <span class="text-sm font-medium text-gray-500 uppercase tracking-wide text-xs">Preview</span>
  </div>
  <div class="flex-1 overflow-auto p-6 bg-white" data-testid="preview-content-area">
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <style bind:this={styleEl}></style>
    {#if isEmpty}
      <div class="h-full flex items-center justify-center">
        <p class="text-gray-400 text-sm">O preview aparecerá aqui</p>
      </div>
    {:else}
      <div
        class="preview-content max-w-none"
        data-testid="preview-rendered"
        aria-live="polite"
        role="region"
        aria-label="Preview do documento"
      >
        {@html html}
      </div>
    {/if}
  </div>
</div>
