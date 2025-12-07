'use client';

import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import gkData from '@/data/gkData';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function GKPageClient() {
  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL
      : 'http://localhost:3000';

  // ✅ Breadcrumb Schema (SEO)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "GK", item: `${baseUrl}/gk` },
    ],
  };

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>सामान्य ज्ञान (General Knowledge - GK)</h1>
          <p>
            प्रतियोगी परीक्षाओं जैसे <strong>UPSC, SSC, RPSC, Railway, Bank</strong> आदि के लिए महत्वपूर्ण 
            GK टॉपिक्स यहाँ उपलब्ध हैं — Current Affairs, History, Geography, Polity, Science & Technology और अन्य विषय।
          </p>
        </div>
      </section>

      {/* ✅ Breadcrumbs */}
      <section style={{ maxWidth: 900, margin: '1rem auto', padding: '0 1rem' }}>
        <Breadcrumbs />
      </section>

      {/* Topics List */}
      <section>
        <h2 className={styles.sectionTitle}>GK Topics List</h2>
        <div className={styles.cardContainer2}>
          {gkData.map((topic) => (
            <Link
              href={`/gk/${topic.slug}`}
              key={topic.slug}
              className={styles.card2}
            >
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{topic.title}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Explore {topic.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Study Section */}
      <section className={styles.trust}>
        <h2>क्यों पढ़ें हमारे GK Notes?</h2>
        <ul>
          <li>✔ UPSC, SSC, RPSC, Railway, Bank के अनुसार तैयार किए गए notes</li>
          <li>✔ Static GK + Current Affairs दोनों शामिल</li>
          <li>✔ आसान भाषा और मुफ्त पहुँच</li>
        </ul>
      </section>

      {/* ✅ SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
