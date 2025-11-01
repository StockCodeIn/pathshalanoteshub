
// components/PDFViewerWrapper.tsx
'use client';

import dynamic from 'next/dynamic';
import type { PDFViewerProps } from './PDFViewer';

// ✅ TypeScript-safe dynamic import
const PDFViewer = dynamic<PDFViewerProps>(
  () => import('./PDFViewer').then((mod) => mod.default),
  { ssr: false }
);

export default function PDFViewerWrapper(props: PDFViewerProps) {
  return <PDFViewer {...props} />;
}

