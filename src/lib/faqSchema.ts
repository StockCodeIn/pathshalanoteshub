export type FAQItem = {
  question: string;
  answer: string;
};

export function buildFaqJsonLd(faq: FAQItem[]) {
  if (!faq.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',

    mainEntity: faq.map((item) => ({
      '@type': 'Question',

      name: item.question,

      acceptedAnswer: {
        '@type': 'Answer',

        text: item.answer,
      },
    })),
  };
}