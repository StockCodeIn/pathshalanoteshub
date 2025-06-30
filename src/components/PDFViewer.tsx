'use client';

import { useEffect, useRef } from 'react';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf'; // ✅ legacy path
import '@/lib/pdfjs'; // ✅ global worker config

interface PDFViewerProps {
  url: string;
  title: string;
  board: string;
  grade: string;
  subject: string;
}

export default function PDFViewerClient({ url, title, board, grade, subject }: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (renderedRef.current) return;
    renderedRef.current = true;

    async function renderPDF() {
      if (!url || !containerRef.current) return;

      const container = containerRef.current;
      container.innerHTML = '';

      const loadingTask = getDocument(url);
      const pdf = await loadingTask.promise;

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
    }

    renderPDF();
  }, [url]);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Chapter-{title}</h2>

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
