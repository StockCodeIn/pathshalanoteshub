'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SubtopicListPage() {
  const params = useParams();
  const topicSlug = params?.topic as string;

  const [subtopics, setSubtopics] = useState<any[]>([]);
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
        // console.error('Error fetching subtopics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubtopics();
  }, [topicSlug]);

  if (loading) return <p style={{ padding: '20px' }}>लोड हो रहा है...</p>;
  if (subtopics.length === 0) return <p style={{ padding: '20px' }}>कोई डेटा नहीं मिला।</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '22px', marginBottom: '20px', textAlign: 'center' }}>
        विषय: {topicSlug.replace(/-/g, ' ')}
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          justifyContent: 'center',
        }}
      >
        {subtopics.map((sub) => (
          <Link href={`/gk/${topicSlug}/${sub.subtopic}`} key={sub._id}>
            <div
              style={{
                maxWidth: '250px',
                margin: '0 auto',
                border: '1px solid #ccc',
                padding: '15px',
                borderRadius: '12px',
                background: '#f9f9f9',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {sub.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
