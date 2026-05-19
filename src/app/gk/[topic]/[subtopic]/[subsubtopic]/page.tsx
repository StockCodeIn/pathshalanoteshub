import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";

import Breadcrumbs from "@/components/Breadcrumbs";
import Attribution from "@/components/Attribution";
import AdsenseAd from "@/components/AdsenseAd";

import connectDB from "@/lib/mongodb";
import GK from "@/models/gk";

import styles from "@/styles/Home.module.css";
import "@/styles/notes.css";

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

/* =========================================
   ✅ STATIC PARAMS (VERY IMPORTANT FOR SEO)
========================================= */

export async function generateStaticParams() {
  await connectDB();

  const items = await GK.find(
    {},
    {
      topic: 1,
      subtopic: 1,
      name: 1,
    }
  ).lean();

  return items.map((item: any) => ({
    topic: item.topic,
    subtopic: item.subtopic,
    subsubtopic: item.name,
  }));
}

/* =========================================
   ✅ ISR
========================================= */

export const revalidate = 604800; // 7 days

/* =========================================
   ✅ METADATA
========================================= */

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { topic, subtopic, subsubtopic } =
    await params;

  const decodedTopic = decodeURIComponent(
    topic
  ).replace(/-/g, " ");

  const decodedSubtopic = decodeURIComponent(
    subtopic
  ).replace(/-/g, " ");

  const decodedTitle = decodeURIComponent(
    subsubtopic
  ).replace(/-/g, " ");

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://www.pathshalanoteshub.in";

  const url = `${baseUrl}/gk/${topic}/${subtopic}/${subsubtopic}`;

  return {
    title: `${decodedTitle} GK Notes in Hindi | ${decodedSubtopic} | Pathshala Notes Hub`,

    description: `${decodedTitle} GK Notes in Hindi for SSC, UPSC, RPSC, Railway and competitive exams. पढ़ें महत्वपूर्ण सामान्य ज्ञान नोट्स और exam preparation material.`,

    keywords: [
      decodedTitle,
      `${decodedSubtopic} GK`,
      "GK Notes in Hindi",
      "SSC GK",
      "RPSC GK",
      "UPSC GK",
      "General Knowledge Notes",
      "Competitive Exam GK",
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `${decodedTitle} GK Notes`,
      description: `${decodedTitle} GK notes in Hindi for competitive exams.`,
      type: "article",
      locale: "hi_IN",
      url,

      images: [
        {
          url: `${baseUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
          alt: "GK Notes",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${decodedTitle} GK Notes`,
      description: `${decodedTitle} GK notes in Hindi for SSC, UPSC and RPSC exams.`,
      images: [`${baseUrl}/android-chrome-512x512.png`],
    },
  };
}

/* =========================================
   ✅ MAIN PAGE
========================================= */

export default async function SubsubPage({
  params,
}: PageProps) {
  const { topic, subtopic, subsubtopic } =
    await params;

  await connectDB();

  const item = await GK.findOne({
    topic,
    subtopic,
    name: subsubtopic,
  })
    .lean<GKType>()
    .maxTimeMS(5000);

  if (!item) {
    notFound();
  }

  const decodedTopic = decodeURIComponent(
    topic
  ).replace(/-/g, " ");

  const decodedSubtopic = decodeURIComponent(
    subtopic
  ).replace(/-/g, " ");

  const displayTitle =
    item.displayName ||
    decodeURIComponent(subsubtopic).replace(
      /-/g,
      " "
    );

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://www.pathshalanoteshub.in";

  const pageUrl = `${baseUrl}/gk/${topic}/${subtopic}/${subsubtopic}`;

  const lastModified =
    item.updatedAt?.toISOString() ||
    new Date().toISOString();

  /* =========================================
     ✅ BREADCRUMB SCHEMA
  ========================================= */

  const breadcrumbSchema = {
    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${baseUrl}/`,
      },

      {
        "@type": "ListItem",
        position: 2,
        name: "GK",
        item: `${baseUrl}/gk`,
      },

      {
        "@type": "ListItem",
        position: 3,
        name: decodedTopic,
        item: `${baseUrl}/gk/${topic}`,
      },

      {
        "@type": "ListItem",
        position: 4,
        name: decodedSubtopic,
        item: `${baseUrl}/gk/${topic}/${subtopic}`,
      },

      {
        "@type": "ListItem",
        position: 5,
        name: displayTitle,
        item: pageUrl,
      },
    ],
  };

  return (
    <main>
      {/* =========================================
          ✅ HERO SECTION
      ========================================= */}

      <section
        className={styles.hero}
        style={{
          containIntrinsicSize: "260px",
        }}
      >
        <div className={styles.heroContent}>
          <h1>{displayTitle}</h1>

          <p>
            {decodedSubtopic} GK Notes in Hindi
            for SSC, UPSC, RPSC and competitive
            exams.
          </p>
        </div>
      </section>

      {/* =========================================
          ✅ BREADCRUMBS
      ========================================= */}

      <section
        style={{
          maxWidth: 900,
          margin: "0.5rem auto",
          padding: "0 1rem",
          minHeight: 40,
        }}
      >
        <Breadcrumbs />
      </section>

      {/* =========================================
          ✅ TOP AD
      ========================================= */}

      <AdsenseAd
        slot="7492288576"
        variant="display"
      />

      {/* =========================================
          ✅ LAST UPDATED
      ========================================= */}

      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 1rem",
          fontSize: "0.9rem",
          opacity: 0.8,
        }}
      >
        <p>
          Last Updated:{" "}
          {new Date(lastModified).toLocaleDateString(
            "en-IN"
          )}
        </p>
      </section>

      {/* =========================================
          ✅ MAIN CONTENT
      ========================================= */}

      <section
        style={{
          maxWidth: 900,
          margin: "0.5rem auto",
          padding: "0 1rem",
          minHeight: "60vh",
        }}
      >
        <article
          className="notes-content"
          dangerouslySetInnerHTML={{
            __html: item.htmlContent || "",
          }}
        />
      </section>

      {/* =========================================
          ✅ RELATED TOPICS
      ========================================= */}

      <section
        style={{
          maxWidth: 900,
          margin: "2rem auto",
          padding: "0 1rem",
        }}
      >
        <h2>Related GK Topics</h2>

        <ul>
          <li>
            <a href="/gk/indian-history">
              Indian History GK
            </a>
          </li>

          <li>
            <a href="/gk/polity">
              Indian Polity GK
            </a>
          </li>

          <li>
            <a href="/gk/geography">
              Geography GK
            </a>
          </li>

          <li>
            <a href="/gk/current-affairs">
              Current Affairs
            </a>
          </li>
        </ul>
      </section>

      {/* =========================================
          ✅ ARTICLE SCHEMA
      ========================================= */}

      <Script
        id="article-schema"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",

            "@type": "Article",

            headline: displayTitle,

            description: `${displayTitle} GK Notes in Hindi for competitive exams.`,

            image: `${baseUrl}/android-chrome-512x512.png`,

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

            mainEntityOfPage: pageUrl,

            articleSection: decodedSubtopic,

            inLanguage: "hi-IN",
          }),
        }}
      />

      {/* =========================================
          ✅ BREADCRUMB SCHEMA
      ========================================= */}

      <Script
        id="breadcrumb-schema"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema
          ),
        }}
      />

      {/* =========================================
          ✅ FAQ SCHEMA
      ========================================= */}

      <Script
        id="faq-schema"
        strategy="afterInteractive"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context":
              "https://schema.org",

            "@type": "FAQPage",

            mainEntity: [
              {
                "@type": "Question",

                name: `${displayTitle} क्या है?`,

                acceptedAnswer: {
                  "@type": "Answer",

                  text: `${displayTitle} सामान्य ज्ञान (GK) का महत्वपूर्ण topic है जो competitive exams में पूछा जाता है।`,
                },
              },

              {
                "@type": "Question",

                name: `${displayTitle} किस exam के लिए important है?`,

                acceptedAnswer: {
                  "@type": "Answer",

                  text: `${displayTitle} SSC, UPSC, RPSC, Railway और अन्य competitive exams के लिए महत्वपूर्ण है।`,
                },
              },
            ],
          }),
        }}
      />

      {/* =========================================
          ✅ ATTRIBUTION
      ========================================= */}

      <Attribution
        dateModified={lastModified}
      />
    </main>
  );
}