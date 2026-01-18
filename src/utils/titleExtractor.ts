/**
 * Extracts the document title from markdown content
 * Priority:
 * 1. First H1 heading (# Title)
 * 2. First non-empty line
 * 3. Fallback: 'documento-sem-titulo'
 */
export function extractTitle(markdown: string): string {
  if (!markdown || !markdown.trim()) {
    return 'documento-sem-titulo';
  }

  const lines = markdown.split('\n');

  // Look for first H1 heading
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('# ')) {
      const title = trimmedLine.slice(2).trim();
      if (title) {
        return slugify(title);
      }
    }
  }

  // Fallback: first non-empty line
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      return slugify(trimmedLine.slice(0, 50)); // Limit length
    }
  }

  return 'documento-sem-titulo';
}

/**
 * Converts a string to a URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .slice(0, 50) // Limit length
    || 'documento-sem-titulo';
}
