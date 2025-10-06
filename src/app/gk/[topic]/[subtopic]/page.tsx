import type { Metadata } from "next";
import SubtopicPDFPageClient from "@/components/SubtopicPDFPageClient";
import styles from "@/styles/Home.module.css";

interface PageProps {
  params: Promise<{
    topic: string;
    subtopic: string;
  }>;
}

// ✅ Dynamic SEO Metadata (fixed with async params)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic, subtopic } = await params; // ✅ await params

  const topicName = decodeURIComponent(topic).replace(/-/g, " ");
  const subtopicName = decodeURIComponent(subtopic).replace(/-/g, " ");

  const title = `${subtopicName} - ${topicName} GK Notes | Pathshala Notes Hub`;
  const description = `${topicName} विषय के अंतर्गत "${subtopicName}" के महत्वपूर्ण सामान्य ज्ञान (GK) नोट्स और अध्ययन सामग्री PDF। प्रतियोगी परीक्षाओं जैसे UPSC, SSC, RPSC, Railway, Bank के लिए उपयोगी सामग्री।`;

  return {
    title,
    description,
    keywords: [
      subtopicName,
      topicName,
      "GK Notes",
      "सामान्य ज्ञान",
      "Pathshala Notes Hub",
      "UPSC GK Notes",
      "SSC GK Notes",
    ],
    openGraph: {
      title,
      description,
      type: "article",
      locale: "hi_IN",
    },
  };
}

// ✅ Server component renders the client component
export default async function SubtopicPDFPage({ params }: PageProps) {
  const { topic, subtopic } = await params; // ✅ await params

  const topicName = decodeURIComponent(topic).replace(/-/g, " ");
  const subtopicName = decodeURIComponent(subtopic).replace(/-/g, " ");

  return (
    <main>
      {/* ✅ Hero Section (Same Styling as GKTopicPage) */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            {subtopicName} - {topicName}
          </h1>
          <p>
             यह पेज {topicName} विषय के अंतर्गत &quot;{subtopicName}&quot; से संबंधित महत्वपूर्ण नोट्स,
          जानकारी और PDF अध्ययन सामग्री प्रदान करता है।
          </p>
        </div>
      </section>

      {/* ✅ PDF Viewer (Client component) */}
      <SubtopicPDFPageClient topic={topic} subtopic={subtopic} />
    </main>
  );
}
