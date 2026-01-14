#!/usr/bin/env node

/*
  Batch processor:
  - Connects to MongoDB and finds chapters with `pdfUrl` and missing `pageImages`
  - Downloads PDFs to tmp and runs `node scripts/pdf_to_images.js` for each (dry-run by default)
  - Use --commit to update DB via the child script's --commit flag

  Usage:
    node scripts/batch_process.js --limit 10 --commit

  Notes:
   - Requires `node` and `curl` or native fetch for downloads
   - Ensure `MONGODB_URI` is set if using --commit or to query DB
*/

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('limit', { type: 'number', default: 20 })
  .option('commit', { type: 'boolean', default: false })
  .argv;

const { limit, commit } = argv;

async function run() {
  const mongoose = require('mongoose');
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not set in environment; required to query chapters');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { autoIndex: false });
  const Chapter = mongoose.model('Chapter', new mongoose.Schema({}, { strict: false }), 'chapters');

  console.log('Querying chapters without pageImages...');
  const query = { pdfUrl: { $exists: true, $ne: null }, $or: [{ pageImages: { $exists: false } }, { pageImages: { $size: 0 } }] };
  const chapters = await Chapter.find(query).limit(limit).lean().exec();

  if (!chapters || chapters.length === 0) {
    console.log('No chapters found matching criteria');
    process.exit(0);
  }

  console.log(`Found ${chapters.length} chapters to process (limit ${limit})`);

  for (const ch of chapters) {
    const id = ch._id.toString();
    const pdfUrl = ch.pdfUrl;
    console.log(`Processing chapter ${id} - ${pdfUrl}`);

    try {
      // call pdf_to_images.js directly with URL
      const args = ['scripts/pdf_to_images.js', '--pdf', pdfUrl, '--chapterId', id, '--pages', '50'];
      if (commit) args.push('--commit');

      console.log('Running conversion script:', args.join(' '));
      const child = spawnSync('node', args, { stdio: 'inherit' });
      if (child.error) {
        console.error('Conversion child failed', child.error);
      }

    } catch (e) {
      console.error('Error processing chapter', id, e);
    }
  }

  console.log('Batch processing complete');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
