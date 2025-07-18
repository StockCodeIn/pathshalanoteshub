import Link from 'next/link'
import { subjects } from '@/config/subjects'
import styles from '@/styles/Home.module.css';

interface PageProps {
  params: Promise<{
    grade: string
  }>
}

// Generate static parameters for each grade
export function generateStaticParams() {
  return Object.keys(subjects).map((grade) => ({
    grade,
  }))
}

export default async function CBSEGradeSubjectsPage({ params }: PageProps) {
  const resolvedParams = await params // `params` को `await` किया गया
  const gradeValue = resolvedParams.grade
  const gradeSubjects = subjects[gradeValue] || []

  return (
    <main>
      <h1 className={styles['h2class']}>CBSE {gradeValue}th - Subjects</h1>
      <div className={styles['card-container-4']}>
        {gradeSubjects.map((subject) => (
          
          <Link key={subject.id} href={`/cbse/${gradeValue}/${subject.id}`} className={styles["card-2"]} style={{ background: '#d0dce0', color: '#2e3c44' }}>
            <h2>{subject.name}</h2>
            <p>Click to view chapters</p>
          </Link>
        ))}
      </div>
    </main>
  )
}