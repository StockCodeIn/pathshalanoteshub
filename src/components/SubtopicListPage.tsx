// src/components/SubtopicListPage.tsx
'use client';

import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import gkData from '@/data/gkData';

interface Props {
  topicSlug: string;
}

export default function SubtopicListPage({ topicSlug }: Props) {
  const topic = gkData.find((t) => t.slug === topicSlug);

  if (!topic) {
    return <p style={{ padding: '20px' }}>टॉपिक नहीं मिला</p>;
  }

  return (
    <section style={{ padding: '20px' }}>
      <h2 className={styles.h2class} style={{ textAlign: 'center', marginBottom: '20px' }}>
        {topic.title}
      </h2>

      <div className={styles.cardContainer2}>
        {topic.subtopics.map((sub) => (
          <Link
            href={`/gk/${topic.slug}/${sub.slug}`}
            key={sub.slug}
            className={styles.card2}
          >
            <h3>{sub.title}</h3>
            <p>{sub.title} से जुड़े महत्वपूर्ण नोट्स</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
