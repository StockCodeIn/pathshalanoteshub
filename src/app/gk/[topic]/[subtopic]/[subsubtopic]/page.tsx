import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import styles from '@/styles/Home.module.css';
import '@/styles/notes.css';
import Attribution from '@/components/Attribution';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';
import AdsenseAd from '@/components/AdsenseAd';
import Script from 'next/script';

interface PageProps {
  params: Promise<{
    topic: string;
    subtopic: string;
    subsubtopic: string;
  }>;
}

interface GKType {
  topic: string;
  subtopic: string;
  name: string;
  displayName?: string;
  htmlContent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/* ================= METADATA ================= */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic, subtopic, subsubtopic } = await params;

  const decodedTopic = decodeURIComponent(topic).replace(/-/g, ' ');
  const decodedSubtopic = decodeURIComponent(subtopic).replace(/-/g, ' ');
  const decodedTitle = decodeURIComponent(subsubtopic).replace(/-/g, ' ');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const url = `${baseUrl}/gk/${topic}/${subtopic}/${subsubtopic}`;

  return {
    title: `${decodedTitle} - ${decodedSubtopic} | GK Notes`,
    description: `${decodedTitle} GK notes under ${decodedSubtopic}`,
    alternates: { canonical: url },
    openGraph: {
      title: `${decodedTitle} - ${decodedSubtopic}`,
      description: `${decodedTitle} GK notes`,
      type: 'article',
      locale: 'hi_IN',
      url,
      images: [{ url: `${baseUrl}/android-chrome-512x512.png` }],
    },
  };
}

/* ================= ISR ================= */
export const revalidate = 604800;

/* ================= PAGE ================= */
export default async function SubsubPage({ params }: PageProps) {
  const { topic, subtopic, subsubtopic } = await params;

  await connectDB();
  const item = await GK.findOne({ topic, subtopic, name: subsubtopic })
    .lean<GKType>()
    .maxTimeMS(5000);

  if (!item) notFound();

  const decodedTopic = decodeURIComponent(topic).replace(/-/g, ' ');
  const decodedSubtopic = decodeURIComponent(subtopic).replace(/-/g, ' ');
  const displayTitle =
    item.displayName || decodeURIComponent(subsubtopic).replace(/-/g, ' ');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const pageUrl = `${baseUrl}/gk/${topic}/${subtopic}/${subsubtopic}`;

  /* Breadcrumb schema */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'GK', item: `${baseUrl}/gk` },
      { '@type': 'ListItem', position: 3, name: decodedTopic, item: `${baseUrl}/gk/${topic}` },
      { '@type': 'ListItem', position: 4, name: decodedSubtopic, item: `${baseUrl}/gk/${topic}/${subtopic}` },
      { '@type': 'ListItem', position: 5, name: displayTitle, item: pageUrl },
    ],
  };

  const lastModified =
    item.updatedAt?.toISOString() || '2025-10-01T00:00:00.000Z';

  return (
    <main>
      {/* 🔥 HERO – LCP OPTIMIZED */}
      <section
        className={styles.hero}
        style={{
          contentVisibility: 'auto',
          containIntrinsicSize: '260px',
        }}
      >
        <div className={styles.heroContent}>
          <h1>{displayTitle}</h1>
          <p>{decodedSubtopic} - सामान्य ज्ञान (GK)</p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section style={{ maxWidth: 900, margin: '0.5rem auto', padding: '0 1rem', minHeight: 40 }}>
        <Breadcrumbs />
      </section>

      {/* Top display ad - High visibility after hero */}
      {/* Ad Type: DISPLAY (responsive leaderboard) - Standard banner ad */}
      {/* Purpose: Primary monetization spot after hero section */}
      {/* CLS Safe: Yes (min-height 90px desktop, 50px mobile pre-allocated) */}
      <section className="ad-wrapper display" style={{ maxWidth: 900, margin: '1rem auto' }}>
        <div className="ad-slot">
          <AdsenseAd slot="7492288576" variant="display" />
        </div>
      </section>

      {/* Mid in-article ad - Before content starts */}
      {/* Ad Type: IN-ARTICLE (fluid) - Blends naturally with article content */}
      {/* Purpose: Non-disruptive monetization before content reading */}
      {/* CLS Safe: Yes (min-height 200px desktop, 150px mobile pre-allocated) */}
      <section className="ad-wrapper in-article" style={{ maxWidth: 900, margin: '1rem auto' }}>
        <div className="ad-slot">
          <AdsenseAd slot="3645773527" variant="in-article" />
        </div>
      </section>

      {/* 📄 CONTENT – deferred visually */}
      <section
        style={{
          maxWidth: 900,
          margin: '0.5rem auto',
          padding: '0 1rem',
          minHeight: '60vh',
          contentVisibility: 'auto',
          contain: 'layout paint',
        }}
      >
        <article
          className="notes-content"
          dangerouslySetInnerHTML={{ __html: item.htmlContent || '' }}
        />
      </section>

      {/* Bottom multiplex ad - After content */}
      {/* Ad Type: MULTIPLEX (autorelaxed) - Grid of recommended content links */}
      {/* Purpose: Increase engagement after reading, provide related content */}
      {/* CLS Safe: Yes (min-height 400px desktop, 350px mobile pre-allocated) */}
      <section className="ad-wrapper multiplex" style={{ maxWidth: 900, margin: '2rem auto' }}>
        <div className="ad-slot">
          <AdsenseAd slot="9880107752" variant="multiplex" />
        </div>
      </section>

      {/* ✅ SEO – NON BLOCKING */}
      <Script
        id="breadcrumb-schema"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Script
        id="article-schema"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: displayTitle,
            author: { '@type': 'Organization', name: 'Pathshala Notes Hub' },
            publisher: {
              '@type': 'Organization',
              name: 'Pathshala Notes Hub',
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/android-chrome-512x512.png`,
              },
            },
            datePublished: lastModified,
            dateModified: lastModified,
            mainEntityOfPage: pageUrl,
          }),
        }}
      />

      <Attribution dateModified={lastModified} />
    </main>
  );
}
