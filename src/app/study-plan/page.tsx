import type { Metadata } from "next";
import StudyPlanNotes from "@/components/StudyPlanNotes";
import styles from "@/styles/Home.module.css";

export const metadata: Metadata = {
  title: "Study Plan Guide 2025 | How to Create Study Timetable for RBSE & CBSE Students",
  description:
    "जानिए कैसे बनाएं एक प्रभावी Study Plan जो आपको हर विषय में संतुलन, फोकस और सफलता दिलाए। RBSE और CBSE छात्रों के लिए दैनिक, साप्ताहिक और परीक्षा-केंद्रित स्टडी प्लान।",
  keywords: [
    "Study Plan",
    "RBSE Study Plan",
    "CBSE Study Plan",
    "Daily Study Timetable",
    "How to make Study Plan",
    "Exam Preparation",
    "Study Schedule",
    "Pathshala Notes Hub",
  ],
  openGraph: {
    title: "Study Plan for Students | RBSE & CBSE Preparation 2025",
    description:
      "RBSE और CBSE छात्रों के लिए संपूर्ण Study Plan Guide — जानिए कैसे बनाएं Daily, Weekly और Exam-focused Study Timetable।",
    type: "article",
    locale: "hi_IN",
    url: "https://pathshalanoteshub.in/study-plan",
    siteName: "Pathshala Notes Hub",
  },
  alternates: {
    canonical: "https://pathshalanoteshub.in/study-plan",
  },
};

export default function StudyPlanPage() {
  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Study Plan 2025 — RBSE और CBSE छात्रों के लिए संपूर्ण मार्गदर्शिका</h1>
          <p>
            एक मजबूत स्टडी प्लान आपकी सफलता की कुंजी है। यहां जानिए कैसे आप अपने syllabus को समझकर
            एक ऐसा टाइमटेबल बना सकते हैं जो हर परीक्षा में आपकी तैयारी को बेहतर बनाए।
          </p>
        </div>
      </section>

      {/* ✅ Main Study Plan Component */}
      <StudyPlanNotes />
    </main>
  );
}
