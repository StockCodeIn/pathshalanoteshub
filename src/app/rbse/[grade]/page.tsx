import Link from 'next/link'
import { subjects } from '@/config/subjects'
import styles from '@/styles/Home.module.css';

interface PageProps {
  params: Promise <{
    grade: string
  }>
}

// Generate static parameters for each grade
export function generateStaticParams() {
  return Object.keys(subjects).map((grade) => ({
    grade,
  }))
}

export default async function RBSESubjectsPage({ params }: PageProps) {
  const gradeValue = (await params).grade
  const gradeSubjects = subjects[gradeValue] || []

  return (
    <main className="container">
      <h1 className={styles['h2class']}>RBSE {gradeValue}th - Subjects</h1>
      <div className={styles['card-container-4']}>
        {gradeSubjects.map((subject) => (
          <Link 
            key={subject.id} 
            href={`/rbse/${gradeValue}/${subject.id}`} 
            className={styles["card-2"]} style={{ background: '#f1e8de', color: '#4a3f35' }}
          >
            <h2>{subject.name}</h2>
            <p>Click to view chapters</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
