'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

interface Subtopic {
  _id: string;
  title: string;
  subtopic: string;
}

interface Props {
  topicSlug: string;
}

export default function SubtopicListPage({ topicSlug }: Props) {
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubtopics = async () => {
      try {
        const res = await fetch(`/api/gk?topic=${topicSlug}`);
        const data = await res.json();
        if (data.success) {
          setSubtopics(data.subtopics);
        }
      } catch (error) {
        console.error('Error fetching subtopics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubtopics();
  }, [topicSlug]);

  if (loading) return <p style={{ padding: '20px' }}>लोड हो रहा है...</p>;
  if (subtopics.length === 0) return <p style={{ padding: '20px' }}>कोई डेटा नहीं मिला।</p>;

  return (
    <section style={{ padding: '20px' }}>
      <h2 className={styles.h2class} style={{ textAlign: 'center', marginBottom: '20px' }}>
        {topicSlug.replace(/-/g, ' ')} के सबटॉपिक्स
      </h2>

      <div className={styles.cardContainer2}>
        {subtopics.map((sub) => (
          <Link
            href={`/gk/${topicSlug}/${sub.subtopic}`}
            key={sub._id}
            className={styles.card2}
            style={{ background: '#fff', color: '#333' , border: '1px solid #eee'}}
          >
            {/* <div className={styles.cardIcon}>📘</div> */}
            <h3>{sub.title}</h3>
            <p>{sub.title} से जुड़े महत्वपूर्ण नोट्स</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
