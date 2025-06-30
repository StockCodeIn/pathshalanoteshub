import connectDB from '@/lib/mongodb';
import PastPaper from '@/models/PastPaper';
import styles from '@/styles/Home.module.css';

interface PageProps {
  params: Promise<{
    grade: string;
    subject: string;
    year: string;
  }>;
}

// ✅ Static Params Generate करने का Function
export async function generateStaticParams() {
  await connectDB();

  const papers = await PastPaper.find({ board: 'RBSE' });

  const paramsArray = papers.map((paper) => ({
    grade: paper.grade,
    subject: paper.subject,
    year: paper.year.toString(),
  }));

  return paramsArray;
}

// ✅ RBSE पेज का मुख्य कोड
export default async function RBSEPaperViewerPage({ params }: PageProps) {
  const { grade, subject, year } = await params;

  await connectDB();

  const paper = await PastPaper.findOne({
    board: 'RBSE',
    grade: grade,
    subject: subject,
    year: parseInt(year, 10),
  });

  if (!paper) {
    return (
      <main className="container">
        <h1>❌ Paper Not Found</h1>
        <p>No question paper available for the selected year.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className={styles['h2class']}>RBSE {grade} - {subject} - {year} Question Paper</h1>
      <p style={{
        padding: '10px 20px',
      }} >RBSE Previous Year Question Papers PDF – Class 10 & 12 (All Subjects)
        Get access to RBSE (Rajasthan Board) Class 10th and 12th Previous Year Question Papers in PDF format for all major subjects. These papers are collected from the official RBSE website to help students understand the exam pattern, marking scheme, and important questions.
        <br />
        Download RBSE question papers for free and start practicing to score better in board exams. All papers are authentic and ideal for 2025–26 exam preparation.
        <br />
        📌 Note: All PDF papers are sourced from the official RBSE site rajeduboard.rajasthan.gov.in</p>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <a
          href={paper.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '5px',
            textDecoration: 'none',
          }}
        >
          View Question Paper
        </a>
      </div>
    </main>
  );
}
