// src/components/FAQSection.tsx
'use client';

import { useState } from 'react';
import styles from '../styles/FAQ.module.css';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
}

export default function FAQSection({ faqs, title = '❓ अक्सर पूछे जाने वाले सवाल (FAQs)' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // FAQ Schema for Google Featured Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* FAQ Section */}
      <section className={styles.faqSection}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
            >
              <button
                className={styles.question}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className={styles.questionText}>{faq.question}</span>
                <span className={styles.icon}>{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
