import type { Metadata } from 'next';
import SubtopicListPage from '@/components/SubtopicListPage';
import styles from '@/styles/Home.module.css';
import Breadcrumbs from '@/components/Breadcrumbs';
import Attribution from '@/components/Attribution';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';

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
    // canonical absolute url
    alternates: {
      canonical:
        process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/gk/${topic}`
          : `http://localhost:3000/gk/${topic}`,
    },
  };
}

// ✅ Page Component
export default async function GKTopicPage({ params }: PageProps) {
  const { topic } = await params;
  const topicName = decodeURIComponent(topic).replace(/-/g, ' ');

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL
      : 'http://localhost:3000';

  // ✅ Breadcrumb Schema for SEO
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'GK', item: `${baseUrl}/gk` },
      { '@type': 'ListItem', position: 3, name: topicName, item: `${baseUrl}/gk/${topic}` },
    ],
  };
  // determine lastModified from DB (latest updatedAt for this topic)
  let lastModified = new Date().toISOString();
  try {
    await connectDB();
    const latest = await GK.findOne({ topic }).sort({ updatedAt: -1 });
    if (latest && latest.updatedAt) lastModified = new Date(latest.updatedAt).toISOString();
  } catch (e) {
    // ignore DB errors for SEO metadata; fall back to now
  }

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>{topicName} - सामान्य ज्ञान (GK)</h1>
          <p>
            इस सेक्शन में आपको <strong>{topicName}</strong> विषय से संबंधित सभी
            सबटॉपिक्स और उनके महत्वपूर्ण सामान्य ज्ञान नोट्स मिलेंगे।
            यह सामग्री UPSC, SSC, RPSC, Railway, Bank आदि प्रतियोगी परीक्षाओं के लिए अत्यंत उपयोगी है।
          </p>
        </div>
      </section>

      {/* Breadcrumbs Navigation */}
      <section style={{ maxWidth: 900, margin: '1rem auto', padding: '0 1rem' }}>
        <Breadcrumbs/>
      </section>

      {/* GK Subtopics List */}
      <section>
        <SubtopicListPage topicSlug={topic} />
      </section>

      {/* ✅ SEO Structured Data */}
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
            headline: `${topicName} GK Notes | Pathshala Notes Hub`,
            author: { '@type': 'Organization', name: 'Pathshala Notes Hub' },
            publisher: {
              '@type': 'Organization',
              name: 'Pathshala Notes Hub',
              logo: { '@type': 'ImageObject', url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/android-chrome-512x512.png` },
            },
            datePublished: new Date().toISOString(),
            dateModified: lastModified,
            mainEntityOfPage: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/gk/${topic}`,
          }),
        }}
      />

      <Attribution dateModified={lastModified} />
    </main>
  );
}
