'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// NOTE: relative path -> from app/gk/[topic]/[subtopic]/page.tsx to components/PDFViewerClient.tsx
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

      {/* ✅ Download button ab PDFViewerClient ke andar hi hoga */}
      <PDFViewer
        url={pdfUrl}
        title={subtopic}
        topic={topic}
        subtopic={subtopic}
      />
    </div>
  );
}
