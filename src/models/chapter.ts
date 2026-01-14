import mongoose from 'mongoose';

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
    required: false, 
    default: 0,      
  },
  totalPages: {
    type: Number,
    required: false,
    default: 10, // Default fallback
  },
  watermarkedPdfUrl: {
    type: String,
    required: false,
    default: null,
  },
  pageImages: {
    type: [String],
    required: false,
    default: [],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ 1. Compound Index: Isse fetch speed 10x-20x fast ho jayegi
// 1 ka matlab hai Ascending order.
chapterSchema.index({ board: 1, grade: 1, subject: 1, name: 1 });

export const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);


