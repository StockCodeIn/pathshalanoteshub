'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// NOTE: relative path -> from app/gk/[topic]/[subtopic]/page.tsx to components/PDFViewer.tsx
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
});

export default function SubtopicPDFPage() {
  const params = useParams();
  const topic = decodeURIComponent((params?.topic as string) || '');
  const subtopic = decodeURIComponent((params?.subtopic as string) || '');

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topic || !subtopic) return;

    const fetchPDF = async () => {
      try {
        const res = await fetch(
          `/api/gk?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`
        );
        const data = await res.json();
        if (data.success && data.subtopic) {
          setPdfUrl(data.subtopic.pdfUrl);
        }
      } catch (err) {
        console.error('PDF fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();
  }, [topic, subtopic]);

  if (loading) return <p style={{ padding: '20px' }}>लोड हो रहा है...</p>;
  if (!pdfUrl) return <p style={{ padding: '20px' }}>PDF नहीं मिला।</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '22px', textAlign: 'center' }}>
        {subtopic}
      </h1>

      {/* PDFViewer component will only load in browser (no SSR) */}
      <PDFViewer
        url={pdfUrl}
        title={subtopic}
        board="GK"
        grade="General"
        subject={topic}
      />

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a
          href={`/api/download?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(
            subtopic
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '5px',
            textDecoration: 'none',
          }}
        >
          Download Watermarked PDF
        </a>
      </div>
    </div>
  );
}
