<script lang="ts">
  import { getStyleOptions } from '../styles/previewStyles'
  import type { StyleType } from '../types'

  interface Props {
    selectedStyle: StyleType
    onStyleChange: (style: StyleType) => void
  }

  let { selectedStyle, onStyleChange }: Props = $props()

  const styles = getStyleOptions()
</script>

<div class="flex items-center gap-2">
  <label for="style-selector" class="text-sm font-medium text-text hidden sm:inline">
    Estilo:
  </label>
  <select
    id="style-selector"
    value={selectedStyle}
    onchange={(e) => onStyleChange((e.target as HTMLSelectElement).value as StyleType)}
    class="px-3 py-1.5 text-sm border border-border rounded-md bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent cursor-pointer hover:bg-neutral-50 transition-colors"
    data-testid="style-selector"
    aria-label="Selecionar estilo do documento"
  >
    {#each styles as style}
      <option value={style.id}>{style.name}</option>
    {/each}
  </select>
</div>
