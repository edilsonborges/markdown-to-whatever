<script lang="ts">
  import { stripEmoji } from '../utils/stripEmoji'

  interface Props {
    value: string
    onChange: (value: string) => void
  }

  let { value, onChange }: Props = $props()

  const placeholder = `Cole ou digite seu Markdown aqui...

# Exemplo de título

Seu texto aparecerá no preview ao lado →`
</script>

<div class="flex-1 flex flex-col min-h-0" data-testid="editor-pane">
  <div class="px-4 py-2 bg-white border-b border-border">
    <span class="text-sm font-medium text-gray-500 uppercase tracking-wide text-xs">Editor</span>
  </div>
  <textarea
    class="editor-textarea flex-1 w-full p-4 bg-white text-text text-sm leading-relaxed"
    {value}
    oninput={(e) => {
      const textarea = e.target as HTMLTextAreaElement
      const cleaned = stripEmoji(textarea.value)
      if (cleaned !== textarea.value) {
        const pos = textarea.selectionStart - (textarea.value.length - cleaned.length)
        textarea.value = cleaned
        textarea.selectionStart = textarea.selectionEnd = pos
      }
      onChange(cleaned)
    }}
    {placeholder}
    spellcheck="false"
    data-testid="editor-textarea"
    aria-label="Editor de Markdown"
  ></textarea>
</div>
