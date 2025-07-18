import mongoose from 'mongoose'

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  board: {
    type: String,
    enum: ['CBSE', 'RBSE'],
    required: true,
  },
  grade: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: false, // <-- Change here
    default: 0,      // <-- Default value for url-only case
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
})

export const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema)
