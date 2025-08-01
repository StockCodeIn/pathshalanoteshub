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

        const containerWidth = container.offsetWidth || window.innerWidth;
        const unscaledViewport = page.getViewport({ scale: 1 });
        let fitScale = containerWidth / unscaledViewport.width;

        // ⬅ Mobile devices ke liye zoom manually badhao
        if (window.innerWidth < 600) {
          fitScale *= 2; // Or 1.8 depending on how zoomed you want
        }

        const viewport = page.getViewport({ scale: fitScale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        const dpr = window.devicePixelRatio || 1;

        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        // Sharp rendering on mobile by scaling context
        const transform = dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined;

        canvas.style.maxWidth = '100%';
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';

        await page.render({ canvasContext: context, viewport, transform }).promise;

        container.appendChild(canvas);
        container.appendChild(document.createElement('br'));
      }
    }

    renderPDF();
    return () => { cancelled = true; };
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
