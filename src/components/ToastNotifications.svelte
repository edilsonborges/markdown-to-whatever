<script lang="ts">
  import type { ToastMessage } from '../types'

  interface Props {
    toasts: ToastMessage[]
    onRemove: (id: string) => void
  }

  let { toasts, onRemove }: Props = $props()

  function getToastStyles(type: ToastMessage['type']): string {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  function getIconColor(type: ToastMessage['type']): string {
    switch (type) {
      case 'success': return 'text-green-500'
      case 'error': return 'text-red-500'
      case 'info':
      default: return 'text-blue-500'
    }
  }

  function getIconPath(type: ToastMessage['type']): string {
    switch (type) {
      case 'success':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      case 'error':
        return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      case 'info':
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }
</script>

{#if toasts.length > 0}
  <div
    class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    role="region"
    aria-label="Notificações"
  >
    {#each toasts as toast (toast.id)}
      <div
        class="toast-enter flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm {getToastStyles(toast.type)}"
        role="alert"
      >
        <svg class="w-5 h-5 {getIconColor(toast.type)}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d={getIconPath(toast.type)} stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="text-sm font-medium flex-1">{toast.message}</p>
        <button
          onclick={() => onRemove(toast.id)}
          class="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Fechar notificação"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    {/each}
  </div>
{/if}
