import mongoose from 'mongoose';
import { sanitizeHtml, stripHtml, calculateReadingTime } from '@/lib/html';

const sourceLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    contentHtml: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      default: '',
      trim: true,
    },
    ogImage: {
      type: String,
      default: '',
      trim: true,
    },
    authorName: {
      type: String,
      trim: true,
      default: 'Pathshala Notes Hub',
    },
    tags: {
      type: [String],
      default: [],
    },
    publishedAt: {
      type: Date,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    seoTitle: {
      type: String,
      default: '',
      trim: true,
    },
    seoDescription: {
      type: String,
      default: '',
      trim: true,
    },
    canonicalUrl: {
      type: String,
      default: '',
      trim: true,
    },
    sourceLinks: {
      type: [sourceLinkSchema],
      default: [],
    },
    faq: {
     type: [faqSchema],
     default: [],
    },
    relatedPosts: {
     type: [String],
     default: [],
    },
    contentType: {
      type: String,
      enum: ['vacancy', 'result', 'admit-card', 'answer-key', 'exam-date', 'article', 'update'],
      default: 'article',
      index: true,
    },
    readingTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ isPublished: 1, isFeatured: 1, publishedAt: -1 });
blogSchema.index({ contentType: 1, isPublished: 1, publishedAt: -1 });

blogSchema.pre('save', function (next) {
  if (this.contentHtml) {
    this.contentHtml = sanitizeHtml(this.contentHtml);
  }

  if (!this.excerpt || !this.excerpt.trim()) {
    this.excerpt = stripHtml(this.contentHtml).slice(0, 180);
  }

  this.readingTime = calculateReadingTime(this.contentHtml);

  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  if (!this.authorName || !this.authorName.trim()) {
    this.authorName = 'Pathshala Notes Hub';
  }

  next();
});

export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);