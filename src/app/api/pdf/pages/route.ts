// src/app/api/pdf/pages/route.ts
import { NextRequest, NextResponse } from 'next/server';

/**
 * API to detect total pages in a PDF
 * Uses Cloudinary's PDF metadata OR tries to fetch PDF headers
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pdfUrl = searchParams.get('url');

    if (!pdfUrl) {
      return NextResponse.json(
        { error: 'PDF URL is required' },
        { status: 400 }
      );
    }

    const pages = await detectPDFPages(pdfUrl);
    
    // If we couldn't detect, return 0 and let component know
    console.log(`📄 API Response: ${pages} pages detected`);

    return NextResponse.json({
      success: pages > 0,
      totalPages: pages > 0 ? pages : 0,
      url: pdfUrl,
    });
  } catch (error) {
    console.error('Error detecting PDF pages:', error);
    
    return NextResponse.json({
      success: false,
      totalPages: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Detect total pages in PDF by fetching and parsing
 * Works with both Cloudinary URLs and external URLs
 */
async function detectPDFPages(pdfUrl: string): Promise<number> {
  try {
    // First attempt: Get first 100KB
    console.log(`🔍 First attempt: Fetching first 100KB of PDF...`);
    let response = await fetch(pdfUrl, {
      headers: {
        Range: 'bytes=0-100000',
      },
    });

    if (response.ok || response.status === 206) {
      const buffer = await response.arrayBuffer();
      const pages = extractPageCountFromPDF(buffer);
      if (pages > 0) {
        console.log(`✅ Success on first attempt: ${pages} pages`);
        return pages;
      }
    }

    // Second attempt: Try fetching more data (up to 500KB)
    console.log(`🔍 Second attempt: Fetching up to 500KB of PDF...`);
    response = await fetch(pdfUrl, {
      headers: {
        Range: 'bytes=0-500000',
      },
    });

    if (response.ok || response.status === 206) {
      const buffer = await response.arrayBuffer();
      const pages = extractPageCountFromPDF(buffer);
      if (pages > 0) {
        console.log(`✅ Success on second attempt: ${pages} pages`);
        return pages;
      }
    }

    // Third attempt: Full file (no Range header)
    console.log(`🔍 Third attempt: Fetching entire PDF...`);
    response = await fetch(pdfUrl);

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const pages = extractPageCountFromPDF(buffer);
      if (pages > 0) {
        console.log(`✅ Success on third attempt: ${pages} pages`);
        return pages;
      }
    }

    console.warn('⚠️ Could not detect pages after all attempts');
    return 0;
  } catch (error) {
    console.error('❌ Error in detectPDFPages:', error);
    return 0;
  }
}

/**
 * Extract page count from PDF binary data
 * Multiple strategies to find page count
 */
function extractPageCountFromPDF(buffer: ArrayBuffer): number {
  try {
    const view = new Uint8Array(buffer);
    let text = new TextDecoder().decode(view);
    
    console.log(`🔍 PDF Size: ${buffer.byteLength} bytes`);

    // First: Try to find the object definitions (they usually have << ... >>)
    // Look for lines like: "2 0 obj" followed by dictionary content
    
    // Strategy 1: Find /Type /Catalog (root object)
    const catalogMatch = text.match(/<<[^>]*?\/Type\s*\/Catalog[^>]*?\/Pages\s+(\d+)/);
    if (catalogMatch && catalogMatch[1]) {
      const pagesObjRef = catalogMatch[1];
      // Now find that object
      const pagesObjRegex = new RegExp(pagesObjRef + '\\s+0\\s+obj<<([^>]*?)>>');
      const pagesObjMatch = text.match(pagesObjRegex);
      if (pagesObjMatch) {
        const countMatch = pagesObjMatch[1].match(/\/Count\s*(\d+)/);
        if (countMatch && countMatch[1]) {
          const count = parseInt(countMatch[1], 10);
          if (count > 0) {
            console.log(`✅ Strategy 1: Found /Type /Catalog -> /Count = ${count}`);
            return count;
          }
        }
      }
    }

    // Strategy 2: Search for all object definitions with << >>
    // and look for one that has /Type /Pages and /Count
    const objectRegex = /(\d+)\s+0\s+obj<<([^>]*?)>>/g;
    let match;
    while ((match = objectRegex.exec(text)) !== null) {
      const objContent = match[2];
      if (objContent.includes('/Type') && objContent.includes('/Pages')) {
        const countMatch = objContent.match(/\/Count\s*(\d+)/);
        if (countMatch && countMatch[1]) {
          const count = parseInt(countMatch[1], 10);
          if (count > 0 && count < 50000) {
            console.log(`✅ Strategy 2: Found /Type /Pages with /Count = ${count}`);
            return count;
          }
        }
      }
    }

    // Strategy 3: Just find any /Count value that looks like page count
    const allCountsRegex = /\/Count\s+(\d+)/g;
    const counts: number[] = [];
    while ((match = allCountsRegex.exec(text)) !== null) {
      const count = parseInt(match[1], 10);
      if (count > 0 && count < 50000) {
        counts.push(count);
      }
    }
    if (counts.length > 0) {
      // Return the largest count (usually the root pages object)
      const maxCount = Math.max(...counts);
      console.log(`✅ Strategy 3: Found /Count values ${counts}, using max = ${maxCount}`);
      return maxCount;
    }

    // Strategy 4: Count /Type /Page entries (individual pages)
    const pageTypeRegex = /\/Type\s+\/Page\b/g;
    let pageCount = 0;
    while ((match = pageTypeRegex.exec(text)) !== null) {
      pageCount++;
    }
    if (pageCount > 0) {
      console.log(`✅ Strategy 4: Counted /Type /Page entries = ${pageCount}`);
      return pageCount;
    }

    // Strategy 5: Look at object definitions to count page objects
    const pageObjectRegex = /(\d+)\s+0\s+obj<<([^>]*?)\/Type\s+\/Page\b/g;
    let pageObjCount = 0;
    while ((match = pageObjectRegex.exec(text)) !== null) {
      pageObjCount++;
    }
    if (pageObjCount > 0) {
      console.log(`✅ Strategy 5: Counted page objects = ${pageObjCount}`);
      return pageObjCount;
    }

    console.warn('⚠️ Could not extract page count - no strategies matched');
    return 0;
  } catch (error) {
    console.error('❌ Error parsing PDF:', error);
    return 0;
  }
}
