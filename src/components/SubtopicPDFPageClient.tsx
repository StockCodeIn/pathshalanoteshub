"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Lazy-load PDFViewer (no SSR)
const PDFViewer = dynamic(() => import("@/components/PDFViewer"), { ssr: false });

interface Props {
  topic: string;
  subtopic: string;
}

export default function SubtopicPDFPageClient({ topic, subtopic }: Props) {
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
      } catch (error) {
        console.error("Error fetching PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();
  }, [topic, subtopic]);

  if (loading) return <p style={{ textAlign: "center", padding: "20px" }}>लोड हो रहा है...</p>;
  if (!pdfUrl) return <p style={{ textAlign: "center", padding: "20px" }}>PDF नहीं मिला।</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <PDFViewer url={pdfUrl} title={subtopic} topic={topic} subtopic={subtopic} />
    </div>
  );
}
