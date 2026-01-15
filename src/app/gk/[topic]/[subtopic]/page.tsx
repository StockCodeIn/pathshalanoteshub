// src/app/gk/[topic]/[subtopic]/page.tsx
import type { Metadata } from 'next';
import styles from '@/styles/Home.module.css';
import SubsubListPage from '@/components/SubsubListPage';
import Breadcrumbs from '@/components/Breadcrumbs';
import Attribution from '@/components/Attribution';
import Script from 'next/script';

interface PageProps {
  params: Promise<{
    topic: string;
    subtopic: string;
  }>;
}

/* ================= SEO ================= */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic, subtopic } = await params;

  const topicName = decodeURIComponent(topic).replace(/-/g, ' ');
  const subtopicName = decodeURIComponent(subtopic).replace(/-/g, ' ');

  return {
    title: `${subtopicName} - ${topicName} GK Notes | Pathshala Notes Hub`,
    description: `${topicName} विषय के अंतर्गत "${subtopicName}" के महत्वपूर्ण GK नोट्स।`,
    openGraph: {
      title: `${subtopicName} - ${topicName} GK Notes`,
      description: `${subtopicName} GK Notes for competitive exams`,
      type: 'article',
      locale: 'hi_IN',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/gk/${topic}/${subtopic}`,
    },
  };
}

export const revalidate = 604800;

/* ================= PAGE ================= */
export default async function SubtopicPDFPage({ params }: PageProps) {
  const { topic, subtopic } = await params;

  const topicName = decodeURIComponent(topic).replace(/-/g, ' ');
  const subtopicName = decodeURIComponent(subtopic).replace(/-/g, ' ');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const lastModified = "2025-10-01T00:00:00.000Z";

  /* Breadcrumb schema */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "GK", item: `${baseUrl}/gk` },
      { "@type": "ListItem", position: 3, name: topicName, item: `${baseUrl}/gk/${topic}` },
      { "@type": "ListItem", position: 4, name: subtopicName, item: `${baseUrl}/gk/${topic}/${subtopic}` },
    ],
  };

  return (
    <main>
      {/* 🔥 HERO – LCP OPTIMIZED */}
      <section
        className={styles.hero}
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "300px", // reserve space for LCP
        }}
      >
        <div className={styles.heroContent}>
          <h1>{subtopicName}</h1>
          <p>
            {topicName} विषय के अंतर्गत <strong>{subtopicName}</strong> से संबंधित
            महत्वपूर्ण सामान्य ज्ञान (GK) नोट्स।
          </p>
        </div>
      </section>

      {/* Breadcrumbs (CLS safe) */}
      <section style={{ maxWidth: 900, margin: "1rem auto", padding: "0 1rem", minHeight: 40 }}>
        <Breadcrumbs />
      </section>

      {/* 🔽 HEAVY CLIENT CONTENT – deferred visually */}
      <section
        style={{
          minHeight: "60vh",
          contentVisibility: "auto",
          contain: "layout paint",
        }}
      >
        <SubsubListPage topic={topic} subtopic={subtopic} />
      </section>

      {/* ✅ Breadcrumb JSON-LD (NON-BLOCKING) */}
      <Script
        id="breadcrumb-schema"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* ✅ Article JSON-LD (NON-BLOCKING) */}
      <Script
        id="article-schema"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${subtopicName} - ${topicName} GK Notes`,
            author: { "@type": "Organization", name: "Pathshala Notes Hub" },
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
            mainEntityOfPage: `${baseUrl}/gk/${topic}/${subtopic}`,
          }),
        }}
      />

      <Attribution dateModified={lastModified} />
    </main>
  );
}
