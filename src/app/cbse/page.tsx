import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';


const gradesData = [
  {
    href: "/cbse/10",
    icon: '10',
    title: 'Class 10th',
    description: 'Study materials for CBSE Class 10th students',
  },
  {
    href: "/cbse/11",
    icon: '11',
    title: 'Class 11th',
    description: 'Study materials for CBSE Class 11th students',
  },
  {
    href: "/cbse/12",
    icon: '12',
    title: 'Class 12th',  
    description: 'Study materials for CBSE Class 12th students',
  },
];


export default function CBSEPage() {
  return (
    <main>
      <h1 className={styles['h2class']}>CBSE Study Materials</h1>
      <div className={styles['card-container']}>
        {gradesData.map((grade, index) => (
          <Link key={index} href={grade.href} className={styles["card"]}style={{ background: '#d0dce0', color: '#2e3c44' }}>
            <span className= {styles['sp-2']}>{grade.icon}</span>
            <h2>{grade.title}</h2>
            <p>{grade.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
