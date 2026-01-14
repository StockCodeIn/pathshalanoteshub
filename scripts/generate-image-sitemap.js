#!/usr/bin/env node
/**
 * ✅ Google Image Sitemap Generator
 * - Reads pageImages from DB
 * - Generates sitemap-images.xml
 * - ZERO Cloudinary cost
 */

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const SITE = "https://www.pathshalanoteshub.in";

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI missing");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("✅ MongoDB connected");

  const Chapter = mongoose.model(
    "Chapter",
    new mongoose.Schema({}, { strict: false }),
    "chapters"
  );

  const chapters = await Chapter.find({
    pageImages: { $exists: true, $ne: [] },
  }).lean();

  console.log(`📄 Found ${chapters.length} chapters with images`);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  for (const ch of chapters) {
    const pageUrl = `${SITE}/cbse/${ch.grade}/${ch.subject}/${ch.name}`;

    for (let i = 0; i < ch.pageImages.length; i++) {
      const img = ch.pageImages[i];

      xml += `  <url>\n`;
      xml += `    <loc>${pageUrl}</loc>\n`;
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${img}</image:loc>\n`;
      xml += `      <image:caption>CBSE Class ${ch.grade} ${ch.subject} Chapter ${ch.name} Page ${i + 1}</image:caption>\n`;
      xml += `    </image:image>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  const outPath = path.join(process.cwd(), "public", "sitemap-images.xml");
  fs.writeFileSync(outPath, xml, "utf8");

  console.log("🎉 sitemap-images.xml generated");
  process.exit(0);
}

run();
