import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html || '', {
    USE_PROFILES: { html: true },
  });
}

export function stripHtml(html: string) {
  return sanitizeHtml(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function calculateReadingTime(html: string) {
  const text = stripHtml(html);
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}
