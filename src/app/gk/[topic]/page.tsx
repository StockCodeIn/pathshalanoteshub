// src/app/gk/[topic]/page.tsx
import type { Metadata } from 'next';
import SubtopicListPage from '@/components/SubtopicListPage';
import styles from '@/styles/Home.module.css';
import Breadcrumbs from '@/components/Breadcrumbs';
import Attribution from '@/components/Attribution';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';
import Script from 'next/script';

interface PageProps {
  params: Promise<{ topic: string }>;
}

// ✅ Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic } = await params;
  const topicName = decodeURIComponent(topic).replace(/-/g, ' ');

  const title = `${topicName} GK Notes | Pathshala Notes Hub`;
  const description = `सामान्य ज्ञान (GK) के लिए "${topicName}" से संबंधित महत्वपूर्ण टॉपिक्स, प्रश्न और नोट्स। UPSC, SSC, RPSC, Bank, Railway परीक्षा तैयारी के लिए उपयोगी सामग्री।`;

  return {
    title,
    description,
    keywords: [
      'GK',
      topicName,
      'सामान्य ज्ञान',
      'Pathshala Notes Hub',
      'UPSC GK',
      'SSC GK',
      'RPSC GK',
      'Bank GK',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'hi_IN',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/gk/${topic}`,
    },
  };
}
export const revalidate = 86400; // 24 hours

// ✅ Page Component
export default async function GKTopicPage({ params }: PageProps) {
  const { topic } = await params;
  const topicName = decodeURIComponent(topic).replace(/-/g, ' ');

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // ✅ Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'GK', item: `${baseUrl}/gk` },
      { '@type': 'ListItem', position: 3, name: topicName, item: `${baseUrl}/gk/${topic}` },
    ],
  };

  // ✅ lastModified from DB
  const lastModified = "2025-01-01T00:00:00.000Z";


  return (
    <main>
      {/* Hero */}
      <section
        className={styles.hero}
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "500px",
        }}
      >

        <div className={styles.heroContent}>
          <h1>{topicName} - सामान्य ज्ञान (GK)</h1>
          <p>
            इस सेक्शन में <strong>{topicName}</strong> से जुड़े सभी सबटॉपिक्स और
            उनके महत्वपूर्ण GK Notes उपलब्ध हैं। यह सामग्री UPSC, SSC, RPSC,
            Railway, Bank जैसी परीक्षाओं के लिए उपयोगी है।
          </p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section style={{ maxWidth: 900, margin: '1rem auto', padding: '0 1rem' }}>
        <Breadcrumbs />
      </section>

      {/* Subtopics */}
      <section
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "800px",
        }}
      >
        <SubtopicListPage topicSlug={topic} />
      </section>


      {/* Breadcrumb JSON-LD */}
      <Script
        id="breadcrumb-schema"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Article Schema */}
      <Script
        id="article-schema"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${topicName} GK Notes | Pathshala Notes Hub`,
            author: {
              "@type": "Organization",
              name: "Pathshala Notes Hub",
            },
            publisher: {
              "@type": "Organization",
              name: "Pathshala Notes Hub",
              logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/android-chrome-512x512.png`,
              },
            },
            datePublished: lastModified,
            dateModified: lastModified,
            mainEntityOfPage: `${baseUrl}/gk/${topic}`,
          }),
        }}
      />
      <Attribution dateModified={lastModified} />
    </main>
  );
}
