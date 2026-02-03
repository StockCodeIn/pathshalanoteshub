// src/app/page.tsx
import Link from "next/link";
import Script from "next/script";
import styles from "@/styles/Home.module.css";
import type { Metadata } from "next";
import AdsenseAd from "@/components/AdsenseAd";

// ✅ SEO Metadata
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.pathshalanoteshub.in";

export const metadata: Metadata = {
  title: "Pathshala Notes Hub – Free RBSE & CBSE Notes (Class 10 & 12) + Indian GK",
  description:
    "Download FREE RBSE & CBSE Class 10, 12 Notes (PDF), Previous Year Papers & Indian GK. Best study material for board exams 2025-26. Hindi & English notes available.",
  keywords: [
    "RBSE notes class 10",
    "RBSE notes class 12",
    "CBSE notes class 10",
    "CBSE notes class 12",
    "RBSE previous year papers",
    "Indian GK",
    "current affairs 2025",
    "board exam notes",
    "free study material",
    "pathshala notes hub"
  ],
  alternates: {
    canonical: "https://www.pathshalanoteshub.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Pathshala Notes Hub – Free RBSE & CBSE Notes + Indian GK",
    description:
      "Free RBSE & CBSE Class 10–12 notes, previous year papers and Indian GK study material.",
    url: siteUrl,
    siteName: "Pathshala Notes Hub",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Pathshala Notes Hub - Free Education",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pathshala Notes Hub – Free RBSE & CBSE Notes",
    description: "Free study material for Class 10 & 12 students",
    images: [`${siteUrl}/og-image.png`],
  },
};
export const revalidate = 86400; // 24 hours

// Boards Data
const boardsData = [
  {
    href: "/rbse",
    title: "RBSE Notes (Class 10 & 12)",
    description:
      "Rajasthan Board (RBSE) 10वीं व 12वीं के chapter-wise Hindi notes.",
  },
  {
    href: "/cbse",
    title: "CBSE Notes (Class 10 & 12)",
    description:
      "CBSE 10th & 12th chapter-wise English notes.",
  },
  {
    href: "/rbse-papers",
    title: "RBSE Previous Year Question Papers",
    description:
      "RBSE 10वीं और 12वीं के पिछले 5 वर्षों के प्रश्न पत्र और उनके solutions.",
  },
];

// Subjects Data
const subjectsData = [
  {
    href: "/rbse/10/mathematics",
    title: "RBSE Class 10 Mathematics Notes",
    description: "पूरे syllabus के chapter-wise notes और उदाहरण।",
  },
  {
    href: "/rbse/10/science",
    title: "RBSE Class 10 Science Notes",
    description: "Exam-focused और आसान भाषा में notes।",
  },
  {
    href: "/rbse/12/mathematics",
    title: "RBSE Class 12 Mathematics Notes",
    description: "Chapter-wise theory + questions practice के लिए।",
  },
  {
    href: "/rbse/12/physics",
    title: "RBSE Class 12 Physics Notes",
    description: "Concepts + numericals को आसान तरीके से समझाया गया है।",
  },
  {
    href: "/rbse/12/chemistry",
    title: "RBSE Class 12 Chemistry Notes",
    description: "Chapter-wise notes, equations और diagrams के साथ।",
  },
  {
    href: "/cbse/10/mathematics",
    title: "CBSE Class 10 Mathematics Notes",
    description: "Step-by-step solutions और important questions।",
  },
  {
    href: "/cbse/10/science",
    title: "CBSE Class 10 Science Notes",
    description: "Detailed notes with NCERT reference points।",
  },
  {
    href: "/cbse/12/mathematics",
    title: "CBSE Class 12 Mathematics Notes",
    description: "Chapter-wise theory, examples और PYQs।",
  },
  {
    href: "/cbse/12/physics",
    title: "CBSE Class 12 Physics Notes",
    description: "Numerical + theory notes, exam point of view से।",
  },
  {
    href: "/cbse/12/chemistry",
    title: "CBSE Class 12 Chemistry Notes",
    description: "Chapter notes, reactions और equations के साथ।",
  },
];

// ✅ Indian GK & Current Affairs Data
const gkData = [
  {
    href: "/gk/current-affairs",
    title: "Current Affairs 2025",
    description:
      "Indian current affairs 2025 – daily और monthly updates, exams को ध्यान में रखकर।",
  },
  {
    href: "/gk/indian-history",
    title: "Indian History Notes",
    description:
      "प्राचीन, मध्यकालीन और आधुनिक भारत का इतिहास topic-wise notes के रूप में।",
  },
  {
    href: "/gk/polity",
    title: "Indian Polity Notes",
    description:
      "भारतीय संविधान, संसद, राष्ट्रपति, न्यायपालिका आदि से जुड़े महत्वपूर्ण टॉपिक।",
  },
  {
    href: "/gk/geography",
    title: "Indian Geography Notes",
    description:
      "भारत का भूगोल – नदियाँ, पर्वत, कृषि, जलवायु आदि पर विस्तृत notes।",
  },
];

// Study Resources Data
const studyResources = [
  { href: "/study-plan", title: "Study Plan (पढ़ाई की योजना)" },
  { href: "/time-management", title: "Time Management (समय प्रबंधन टिप्स)" },
  { href: "/gk", title: "Indian GK & Current Affairs" },
];

