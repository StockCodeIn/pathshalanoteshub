export function addHeadingIds(html: string): string {
  if (!html) return '';

  const usedIds = new Set<string>();

  return html.replace(
    /<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level, attributes, content) => {
      // Existing id ho to same heading rehne do
      if (/\sid\s*=\s*["'][^"']+["']/i.test(attributes)) {
        return match;
      }

      // HTML tags remove
const rawText = content.replace(/<[^>]+>/g, '').trim();

if (!rawText) return match;

// TOC aur slug ke liye numbering hata do
const cleanText = rawText
  .replace(/^\d+\.\s*/, '') // 1. 2. 10.
  .replace(/\s+/g, ' ')
  .trim();

// Slug generate
let slug = cleanText
  .toLowerCase()
  .replace(/[.,!?():[\]{}"'`]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

if (!slug) slug = 'section';

      const originalSlug = slug;
      let counter = 2;

      while (usedIds.has(slug)) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }

      usedIds.add(slug);

      return `<h${level}${attributes} id="${slug}">${content}</h${level}>`;
    }
  );
}