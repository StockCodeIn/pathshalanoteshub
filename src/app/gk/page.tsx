// src/app/gk/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import gkData from "@/data/gkData";

export const metadata: Metadata = {
  title: "सामान्य ज्ञान (GK) Notes in Hindi – Current Affairs, History, Polity | Pathshala Notes Hub",
  description:
    "सामान्य ज्ञान (GK) के महत्वपूर्ण टॉपिक्स – Current Affairs, Indian History, Polity, Geography, Science. UPSC, SSC, RPSC, Railway, Bank और अन्य प्रतियोगी परीक्षाओं के लिए उपयोगी GK Notes.",
  alternates: {
    canonical: "https://pathshalanoteshub.in/gk", // ✅ absolute URL
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function GKPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>सामान्य ज्ञान (General Knowledge – GK)</h1>
          <p>
            यहां आपको <strong>Current Affairs, Indian History, Geography, Polity और Science</strong>{" "}
            से जुड़े महत्वपूर्ण GK Notes मिलेंगे, जो{" "}
            <strong>UPSC, SSC, RPSC, Railway, Bank</strong> और अन्य प्रतियोगी परीक्षाओं
            के लिए उपयोगी हैं।
          </p>
        </div>
      </section>

      {/* SEO Intro Content */}
      <section style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
        <h2>GK Notes क्यों ज़रूरी हैं?</h2>
        <p>
          सामान्य ज्ञान (GK) लगभग सभी सरकारी और प्रतियोगी परीक्षाओं का महत्वपूर्ण हिस्सा होता है।
          सही और अपडेटेड GK Notes से आप कम समय में ज्यादा विषयों की तैयारी कर सकते हैं।
          हमारी GK सामग्री syllabus-based, exam-oriented और आसान भाषा में तैयार की गई है।
        </p>
      </section>

      {/* GK Topics */}
      <h2 className={styles.sectionTitle}>GK Topics List</h2>
      <div className={styles.cardContainer2}>
        {gkData.map((topic) => (
          <Link
            key={topic.slug}
            href={`/gk/${topic.slug}`}
            className={styles.card2}
          >
            <h3>{topic.title}</h3>
            <p>Important GK notes for exams</p>
          </Link>
        ))}
      </div>

      {/* Trust Section */}
      <section className={styles.trust}>
        <h2>हमारे GK Notes की खासियत</h2>
        <ul>
          <li>✔ प्रतियोगी परीक्षाओं के अनुसार तैयार किया गया कंटेंट</li>
          <li>✔ Static GK + Current Affairs दोनों शामिल</li>
          <li>✔ आसान भाषा और पूरी तरह मुफ्त</li>
        </ul>
      </section>
    </main>
  );
}
