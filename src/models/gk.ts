// src/models/gk.ts
import mongoose from 'mongoose';

// New schema: store sub-subtopic level content only
const GKSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  subtopic: { type: String, required: true },
  name: { type: String, required: true }, // sub-subtopic name / slug
  displayName: { type: String, default: "" },
  htmlContent: { type: String, default: '' },
  order: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

GKSchema.index({ topic: 1, subtopic: 1, name: 1 }, { unique: true });

export default mongoose.models.GK || mongoose.model('GK', GKSchema);
