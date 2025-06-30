import mongoose from 'mongoose';

const GKSchema = new mongoose.Schema({
  topic: String,
  subtopic: String,
  title: String,
  pdfUrl: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.GK || mongoose.model('GK', GKSchema);
