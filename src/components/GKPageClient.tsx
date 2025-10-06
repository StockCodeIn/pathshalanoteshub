'use client';

import Link from 'next/link';
import styles from '@/styles/Home.module.css';

const topics = [
  { title: 'करंट अफेयर्स', slug: 'current-affairs' },
  { title: 'भारतीय इतिहास', slug: 'indian-history' },
  { title: 'भूगोल (भारत और विश्व)', slug: 'geography' },
  { title: 'राजव्यवस्था (भारतीय संविधान)', slug: 'polity' },
  { title: 'विज्ञान और प्रौद्योगिकी', slug: 'science-technology' },
  { title: 'महत्वपूर्ण दिन और घटनाएँ', slug: 'important-days-events' },
  { title: 'खेल सामान्य ज्ञान', slug: 'sports-gk' },
  { title: 'पुस्तकें और लेखक', slug: 'books-authors' },
  { title: 'पुरस्कार और सम्मान', slug: 'awards-honours' },
  { title: 'स्थैतिक सामान्य ज्ञान', slug: 'static-gk' },
];

export default function GKPageClient() {
  return (
    <main>
      {/* ✅ Hero Section with Intro */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>सामान्य ज्ञान (General Knowledge - GK)</h1>
          <p>
            यहां आपको प्रतियोगी परीक्षाओं के लिए महत्वपूर्ण Indian GK टॉपिक्स मिलेंगे – करंट अफेयर्स,
            इतिहास, भूगोल, विज्ञान, संविधान, खेल, पुरस्कार और बहुत कुछ।  
            इन टॉपिक्स की मदद से आप UPSC, SSC, RPSC, Bank, Railway और अन्य परीक्षाओं की तैयारी कर सकते हैं।
          </p>
        </div>
      </section>

      {/* ✅ GK Topics Grid */}
      <section>
        <h2 className={styles.sectionTitle}>GK Topics List</h2>
        <div className={styles.cardContainer2}>
          {topics.map((topic) => (
            <Link
              href={`/gk/${topic.slug}`}
              key={topic.slug}
              className={styles.card2}
              style={{ background: '#fff', color: '#333' , border: '1px solid #eee'}}
            >
              {/* <div className={styles.cardIcon}>📘</div> */}
              <h3>{topic.title}</h3>
              <p>Click to explore {topic.slug}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>क्यों पढ़ें हमारे GK Notes?</h2>
        <ul>
          <li>✔ प्रतियोगी परीक्षाओं (UPSC, SSC, RPSC, Railway, Bank) के लिए Best</li>
          <li>✔ करंट अफेयर्स + स्थैतिक GK दोनों शामिल</li>
          <li>✔ Free और आसानी से समझने योग्य नोट्स</li>
        </ul>
      </section>
    </main>
  );
}
