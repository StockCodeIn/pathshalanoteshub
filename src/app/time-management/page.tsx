import type { Metadata } from "next";
import TimeManagementNotes from "@/components/TimeManagementNotes";
import styles from "@/styles/Home.module.css";
import Script from "next/script";

// ✅ SEO Metadata (for Google Ranking)
export const metadata: Metadata = {
  title: "Time Management for Students 2025 | RBSE & CBSE Study Tips",
  description:
    "जानिए विद्यार्थियों के लिए टाइम मैनेजमेंट कैसे करें। RBSE और CBSE छात्रों के लिए प्रभावी समय प्रबंधन के टिप्स, टाइमटेबल और पढ़ाई की रणनीतियाँ।",
  keywords: [
    "Time Management for Students",
    "RBSE Time Management",
    "CBSE Time Management",
    "Study Tips",
    "Exam Preparation",
    "Student Time Table",
    "Pomodoro Technique",
    "Pathshala Notes Hub",
  ],
  openGraph: {
    title: "Time Management Guide for RBSE & CBSE Students | 2025",
    description:
      "RBSE और CBSE छात्रों के लिए टाइम मैनेजमेंट गाइड — सीखें कैसे बनाएं प्रभावी टाइमटेबल और पढ़ाई की रणनीतियाँ।",
    type: "article",
    locale: "hi_IN",
    url: "https://pathshalanoteshub.in/time-management",
    siteName: "Pathshala Notes Hub",
  },
  alternates: {
    canonical: "https://pathshalanoteshub.in/time-management",
  },
};

export default function TimeManagementPage() {
  return (
    <main>
      {/* ✅ Hero Section (SEO + user-friendly) */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>🕒 Time Management for Students (RBSE & CBSE)</h1>
          <p>
            टाइम मैनेजमेंट एक ऐसी स्किल है जो आपकी पढ़ाई, परीक्षा और जीवन में सफलता की नींव रखती है।
            यहां जानिए कैसे आप अपने दिन को सही ढंग से प्लान करें और हर विषय में संतुलन बनाए रखें।
          </p>
        </div>
      </section>

      {/* ✅ Main Content Component */}
      <TimeManagementNotes />

      {/* ✅ Google Rich Results (FAQ Schema JSON-LD) */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "टाइम मैनेजमेंट क्या है?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "टाइम मैनेजमेंट का मतलब है अपने समय का सही उपयोग करना ताकि आप बिना तनाव के अपने लक्ष्यों को प्राप्त कर सकें।",
                },
              },
              {
                "@type": "Question",
                "name": "विद्यार्थियों को टाइम मैनेजमेंट क्यों सीखना चाहिए?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "टाइम मैनेजमेंट से पढ़ाई में फोकस बढ़ता है, तनाव कम होता है और परीक्षा में बेहतर प्रदर्शन होता है।",
                },
              },
              {
                "@type": "Question",
                "name": "टाइम मैनेजमेंट कैसे करें?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "एक प्रभावी टाइमटेबल बनाएं, कठिन विषय सुबह पढ़ें, distractions से दूर रहें और हर रविवार weekly review करें।",
                },
              },
              {
                "@type": "Question",
                "name": "Pomodoro Technique क्या है?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text":
                    "Pomodoro method में 25 मिनट तक फोकस से पढ़ाई की जाती है और उसके बाद 5 मिनट का ब्रेक लिया जाता है — इससे concentration बढ़ता है।",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
