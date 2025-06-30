import connectDB from '@/lib/mongodb';
import PastPaper from '@/models/PastPaper';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default async function RBSESubjectsPage({ params }: { params: Promise<{ grade: string }> }) {
  const { grade } = await params;

  await connectDB();

  // ✅ MongoDB से सिर्फ उस grade के subjects निकालो
  const papers = await PastPaper.find({ board: 'RBSE', grade }).select('subject');

  // ✅ Duplicate हटाओ और Alphabetical order में sort करो
  const uniqueSubjects = Array.from(new Set(papers.map(p => p.subject))).sort();

  return (
    <main className="container">
      <h1 className={styles['h2class']}>RBSE {grade} - Select Subject</h1>
      <div className={styles['card-container-2']}>
        {uniqueSubjects.map((subject) => (
          <Link key={subject} href={`/rbse-papers/${grade}/${subject}`} className={styles["card-5"]}>
            <h2>{subject}</h2>
            <p>View previous years question papers.</p>
          </Link>
        ))}
      </div>
    </main>
  );
}

