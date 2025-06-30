'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
// ✅ Use legacy build to avoid Node.js SSR warnings/errors
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';
import 'pdfjs-dist/web/pdf_viewer.css';

// ✅ Set worker path from public folder
GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

export default function SubtopicPDFPage() {
  const params = useParams();

  const topic = decodeURIComponent(params?.topic as string || '');
  const subtopic = decodeURIComponent(params?.subtopic as string || '');

  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topic || !subtopic) return;

    const fetchPDF = async () => {
      try {
        const res = await fetch(`/api/gk?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`);
        const data = await res.json();

        if (data.success && data.subtopic) {
          setPdfUrl(data.subtopic.pdfUrl);
        }
      } catch (error) {
        // console.error('Error fetching PDF:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPDF();
  }, [topic, subtopic]);

  useEffect(() => {
    if (!pdfUrl) return;

    const renderPDF = async () => {
      try {
        const loadingTask = getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        const container = containerRef.current;
        if (!container) return;

        container.innerHTML = '';

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);

          const viewport = page.getViewport({ scale: 1.2 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d')!;
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          canvas.style.maxWidth = '100%';
          canvas.style.height = 'auto';
          canvas.style.display = 'block';
          canvas.style.margin = '0 auto';

          await page.render({ canvasContext: context, viewport }).promise;

          container.appendChild(canvas);
          container.appendChild(document.createElement('br'));
        }
      } catch (error) {
        // console.error('PDF Render Error:', error);
      }
    };

    renderPDF();
  }, [pdfUrl]);

  if (loading) return <p style={{ padding: '20px' }}>लोड हो रहा है...</p>;
  if (!pdfUrl) return <p style={{ padding: '20px' }}>PDF नहीं मिला।</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '22px', textAlign: 'center' }}>{subtopic}</h1>

      <div ref={containerRef} style={{ textAlign: 'center' }}></div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <a
          href={`/api/download?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`}
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
