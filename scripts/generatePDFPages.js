#!/usr/bin/env node
/**
 * ✅ FREE PLAN SAFE – REAL PAGE COUNT + WATERMARK
 * Rules:
 * - One time generation only
 * - NO image/fetch
 * - NO dpr_auto
 * - Fixed transformations
 */

const mongoose = require("mongoose");
require("dotenv").config();
const fetch = require("node-fetch");

const CLOUD = "dykzofsgk";
const WATERMARK_ID = "watermark_g1sgt6";
const MAX_PROBE_PAGES = 300;

/* ---------------------------------- */
/* 1️⃣ CHECK PAGE EXISTS (LOW COST) */
/* ---------------------------------- */
async function pageExists(pdfUrl, page) {
  const match = pdfUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.pdf/i);
  if (!match) return false;

  const publicId = match[1];

  const testUrl =
    `https://res.cloudinary.com/${CLOUD}/image/upload/` +
    `pg_${page},w_10,q_10/` +
    `${publicId}.pdf`;

  try {
    const res = await fetch(testUrl, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

/* ---------------------------------- */
/* 2️⃣ DETECT REAL PAGE COUNT */
/* ---------------------------------- */
async function detectPagesByProbe(pdfUrl) {
  let low = 1;
  let high = 1;

  while (high <= MAX_PROBE_PAGES && await pageExists(pdfUrl, high)) {
    high *= 2;
  }

  if (high === 1) return 0;
  low = Math.floor(high / 2);

  while (low + 1 < high) {
    const mid = Math.floor((low + high) / 2);
    if (await pageExists(pdfUrl, mid)) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return low;
}

/* ---------------------------------- */
/* 3️⃣ BUILD FINAL IMAGE URL */
/* ---------------------------------- */
function pageUrl(pdfUrl, page) {
  const match = pdfUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.pdf/i);
  if (!match) throw new Error("Invalid Cloudinary PDF URL");

  const publicId = match[1];

  return (
    `https://res.cloudinary.com/${CLOUD}/image/upload/` +
    `l_${WATERMARK_ID},a_45,o_50,w_0.3,fl_relative,fl_layer_apply/` +
    `w_1200,q_auto:eco,f_auto,pg_${page}/` +
    `${publicId}.pdf`
  );
}

/* ---------------------------------- */
/* 4️⃣ MAIN */
/* ---------------------------------- */
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
    pdfUrl: { $exists: true, $ne: null },
  }).lean();

  console.log(`📄 Processing ${chapters.length} PDFs`);

  for (const ch of chapters) {
    // 🔒 CREDIT SAFETY: already generated = skip
    if (ch.pageImages && ch.pageImages.length > 0) {
      console.log(`⏭️ Skipping ${ch._id} (already generated)`);
      continue;
    }

    console.log(`🔍 Detecting pages for ${ch._id}...`);

    const totalPages = await detectPagesByProbe(ch.pdfUrl);
    if (!totalPages) {
      console.warn(`⚠️ Could not detect pages, skipping ${ch._id}`);
      continue;
    }

    const pageImages = [];
    for (let p = 1; p <= totalPages; p++) {
      pageImages.push(pageUrl(ch.pdfUrl, p));
    }

    await Chapter.updateOne(
      { _id: ch._id },
      {
        $set: {
          pageImages,
          totalPages,
          preGeneratedAt: new Date(),
        },
      }
    );

    console.log(`✅ ${ch._id} → ${totalPages} pages`);
  }

  console.log("🎉 DONE – FREE PLAN SAFE");
  process.exit(0);
}

run();
