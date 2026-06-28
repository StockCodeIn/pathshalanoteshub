import { INTERNAL_LINKS } from './internalLinks';

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function injectInternalLinks(html: string): string {
  if (!html) return '';

  let output = html;

  // Existing anchor tags temporarily protect
  const protectedAnchors: string[] = [];

  output = output.replace(/<a\b[\s\S]*?<\/a>/gi, (match) => {
    protectedAnchors.push(match);
    return `__ANCHOR_${protectedAnchors.length - 1}__`;
  });

  // Existing headings temporarily protect
  const protectedHeadings: string[] = [];

  output = output.replace(/<h[1-6][\s\S]*?<\/h[1-6]>/gi, (match) => {
    protectedHeadings.push(match);
    return `__HEADING_${protectedHeadings.length - 1}__`;
  });

  const linked = new Set<string>();

  const links = [...INTERNAL_LINKS].sort(
    (a, b) =>
      (b.priority ?? 0) - (a.priority ?? 0) ||
      b.keyword.length - a.keyword.length
  );

  for (const item of links) {
    if (linked.has(item.url)) continue;

    const regex = new RegExp(
      `\\b(${escapeRegex(item.keyword)})\\b`,
      'i'
    );

    if (regex.test(output)) {
      output = output.replace(
        regex,
        `<a href="${item.url}">$1</a>`
      );

      linked.add(item.url);
    }
  }

  // Restore headings
  output = output.replace(/__HEADING_(\d+)__/g, (_, i) => {
    return protectedHeadings[Number(i)];
  });

  // Restore anchors
  output = output.replace(/__ANCHOR_(\d+)__/g, (_, i) => {
    return protectedAnchors[Number(i)];
  });

  return output;
}