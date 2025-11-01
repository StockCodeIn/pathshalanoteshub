// src/lib/pdfjs.ts
import * as pdfjsLib from 'pdfjs-dist';

// browser में ही worker set करें
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    const workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  }
  catch (e) {
    console.error('Failed to set PDF.js worker source:', e);
  }
}

export { pdfjsLib };

