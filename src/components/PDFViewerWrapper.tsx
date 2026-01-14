'use client';

import dynamic from 'next/dynamic';
import type { PDFViewerProps } from './PDFViewer';

const PDFViewer = dynamic<PDFViewerProps>(
  () => import('./PDFViewer').then((mod) => mod.default),
  { ssr: false }
);

export default function PDFViewerWrapper(props: PDFViewerProps) {
  // Hum sirf url aur title pass karenge, baki props filter ho jayenge
  return <PDFViewer url={props.url} title={props.title} />;
}