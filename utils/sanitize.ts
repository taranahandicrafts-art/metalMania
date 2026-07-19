const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'/]/g, (char) => ENTITY_MAP[char] || char);
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/on\w+=\S+/gi, '');
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function truncateHtml(html: string, maxLength: number): string {
  const text = stripHtml(html);
  return text.length <= maxLength ? text : text.slice(0, maxLength).trimEnd() + '...';
}
