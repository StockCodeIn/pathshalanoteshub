'use client';

import { useEffect, useRef, useState } from 'react';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
import '@/lib/pdfjs';

interface PDFViewerProps {
  url: string;
  title: string;
  board: string;
  grade: string;
  subject: string;
}

export default function PDFViewerClient({ url, title, board, grade, subject }: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(
    typeof window !== 'undefined' && window.innerWidth < 600 ? 2 : 1.2
  );
  const [pageCount, setPageCount] = useState(0);

  // Render PDF on scale or url change
  useEffect(() => {
    let cancelled = false;
    async function renderPDF() {
      if (!url || !containerRef.current) return;
      const container = containerRef.current;
      container.innerHTML = '';

      const loadingTask = getDocument(url);
      const pdf = await loadingTask.promise;
      setPageCount(pdf.numPages);

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        if (cancelled) return;
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });

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
    }
    renderPDF();
    return () => { cancelled = true; };
  }, [url, scale]);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Chapter-{title}</h2>

      {/* Zoom Controls */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <button onClick={() => setScale((s) => Math.max(0.5, s - 0.2))} style={{marginRight: 8}}>Zoom Out</button>
        <button onClick={() => setScale((s) => Math.min(4, s + 0.2))}>Zoom In</button>
        <span style={{ marginLeft: 16 }}>Zoom: {(scale * 100).toFixed(0)}%</span>
      </div>

      <div
        ref={containerRef}
        style={{
          textAlign: 'center',
          overflowX: 'auto',
          maxWidth: '100%',
        }}
      ></div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a
          href={`/api/download-chapter?board=${encodeURIComponent(board)}&grade=${encodeURIComponent(
            grade
          )}&subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(title)}`}
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
