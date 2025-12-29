const mongoose = require('mongoose');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.pathshalanoteshub.in',
  generateRobotsTxt: true,
  sitemapSize: 5000,

  additionalPaths: async () => {
    const paths = [];

    /* ---------- MongoDB Connect ---------- */
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const db = mongoose.connection.db;

    /* ================= GK ================= */
    const gkItems = await db
      .collection('gks')
      .find(
        {
          topic: { $exists: true },
          subtopic: { $exists: true },
          name: { $exists: true },
        },
        { projection: { topic: 1, subtopic: 1, name: 1 } }
      )
      .toArray();

    gkItems.forEach((item) => {
      if (!item.topic || !item.subtopic || !item.name) return;

      paths.push({
        loc: `/gk/${encodeURIComponent(item.topic)}/${encodeURIComponent(
          item.subtopic
        )}/${encodeURIComponent(item.name)}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
    });

    /* ================= RBSE ================= */
    const rbseItems = await db
      .collection('chapters')
      .find(
        { board: { $regex: /^RBSE$/i } },
        { projection: { grade: 1, subject: 1, name: 1, updatedAt: 1 } }
      )
      .toArray();

    rbseItems.forEach((item) => {
      if (!item.grade || !item.subject || !item.name) return;

      paths.push({
        loc: `/rbse/${item.grade}/${encodeURIComponent(
          item.subject
        )}/${encodeURIComponent(item.name)}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: item.updatedAt
          ? new Date(item.updatedAt).toISOString()
          : new Date().toISOString(),
      });
    });

    /* ================= CBSE ================= */
    const cbseItems = await db
      .collection('chapters')
      .find(
        { board: { $regex: /^CBSE$/i } },
        { projection: { grade: 1, subject: 1, name: 1, updatedAt: 1 } }
      )
      .toArray();

    cbseItems.forEach((item) => {
      if (!item.grade || !item.subject || !item.name) return;

      paths.push({
        loc: `/cbse/${item.grade}/${encodeURIComponent(
          item.subject
        )}/${encodeURIComponent(item.name)}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: item.updatedAt
          ? new Date(item.updatedAt).toISOString()
          : new Date().toISOString(),
      });
    });

    /* ================= RBSE PAPERS ================= */
    const rbsePapersItems = await db
      .collection('pastpapers')
      .find(
        {
          grade: { $exists: true },
          subject: { $exists: true },
          year: { $exists: true },
        },
        { projection: { grade: 1, subject: 1, year: 1 } }
      )
      .toArray();

    rbsePapersItems.forEach((item) => {
      if (!item.grade || !item.subject || !item.year) return;

      paths.push({
        loc: `/rbse-papers/${item.grade}/${encodeURIComponent(
          item.subject
        )}/${item.year}`,
        changefreq: 'yearly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      });
    });

    return paths;
  },
};
