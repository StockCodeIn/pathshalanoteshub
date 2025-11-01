// Extraction service disabled — placeholder to avoid errors if imported elsewhere.
export async function processDocument() {
  throw new Error('PDF extraction service is disabled in this deployment');
}

export async function scanAndProcess() {
  throw new Error('PDF extraction service is disabled in this deployment');
}

const pdfExtractionService = { processDocument, scanAndProcess };
export default pdfExtractionService;
