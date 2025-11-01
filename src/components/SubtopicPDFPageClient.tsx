// src/components/SubtopicPDFPageClient.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy-load PDFViewer (no SSR)
const PDFViewer = dynamic(() => import("@/components/PDFViewer"), { ssr: false });

interface Props {
  topic: string;
  subtopic: string;
  subsub?: string | null;
}

export default function SubtopicPDFPageClient({ topic, subtopic, subsub }: Props) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        if (subsub) {
          const res = await fetch(
            `/api/gk/${encodeURIComponent(topic)}/${encodeURIComponent(subtopic)}/${encodeURIComponent(
              subsub
            )}`
          );
          if (!res.ok) throw new Error('Not found');
          const data = await res.json();
          if (data.success && data.item) setHtml(data.item.htmlContent || null);
          else setHtml(null);
        } else {
          // Backwards-compatible: fetch subtopic (may contain pdfUrl or extractedHtml)
          const res = await fetch(
            `/api/gk?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`
          );
          const data = await res.json();
          if (data.success && data.subtopic) setHtml(data.subtopic.extractedHtml || null);
          else setHtml(null);
        }
      } catch (err) {
        setError('Content not found');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [topic, subtopic, subsub]);

  if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>लोड हो रहा है...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '20px' }}>{error}</p>;
  if (!html) return <p style={{ textAlign: 'center', padding: '20px' }}>सामग्री उपलब्ध नहीं है।</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <article dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
