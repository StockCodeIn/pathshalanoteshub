// src/app/server-sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';
import GK from '@/models/gk';
import PastPaper from '@/models/PastPaper';

const DB_TIMEOUT_MS = 4000; // short DB timeout to avoid slow builds

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    p.then((r) => r as T),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

function buildXml(urls: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (url) => `  <url>\n    <loc>https://pathshalanoteshub.in${url}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>`;
}

export async function GET() {
  try {
    await connectDB();

    // Try fetching small projections with timeout
    const chapters = (await withTimeout(Chapter.find({}, { board: 1, grade: 1, subject: 1, name: 1 }).lean(), DB_TIMEOUT_MS)) || [];
    const gk = (await withTimeout(GK.find({}, { topic: 1, subtopic: 1, name: 1 }).lean(), DB_TIMEOUT_MS)) || [];
    const pastPapers = (await withTimeout(PastPaper.find({}, { board: 1, grade: 1, subject: 1, year: 1 }).lean(), DB_TIMEOUT_MS)) || [];

    // If all queries timed out, return a small fallback sitemap
    const anyData = (chapters && chapters.length) || (gk && gk.length) || (pastPapers && pastPapers.length);
    if (!anyData) {
      const fallback = [
        '/',
        '/cbse',
        '/rbse',
        '/gk',
        '/rbse-papers',
        '/study-plan',
      ];
      return new NextResponse(buildXml(fallback), { headers: { 'Content-Type': 'application/xml' } });
    }

    const urls: string[] = [];

    // RBSE + CBSE chapters
    for (const ch of chapters) {
      const board = (ch.board || '').toLowerCase();
      const grade = ch.grade || '1';
      const subject = ch.subject || 'general';
      const id = ch.name || '';
      urls.push(`/${board}/${grade}/${subject}/${id}`);
    }

    // GK topics
    for (const t of gk) {
      const topic = t.topic || 'general';
      const subtopic = t.subtopic || 'overview';
      urls.push(`/gk/${topic}/${subtopic}`);
    }

    // RBSE/CBSE Past Papers
    for (const p of pastPapers) {
      const board = (p.board || '').toLowerCase();
      urls.push(`/${board}-papers/${p.grade}/${p.subject}/${p.year}`);
    }

    const xml = buildXml(urls);
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
  } catch (err) {
    // On any error, return a minimal sitemap so builds don't fail
    const fallback = ['/', '/cbse', '/rbse', '/gk', '/rbse-papers', '/study-plan'];
    return new NextResponse(buildXml(fallback), { headers: { 'Content-Type': 'application/xml' } });
  }
}
