// src/app/gk/[topic]/[subtopic]/[subsubtopic]/page.tsx
import Breadcrumbs from '@/components/Breadcrumbs';
import type { Metadata } from 'next';
import styles from '@/styles/Home.module.css';
import '@/styles/notes.css';
import Attribution from '@/components/Attribution';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';

// NEW imports for ad injection + client init
import { injectAdAfterNthTag, injectAdEveryNTag } from '@/lib/injectAdsIntoHtml';
import InjectedAdsInit from '@/components/InjectedAdsInit';

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

    // Prepare breadcrumb structured data
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

    //
    // ========== AD INJECTION LOGIC (server-side) ==========
    //
    // Replace the SLOT_* placeholders below with real AdSense slot IDs (numeric strings)
    // Example: replace SLOT_GK_TOP with "1234567890"
    //
    const AD_HTML_TOP = `
      <div class="injected-ad" data-slot="9919360225" style="margin:0.75rem 0;">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}"
             data-ad-slot="9919360225"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    `;

    const AD_HTML_MCQ = `
      <div class="injected-ad" data-slot="3645773527" style="margin:1rem 0;">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}"
             data-ad-slot="3645773527"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    `;

    // Optional bottom ad (appended if content shorter)
    const AD_HTML_BOTTOM = `
      <div class="injected-ad" data-slot="2627371172" style="margin:1.25rem 0;">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}"
             data-ad-slot="2627371172"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    `;

    // Start with the raw HTML content (fallback to a simple paragraph if missing)
    const rawHtml = item.htmlContent || "<p>No content</p>";

    // 1) Inject after 1st paragraph
    let contentWithAds = injectAdAfterNthTag(rawHtml, AD_HTML_TOP, "p", 1);

    // 3) For MCQ lists: inject after every 8th <li>
    contentWithAds = injectAdEveryNTag(contentWithAds, AD_HTML_MCQ, "li", 8);

    // 4) Ensure there's at least one bottom ad (appended)
    contentWithAds = contentWithAds + AD_HTML_BOTTOM;

    //
    // ========== END AD INJECTION ==========
    //

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

        {/* Main Content with injected ads */}
        <section>
          <article
            className="notes-content"
            // Render server-side injected HTML (includes <ins class="adsbygoogle"> placeholders)
            dangerouslySetInnerHTML={{
              __html: contentWithAds,
            }}
          />
        </section>

        {/* Client-side init to make injected ads render */}
        <InjectedAdsInit />

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
