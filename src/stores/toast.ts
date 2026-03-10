import { writable } from 'svelte/store'
import type { ToastMessage } from '../types'

export const toasts = writable<ToastMessage[]>([])

export function removeToast(id: string) {
  toasts.update(t => t.filter(toast => toast.id !== id))
}

function addToast(message: string, type: ToastMessage['type'] = 'info') {
  const id = Date.now().toString()
  const toast: ToastMessage = { id, message, type }

  toasts.update(t => [...t, toast])

  setTimeout(() => {
    removeToast(id)
  }, 4000)

  return id
}

export function showSuccess(message: string) {
  return addToast(message, 'success')
}

export function showError(message: string) {
  return addToast(message, 'error')
}

export function showInfo(message: string) {
  return addToast(message, 'info')
}
