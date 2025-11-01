# PDF Extraction & Hybrid Rendering (Pathshala Notes Hub)

This documents the new PDF extraction and hybrid rendering pipeline.

## Goals
- Extract searchable text and basic sanitized HTML from PDFs stored on Cloudinary.
- Store extracted content on MongoDB documents (Chapter/GK/PastPaper).
- Render extracted HTML server-side when available (SEO-friendly), otherwise fall back to the PDF viewer.
- Provide an admin batch scanner to process pending docs and an optional OCR fallback.

## New model fields
All models that hold `pdfUrl` now include these optional fields:
- `extractedHtml` (String)
- `extractedText` (String)
- `ocrStatus` (String) - one of `pending`, `processing`, `done`, `failed`
- `convertedAt` (Date)

## API Endpoints
### 1) POST /api/pdf/extract
Trigger extraction for a single document.
Body: { modelName: string, id: string, pdfUrl?: string }
- `modelName`: one of `Chapter`, `GK`, `PastPaper`.
- `id`: MongoDB _id of the document.
- `pdfUrl` (optional): override source URL.

Returns `{ success: true, id }` or `{ error }`.

### 2) POST /api/pdf/scan
Admin endpoint to scan pending documents and process them in batch.
Body (all optional): { models?: string[], batchSize?: number, concurrency?: number }
- `models`: array of model names to scan (default: all models)
- `batchSize`: number of docs to consider (default: 20)
- `concurrency`: number of parallel workers (default: 3)

Response: `{ queued, processed, results }`.

## OCR fallback
If `OCR_SPACE_API_KEY` is present in environment variables and the initial text extraction yields too little text, the system will call OCR.space to attempt OCR on the PDF.

Environment variables:
- `MONGODB_URI` (already required)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (already used)
- `OCR_SPACE_API_KEY` (optional) — API key for https://ocr.space/ (free tier available)

## How uploads trigger extraction
The existing upload endpoints (`/api/chapters`, `/api/gk`, `/api/past-papers`) now fire a background POST to `/api/pdf/extract` after saving the DB record. No re-upload required.

## Troubleshooting & notes
- For scanned PDFs (images), `pdf-parse` won't extract text. Use OCR (OCR.space) or a proper OCR pipeline.
- For very high-fidelity HTML that preserves layout, consider `pdf2htmlEX` running in a separate Linux worker/container — not suitable for Vercel serverless environments.
- If you run builds locally on Windows and encounter `.next` write permission errors, clear `.next` and retry the build with proper permissions.

## Next steps (optional)
- Add Redis-based queue for robust background processing.
- Integrate Tesseract for on-prem OCR if you prefer no external OCR dependency.
- Add a web admin UI to re-run extraction for individual items.

---

If you'd like, I can add a small admin page to trigger scans from the site or wire this to a cron/job on your server.
