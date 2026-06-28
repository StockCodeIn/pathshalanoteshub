export type TocHeading = {
  id: string;
  text: string;
  level: number;
};

export function extractHeadings(html: string): TocHeading[] {
  if (!html) return [];

  const headings: TocHeading[] = [];

  const regex =
    /<h([1-6])([^>]*)id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    const level = Number(match[1]);

    // H1 ko TOC me include nahi karna
    if (level === 1) continue;

    const id = match[3];

    // HTML remove
    let text = match[4]
      .replace(/<[^>]+>/g, '')
      .trim();

    // Heading ke starting number hata do
    // "1. Introduction" -> "Introduction"
    // "10. Conclusion" -> "Conclusion"
    text = text.replace(/^\d+\.\s*/, '');

    if (!text) continue;

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}