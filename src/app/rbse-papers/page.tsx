import Link from 'next/link';
import styles from '@/styles/Home.module.css';

const rbseClasses = ['10th', '12th'];

export default function RBSEPastPapersPage() {
  return (
    <main className="container">
      <h1 className={styles['h2class']}>RBSE Previous Years Papers</h1>

      <div className={styles['card-container']}>
        {rbseClasses.map((grade) => (
          <Link key={grade} href={`/rbse-papers/${grade}`} className={styles["card-4"]}>
            <h2>Class {grade}</h2>
            <p>View previous years question papers.</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
