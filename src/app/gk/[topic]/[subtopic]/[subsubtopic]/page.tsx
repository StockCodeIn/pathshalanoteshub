import Breadcrumbs from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import styles from '@/styles/Home.module.css';
import '@/styles/notes.css';
import Attribution from '@/components/Attribution';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';

// 🔥 always fresh data (no caching)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface PageProps {
  params: Promise<{ topic: string; subtopic: string; subsubtopic: string }>;
}

// ✅ Type for lean() result
interface GKType {
  topic: string;
  subtopic: string;
  name: string;
  displayName?: string;
  htmlContent?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic, subtopic, subsubtopic } = await params;
  const titleText = `${decodeURIComponent(subsubtopic).replace(/-/g, ' ')} - ${decodeURIComponent(
    subtopic
  ).replace(/-/g, ' ')} | GK Notes`;
  const description = `${titleText} - Pathshala Notes Hub`;

  return {
    title: titleText,
    description,
    keywords: [
      decodeURIComponent(subsubtopic).replace(/-/g, ' '),
      decodeURIComponent(subtopic).replace(/-/g, ' '),
      'GK Notes',
      'Pathshala Notes Hub',
    ],
    openGraph: {
      title: titleText,
      description,
      type: 'article',
      locale: 'hi_IN',
      url:
        process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/gk/${topic}/${subtopic}/${subsubtopic}`
          : `http://localhost:3000/gk/${topic}/${subtopic}/${subsubtopic}`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/android-chrome-512x512.png`,
          alt: 'Pathshala Notes Hub',
        },
      ],
    },
    alternates: {
      canonical:
        process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/gk/${topic}/${subtopic}/${subsubtopic}`
          : `http://localhost:3000/gk/${topic}/${subtopic}/${subsubtopic}`,
    },
  };
}

export default async function SubsubPage({ params }: PageProps) {
  const { topic, subtopic, subsubtopic } = await params;
  await connectDB();

  try {
    // ✅ Typed lean() query
    const item = await GK.findOne({ topic, subtopic, name: subsubtopic }).lean<GKType>();

    if (!item) throw new Error('No content');

    const displayTitle = item.displayName || decodeURIComponent(subsubtopic).replace(/-/g, ' ');
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BASE_URL
        : 'http://localhost:3000';

    // ✅ Breadcrumb structured data
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
        { '@type': 'ListItem', position: 2, name: 'GK', item: `${baseUrl}/gk` },
        {
          '@type': 'ListItem',
          position: 3,
          name: decodeURIComponent(topic).replace(/-/g, ' '),
          item: `${baseUrl}/gk/${topic}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: decodeURIComponent(subtopic).replace(/-/g, ' '),
          item: `${baseUrl}/gk/${topic}/${subtopic}`,
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: displayTitle,
          item: `${baseUrl}/gk/${topic}/${subtopic}/${subsubtopic}`,
        },
      ],
    };

    return (
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>{displayTitle}</h1>
            <p>
              {decodeURIComponent(subtopic).replace(/-/g, ' ')} - सामान्य ज्ञान (General Knowledge)
            </p>
          </div>
        </section>

        {/* Breadcrumbs */}
        <section style={{ maxWidth: 900, margin: '1rem auto', padding: '0 1rem' }}>
          <Breadcrumbs />
        </section>

        {/* Main Content */}
        <section>
          <article
            className="notes-content"
            dangerouslySetInnerHTML={{
              __html: item.htmlContent || '<p>No content</p>',
            }}
          />
        </section>

        {/* SEO Structured Data */}
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
              datePublished: item.createdAt || new Date().toISOString(),
              dateModified: item.updatedAt || new Date().toISOString(),
              mainEntityOfPage: `${baseUrl}/gk/${topic}/${subtopic}/${subsubtopic}`,
            }),
          }}
        />

        <Attribution dateModified={item.updatedAt || new Date().toISOString()} />
      </main>
    );
  } catch (error) {
    console.error('GK Page Error:', error);
    return (
      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>विषय नहीं मिला</h1>
            <p>Requested content not found.</p>
          </div>
        </section>
      </main>
    );
  }
}