// FAQ Data
const faqData = [
  {
    q: "What is Pathshala Notes Hub?",
    a: "Pathshala Notes Hub एक free online study platform है जहाँ RBSE और CBSE कक्षा 10 व 12 के notes, previous year question papers, Indian GK और study resources उपलब्ध हैं।",
  },
  {
    q: "Are the notes and question papers free?",
    a: "हाँ, Pathshala Notes Hub पर उपलब्ध सभी notes, question papers और Indian GK content पूरी तरह से free हैं।",
  },
  {
    q: "Which boards do you cover?",
    a: "हम फिलहाल RBSE (Rajasthan Board) और CBSE (Central Board of Secondary Education) के लिए class 10 और 12 के notes व question papers provide कर रहे हैं।",
  },
  {
    q: "Is Indian GK content useful for exams?",
    a: "हाँ, हमारा Indian GK content board exams, competitive exams (जैसे police, Patwari, सरकारी नौकरी की तैयारी) और सामान्य ज्ञान बढ़ाने के लिए helpful है।",
  },
  {
    q: "What type of Indian GK topics are covered?",
    a: "हम Indian GK में Current Affairs, Indian History, Indian Polity, Indian Geography और अन्य महत्वपूर्ण विषयों को topic-wise notes के रूप में cover करते हैं।",
  },
];

export default function Home() {
  return (
    <main style={{ overflow: "hidden" }}>
      {/* ✅ Hero Section */}
      <section
        className={styles.hero}
        aria-labelledby="home-title"
      >

        <div className={styles.heroContent}>
          <h1 id="home-title">Pathshala Notes Hub - Free RBSE, CBSE Notes &amp; Indian GK</h1>
          <p>
            <strong>Class 10 &amp; 12 के लिए बेस्ट FREE Study Material</strong> – 
            RBSE एवं CBSE बोर्ड परीक्षा की तैयारी के साथ-साथ{" "}
            <strong>Indian GK, Current Affairs, History, Polity और Geography</strong>
            के लिए भरोसेमंद प्लेटफॉर्म। यहां पर आपको{" "}
            <strong>Chapter-wise PDF notes, previous year question papers</strong> और{" "}
            <strong>Indian GK topic-wise notes</strong> बिल्कुल free मिलते हैं।
          </p>
          <div className={styles.heroButtons}>
            <Link href="/rbse" className={styles.ctaButton}>
              📚 RBSE Notes
            </Link>
            <Link href="/cbse" className={styles.ctaButtonSecondary}>
              📖 CBSE Notes
            </Link>
          </div>
          <div className={styles.heroButtons} style={{ marginTop: "0.75rem" }}>
            <Link href="/gk" className={styles.ctaButtonTertiary}>
              🇮🇳 Indian GK &amp; Current Affairs
            </Link>
          </div>
        </div>
      </section>



      {/* ✅ Boards Section */}
      <h2 className={styles.sectionTitle}>RBSE &amp; CBSE Notes / Question Papers</h2>
      <ul className={styles.listContainer}>
        {boardsData.map((board, i) => (
          <li key={i}>
            <Link href={board.href} className={styles.listCard}>
              <h3>{board.title}</h3>
              <p>{board.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      
      <AdsenseAd slot="6017620145" variant="display" />

      {/* ✅ Study Resources Section */}
      <h2 className={styles.sectionTitle}>Study Resources &amp; Exam Guidance</h2>
      <ul className={styles.listContainer}>
        {studyResources.map((res, i) => (
          <li key={i}>
            <Link href={res.href} className={styles.listCard}>
              <h3>{res.title}</h3>
            </Link>
          </li>
        ))}
      </ul>

      {/* ✅ Indian GK & Current Affairs Section */}
      <h2 className={styles.sectionTitle}>Indian GK, Current Affairs &amp; Static GK</h2>
      <div className={styles.cardContainer2}>
        {gkData.map((item, i) => (
          <Link key={i} href={item.href} className={styles.card2}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>

      {/* ✅ Important Subjects */}
      <h2 className={styles.sectionTitle}>Important Subjects for Class 10 &amp; 12</h2>
      <div className={styles.cardContainer2}>
        {subjectsData.map((sub, i) => (
          <Link key={i} href={sub.href} className={styles.card2}>
            <h3>{sub.title}</h3>
            <p>{sub.description}</p>
          </Link>
        ))}
      </div>

      
      {/* <AdsenseAd slot="5035533356" variant="display" /> */}

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Students Trust Pathshala Notes Hub?</h2>
        <ul>
          <li>✔ 100% Free RBSE, CBSE और Indian GK study resources</li>
          <li>✔ Board-specific, updated और exam-focused notes</li>
          <li>✔ आसान भाषा में समझाए गए concepts और examples</li>
          <li>✔ Indian GK के लिए Current Affairs + Static GK दोनों cover</li>
        </ul>
      </section>

      {/* ✅ FAQ Accordion */}
      <section className={styles.faq}>
        <h2>Frequently Asked Questions (FAQ)</h2>
        <div className={styles.faqList}>
          {faqData.map((faq, i) => (
            <details key={i} className={styles.faqItem}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ✅ FAQ JSON-LD */}
      <Script
        id="faq-schema"
        strategy="lazyOnload"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />

      <Script
        id="organization-schema"
        strategy="lazyOnload"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Pathshala Notes Hub",
            url: siteUrl,
            logo: `${siteUrl}/logo.png`,
            sameAs: [],
          }),
        }}
      />


      {/* ✅ Website & Breadcrumb JSON-LD for better SEO */}
      <Script
        id="website-schema"
        strategy="lazyOnload"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Pathshala Notes Hub",
            url: siteUrl,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      <Script
        id="breadcrumb-schema"
        strategy="lazyOnload"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "RBSE Notes",
                item: `${siteUrl}/rbse`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "CBSE Notes",
                item: `${siteUrl}/cbse`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: "Indian GK",
                item: `${siteUrl}/gk`,
              },
            ],
          }),
        }}
      />
    </main>
  );
}
