import mongoose from 'mongoose';

const PastPaperSchema = new mongoose.Schema({
  board: { type: String, required: true }, // RBSE, CBSE, etc.
  grade: { type: String, required: true }, // 10th, 12th, etc.
  subject: { type: String, required: true }, // Physics, Chemistry, etc.
  year: { type: String, required: true }, // Year of the paper
  pdfUrl: { type: String, required: true }, // Cloudinary URL
});

const PastPaper = mongoose.models.PastPaper || mongoose.model('PastPaper', PastPaperSchema);
export default PastPaper;
