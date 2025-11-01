// src/components/SubsubListPage.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

interface SubSub {
  _id: string;
  name: string;
  displayName?: string; // ✅ new field for Hindi display
}

interface Props {
  topic: string;
  subtopic: string;
}

export default function SubsubListPage({ topic, subtopic }: Props) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<SubSub[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `/api/gk/${encodeURIComponent(topic)}/${encodeURIComponent(subtopic)}`;
        const res = await fetch(url);

        if (!res.ok) {
          let body = null;
          try { body = await res.text(); } catch (e) { /* ignore */ }
          console.error('Fetch /api/gk failed', { url, status: res.status, statusText: res.statusText, body });
          throw new Error(`Server responded ${res.status}`);
        }

        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          console.warn('API returned success=false or items not array', data);
          setItems([]);
        }
      } catch (err: any) {
        console.error('Error fetching subsub list:', err);
        setError('डेटा लोड करने में त्रुटि हुई। (Console देखें)');
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [topic, subtopic]);

  if (loading) return <p style={{ padding: 20 }}>लोड हो रहा है...</p>;
  if (error) return <p style={{ padding: 20 }}>{error}</p>;
  if (items.length === 0) return <p style={{ padding: 20 }}>कोई उप-विषय नहीं मिला।</p>;

  // 🧠 Function to clean English slug if displayName not present
  const cleanName = (name: string) => {
    if (!name) return '';
    const hasHindi = /[\u0900-\u097F]/.test(name);
    if (hasHindi) return name;
    const spaced = decodeURIComponent(name).replace(/-/g, ' ');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  return (
    <section style={{ padding: '2rem 1rem' }}>
      <div className={styles.cardContainer2}>
        {items.map((s) => {
          const displayText = s.displayName?.trim() || cleanName(s.name);

          return (
            <Link
              href={`/gk/${encodeURIComponent(topic)}/${encodeURIComponent(subtopic)}/${encodeURIComponent(s.name)}`}
              key={s._id}
              className={styles.card2}
              style={{
                background: '#fff',
                color: '#222',
                border: '1px solid #eee',
                padding: '1.25rem',
                borderRadius: '12px',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>{displayText}</h3>
              <p style={{ marginTop: 6, color: '#555', fontSize: '0.9rem' }}>
                Explore: {displayText} Notes
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
