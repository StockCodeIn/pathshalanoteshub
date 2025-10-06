import type { Metadata } from 'next';
import SubtopicListPage from '@/components/SubtopicListPage';
import styles from '@/styles/Home.module.css';

interface PageProps {
  params: Promise<{ topic: string }>;
}

// ✅ Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topic } = await params; // ✅ await params
  const topicName = topic.replace(/-/g, ' ');

  return {
    title: `GK - ${topicName} | Pathshala Notes Hub`,
    description: `सामान्य ज्ञान (GK) के लिए ${topicName} से संबंधित महत्वपूर्ण टॉपिक्स और प्रश्न। UPSC, SSC, RPSC, Bank, Railway परीक्षा तैयारी के लिए उपयोगी सामग्री।`,
    keywords: [`GK`, topicName, 'सामान्य ज्ञान', 'Competitive Exam GK', 'UPSC GK', 'SSC GK'],
  };
}

// ✅ Server component renders client component
export default async function GKTopicPage({ params }: PageProps) {
  const { topic } = await params; // ✅ await params
  const topicSlug = topic;

  return (
    <main>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>सामान्य ज्ञान (GK) - {topicSlug.replace(/-/g, ' ')}</h1>
          <p>
            यहां आपको {topicSlug.replace(/-/g, ' ')} से संबंधित सभी महत्वपूर्ण सबटॉपिक्स और नोट्स मिलेंगे,।
            इन नोट्स की मदद से आप UPSC, SSC, RPSC, Bank, Railway और अन्य प्रतियोगी परीक्षाओं की तैयारी कर सकते हैं।
          </p>
        </div>
      </section>

      {/* Client Component */}
      <SubtopicListPage topicSlug={topicSlug} />
    </main>
  );
}
