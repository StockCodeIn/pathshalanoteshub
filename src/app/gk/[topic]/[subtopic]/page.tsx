import type { Metadata } from 'next';
import styles from '@/styles/Home.module.css';
import SubsubListPage from '@/components/SubsubListPage';
import Breadcrumbs from '@/components/Breadcrumbs';
import Attribution from '@/components/Attribution';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';

// 🔥 always fresh data (no caching)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface PageProps {
  params: Promise<{
    topic: string;
    subtopic: string;
  }>;
}

// ✅ Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic, subtopic } = await params;

  const topicName = decodeURIComponent(topic).replace(/-/g, ' ');
  const subtopicName = decodeURIComponent(subtopic).replace(/-/g, ' ');


  const title = `${subtopicName} - ${topicName} GK Notes | Pathshala Notes Hub`;
  const description = `${topicName} विषय के अंतर्गत "${subtopicName}" के महत्वपूर्ण सामान्य ज्ञान (GK) नोट्स और अध्ययन सामग्री PDF। प्रतियोगी परीक्षाओं जैसे UPSC, SSC, RPSC, Railway, Bank के लिए उपयोगी सामग्री।`;

  return {
    title,
    description,
    keywords: [
      subtopicName,
      topicName,
      'GK Notes',
      'सामान्य ज्ञान',
      'Pathshala Notes Hub',
      'UPSC GK Notes',
      'SSC GK Notes',
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'hi_IN',
    },
    alternates: {
      canonical:
        process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/gk/${topic}/${subtopic}`
          : `http://localhost:3000/gk/${topic}/${subtopic}`,
    },
  };
}

// ✅ Page Component
export default async function SubtopicPDFPage({ params }: PageProps) {
  const { topic, subtopic } = await params;

  const topicName = decodeURIComponent(topic).replace(/-/g, ' ');
  const subtopicName = decodeURIComponent(subtopic).replace(/-/g, ' ');

  const pageTitle = `${subtopicName} - ${topicName} GK Notes | Pathshala Notes Hub`;


  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL
      : 'http://localhost:3000';

  // ✅ Structured data for breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'GK', item: `${baseUrl}/gk` },
      {
        '@type': 'ListItem',
        position: 3,
        name: topicName,
        item: `${baseUrl}/gk/${topic}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: subtopicName,
        item: `${baseUrl}/gk/${topic}/${subtopic}`,
      },
    ],
  };

  // compute lastModified from latest updated item in this subtopic
  let lastModified = new Date().toISOString();
  try {
    await connectDB();
    const latest = await GK.findOne({ topic, subtopic }).sort({ updatedAt: -1 });
    if (latest && latest.updatedAt) lastModified = new Date(latest.updatedAt).toISOString();
  } catch (e) {
    // ignore
  }

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>{subtopicName}</h1>
          <p>
            {topicName} विषय के अंतर्गत <strong>{subtopicName}</strong> से संबंधित महत्वपूर्ण
            सामान्य ज्ञान (GK) नोट्स की सूची।
          </p>
        </div>
      </section>

      {/* Breadcrumbs Navigation */}
      <section style={{ maxWidth: 900, margin: '1rem auto', padding: '0 1rem' }}>
        <Breadcrumbs/>
      </section>

      {/* GK Sub-Subtopics List */}
      <section>
        <SubsubListPage topic={topic} subtopic={subtopic} />
      </section>

      {/* ✅ Breadcrumb structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Article JSON-LD for ownership & SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: pageTitle,
            author: { '@type': 'Organization', name: 'Pathshala Notes Hub' },
            publisher: {
              '@type': 'Organization',
              name: 'Pathshala Notes Hub',
              logo: { '@type': 'ImageObject', url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/android-chrome-512x512.png` },
            },
            datePublished: new Date().toISOString(),
            dateModified: lastModified,
            mainEntityOfPage: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/gk/${topic}/${subtopic}`,
          }),
        }}
      />

      <Attribution dateModified={lastModified} />
    </main>
  );
}
