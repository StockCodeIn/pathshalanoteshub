import Link from 'next/link'
import { subjects } from '@/config/subjects'
import styles from '@/styles/Home.module.css';

interface PageProps {
  params: Promise <{
    grade: string
    subject: string
  }>
}

export async function generateStaticParams() {
  const params = []
  for (const grade of Object.keys(subjects)) {
    for (const subject of subjects[grade]) {
      params.push({
        grade,
        subject: subject.id,
      })
    }
  }
  return params
}

export default async function CBSESubjectPage({ params }: PageProps) {
  const gradeValue = (await params).grade
  const subjectId = (await params).subject
  const gradeSubjects = subjects[gradeValue] || []
  const subject = gradeSubjects.find((s) => s.id === subjectId)

  if (!subject) {
    return (
      <main className="container">
        <h1>Subject Not Found</h1>
        <p>The requested subject could not be found.</p>
      </main>
    )
  }

  return (
    <main className="container">
      <h1 className={styles['h2class']}>CBSE {gradeValue}th {subject.name}</h1>
      <div className={styles['card-container-5']}>
        {subject.chapters.map((chapter, index) => (
          <Link 
            key={index} 
            href={`/cbse/${gradeValue}/${subjectId}/${index + 1}`} 
            className={styles["card-3"]}style={{ background: '#d0dce0', color: '#2e3c44' }}
          >
            <h2>Chapter {index + 1}</h2>
            <p>
              {chapter.split(' ').length > 5
              ? chapter.split(' ').slice(0, 5).join(' ') + '...'
              : chapter}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
