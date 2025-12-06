// /lib/injectAdsIntoHtml.ts
export function injectAdAfterNthTag(html: string, adHtml: string, tag = "p", n = 1) {
  if (!html || !adHtml) return html;
  const closing = `</${tag}>`;
  const regex = new RegExp(`(${closing})`, "ig");
  const parts = html.split(regex); // keeps the closing tags in array
  let count = 0;
  let out = "";

  for (let i = 0; i < parts.length; i++) {
    out += parts[i];
    if (parts[i].toLowerCase() === closing.toLowerCase()) {
      count++;
      if (count === n) {
        out += adHtml;
        // only insert once for this function
      }
    }
  }

  // fallback: if no matching tag or not enough occurrences, append ad at end
  if (count < n) {
    out = html + adHtml;
  }

  return out;
}

/**
 * Inject ad after every Nth occurrence of a closing tag.
 * Example: inject after every 8th </li> for MCQs.
 */
export function injectAdEveryNTag(html: string, adHtml: string, tag = "li", everyN = 8) {
  if (!html || !adHtml) return html;
  const closing = `</${tag}>`;
  const regex = new RegExp(`(${closing})`, "ig");
  const parts = html.split(regex);
  let count = 0;
  let out = "";

  for (let i = 0; i < parts.length; i++) {
    out += parts[i];
    if (parts[i].toLowerCase() === closing.toLowerCase()) {
      count++;
      if (count % everyN === 0) {
        out += adHtml;
      }
    }
  }

  // if no tags found, append at end as fallback
  if (count === 0) out = html + adHtml;

  return out;
}
