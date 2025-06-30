'use client';

import dynamic from 'next/dynamic';

// ✅ Dynamically import the actual PDFViewer component (with SSR disabled)
const PDFViewer = dynamic(() => import('./PDFViewer'), { ssr: false });

interface PDFViewerProps {
  url: string;
  title: string;
  board: string;
  grade: string;
  subject: string;
}

export default function PDFViewerWrapper(props: PDFViewerProps) {
  return <PDFViewer {...props} />;
}
