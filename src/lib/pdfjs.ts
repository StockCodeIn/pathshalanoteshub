// src/lib/pdfjs.ts
import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';

GlobalWorkerOptions.workerSrc = '/pdf.worker.js';
