import connectDB from '@/lib/mongodb';
import PastPaper from '@/models/PastPaper';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

interface PageProps {
  params: Promise<{ grade: string; subject: string }>;
}

export default async function RBSEPastPapersPage({ params }: PageProps) {
  const { grade, subject } = await params;

  await connectDB();

  // ✅ MongoDB से सिर्फ उपलब्ध years निकालना
  const papers = await PastPaper.find({
    board: 'RBSE',
    grade,
    subject,
  }).select('year');

  // ✅ Duplicate हटाकर sorted unique years
  const uniqueYears = Array.from(new Set(papers.map(p => p.year))).sort((a, b) => b - a); // Descending order

  return (
    <main className="container">
      <h1 className={styles['h2class']}>RBSE {grade} - {subject} Old Papers</h1>
      <ul className={styles['card-container-3']}>
        {uniqueYears.map((year) => (
          <li key={year}>
            <Link href={`/rbse-papers/${grade}/${subject}/${year}`} className={styles["card-6"]}>
              {year} Question Paper
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

