// src/app/server-sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';
import GK from '@/models/gk';
import PastPaper from '@/models/PastPaper';

export async function GET() {
  await connectDB(); // ✅ MongoDB से connect

  // DB से data निकालो
  const chapters = await Chapter.find({});
  const gk = await GK.find({});
  const pastPapers = await PastPaper.find({});

  // URLs बनाओ
  const urls = [
    // RBSE + CBSE chapters
    ...chapters.map((ch) => {
      const board = ch.board.toLowerCase(); // "rbse" या "cbse"
      return `/${board}/${ch.grade}/${ch.subject}/${ch._id}`;
    }),

    // GK topics
    ...gk.map((t) => `/gk/${t.topic}/${t.subtopic}`),

    // RBSE/CBSE Past Papers
    ...pastPapers.map(
      (p) => `/${p.board.toLowerCase()}-papers/${p.grade}/${p.subject}/${p.year}`
    ),
  ];

  // XML generate
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
      <url>
        <loc>https://pathshalanoteshub.in${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>`
      )
      .join('')}
  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
