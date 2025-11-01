'use client';

import { useEffect, useRef, useState } from 'react';
import { pdfjsLib } from '@/lib/pdfjs';

export interface PDFViewerProps {
  url: string;
  title: string;
  board?: string;
  grade?: string;
  subject?: string;
  topic?: string;
  subtopic?: string;
  showDownloadButton?: boolean;
}

export default function PDFViewer({
  url,
  title,
  board,
  grade,
  subject,
  topic,
  subtopic,
  showDownloadButton = true,
}: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pdf, setPdf] = useState<any>(null);

  // ✅ Load PDF only once
  useEffect(() => {
    let cancelled = false;
    async function loadPDF() {
      if (!url) return;

      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdfDoc = await loadingTask.promise;
        if (cancelled) return;
        setPdf(pdfDoc);
        setPageCount(pdfDoc.numPages);
      } catch (err) {
        console.error('PDF loading error:', err);
      }
    }
    loadPDF();
    return () => {
      cancelled = true;
    };
  }, [url]);

  // ✅ Smart Lazy Rendering for each page
  useEffect(() => {
    if (!pdf || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            const pageNumber = parseInt(entry.target.getAttribute('data-page')!);
            const alreadyRendered = entry.target.getAttribute('data-rendered');
            if (alreadyRendered === 'true') return;

            const page = await pdf.getPage(pageNumber);

            const parentWidth =
              (entry.target as HTMLElement).offsetWidth || window.innerWidth;
            const viewport = page.getViewport({ scale: 1 });
            const scale = parentWidth / viewport.width;

            const scaledViewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            const dpr = window.devicePixelRatio || 1;

            canvas.width = scaledViewport.width * dpr;
            canvas.height = scaledViewport.height * dpr;
            canvas.style.width = '100%';
            canvas.style.height = `${scaledViewport.height}px`;

            const transform = dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined;
            await page.render({
              canvasContext: context,
              viewport: scaledViewport,
              transform,
            }).promise;

            // ✅ Optional watermark
            context.save();
            context.font = 'bold 36px Arial';
            context.globalAlpha = 0.1;
            context.fillStyle = 'gray';
            context.rotate(-0.3);
            context.fillText('© pathshalanoteshub.in', canvas.width / 6, canvas.height / 1.5);
            context.restore();

            entry.target.appendChild(canvas);
            entry.target.setAttribute('data-rendered', 'true');
          }
        });
      },
      { rootMargin: '250px 0px' }
    );

    // Create lazy divs
    for (let i = 1; i <= pageCount; i++) {
      const pageDiv = document.createElement('div');
      pageDiv.dataset.page = i.toString();
      pageDiv.style.minHeight = window.innerWidth < 600 ? '600px' : '850px';
      pageDiv.style.marginBottom = '12px';
      container.appendChild(pageDiv);
      observerRef.current.observe(pageDiv);
    }

    return () => observerRef.current?.disconnect();
  }, [pdf, pageCount]);

  // ✅ Dynamic download URL
  let downloadUrl = '';
  if (topic && subtopic) {
    downloadUrl = `/api/download?topic=${encodeURIComponent(topic)}&subtopic=${encodeURIComponent(subtopic)}`;
  } else if (board && grade && subject && title) {
    downloadUrl = `/api/download?board=${encodeURIComponent(board)}&grade=${encodeURIComponent(
      grade
    )}&subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(title)}`;
  }

  return (
    <div style={{ padding: '10px', overflowX: 'hidden' }}>
      <div
        ref={containerRef}
        style={{
          textAlign: 'center',
          width: '100vw',
          maxWidth: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      ></div>

      {showDownloadButton && downloadUrl && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <a
            href={downloadUrl}
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
      )}
    </div>
  );
}
