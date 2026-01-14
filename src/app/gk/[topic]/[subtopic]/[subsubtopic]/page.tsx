// src/app/gk/[topic]/[subtopic]/[subsubtopic]/page.tsx

import { notFound } from 'next/navigation';
// import { cache } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import styles from '@/styles/Home.module.css';
import '@/styles/notes.css';
import Attribution from '@/components/Attribution';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';
import AdsenseAd from '@/components/AdsenseAd';


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

/* -------------------- Metadata -------------------- */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic, subtopic, subsubtopic } = await params;

  const decodedTopic = decodeURIComponent(topic).replace(/-/g, ' ');
  const decodedSubtopic = decodeURIComponent(subtopic).replace(/-/g, ' ');
  const decodedTitle = decodeURIComponent(subsubtopic).replace(/-/g, ' ');

  const title = `${decodedTitle} - ${decodedSubtopic} | GK Notes`;
  const description = `${decodedTitle} GK notes under ${decodedSubtopic} - Pathshala Notes Hub`;

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL
      : 'http://localhost:3000';

  const url = `${baseUrl}/gk/${topic}/${subtopic}/${subsubtopic}`;

  return {
    title,
    description,
    keywords: [decodedTitle, decodedSubtopic, decodedTopic, 'GK Notes'],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'hi_IN',
      url,
      images: [
        {
          url: `${baseUrl}/android-chrome-512x512.png`,
          alt: 'Pathshala Notes Hub',
        },
      ],
    },
  };
}

/* -------------------- Static Params with ISR -------------------- */
export async function generateStaticParams() {
  await connectDB();

  const items = await GK.find(
    {},
    { topic: 1, subtopic: 1, name: 1, _id: 0 }
  ).lean();

  return items.map((item) => ({
    topic: item.topic,
    subtopic: item.subtopic,
    subsubtopic: item.name,
  }));
}

export const revalidate = 604800; // 7 days


/* -------------------- Page -------------------- */
export default async function SubsubPage({ params }: PageProps) {
  const { topic, subtopic, subsubtopic } = await params;
  await connectDB();
  const item = await GK.findOne({ topic, subtopic, name: subsubtopic }).lean<GKType>();

  if (!item) {
    notFound();
  }

  const decodedTopic = decodeURIComponent(topic).replace(/-/g, ' ');
  const decodedSubtopic = decodeURIComponent(subtopic).replace(/-/g, ' ');
  const displayTitle =
    item.displayName || decodeURIComponent(subsubtopic).replace(/-/g, ' ');

  const baseUrl =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_BASE_URL
      : 'http://localhost:3000';

  const pageUrl = `${baseUrl}/gk/${topic}/${subtopic}/${subsubtopic}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'GK', item: `${baseUrl}/gk` },
      {
        '@type': 'ListItem',
        position: 3,
        name: decodedTopic,
        item: `${baseUrl}/gk/${topic}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: decodedSubtopic,
        item: `${baseUrl}/gk/${topic}/${subtopic}`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: displayTitle,
        item: pageUrl,
      },
    ],
  };

  return (
    <main>
      {/* Hero */}
      <section className={styles.hero}style={{ contain: 'layout paint' }}>
        <div className={styles.heroContent}>
          <h1>{displayTitle}</h1>
          <p>{decodedSubtopic} - सामान्य ज्ञान (General Knowledge)</p>
        </div>
      </section>

      {/* Breadcrumbs */}
      <section
        style={{
          maxWidth: 900,
          margin: '0.5rem auto',
          padding: '0 1rem',
          minHeight: 40, // ✅ CLS fix
        }}
      >
        <Breadcrumbs />
      </section>


      {/* Mid Ad */}
      <section className="ad-wrapper display">
        <div className="ad-slot">
        <AdsenseAd slot="3645773527" />
        </div>
      </section>

      {/* Content */}
      <section style={{
        maxWidth: 900,
        margin: '0.5rem auto',
        padding: '0 1rem',
        minHeight: '60vh',   // ✅ CLS killer
        contain: 'layout style paint',
      }}>
        <article
          className="notes-content"
          dangerouslySetInnerHTML={{ __html: item.htmlContent || '' }}
        />
      </section>

      {/* Bottom Ad */}
      <section className="ad-wrapper multiplex">
        <div className="ad-slot">
        <AdsenseAd slot="2627371172" />
        </div>
      </section>

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
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
            datePublished: item.createdAt
              ? item.createdAt.toISOString()
              : "2025-10-01",

            dateModified: item.updatedAt
              ? item.updatedAt.toISOString()
              : "2025-10-01",

            mainEntityOfPage: pageUrl,
          }),
        }}
      />

      <Attribution dateModified={item.updatedAt?.toISOString()} />
    </main>
  );
}
