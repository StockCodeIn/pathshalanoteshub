import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

const gradesData = [
  {
    href: "/rbse/10",
    icon: '10',
    title: 'Class 10th',
    description: 'Study materials for RBSE Class 10th students',
  },
  {
    href: "/rbse/11",
    icon: '11',
    title: 'Class 11th',
    description: 'Study materials for RBSE Class 11th students',
  },
  {
    href: "/rbse/12", 
    icon: '12',
    title: 'Class 12th',  
    description: 'Study materials for RBSE Class 12th students',
  },
];


export default function RBSEPage() {
  return (
    <main>
      <h1 className={styles['h2class']}>RBSE Study Materials</h1>
      <div className={styles['card-container']}>
        {gradesData.map((grade, index) => (
          <Link key={index} href={grade.href} className={styles["card"]} style={{ background: '#f1e8de', color: '#4a3f35' }}>
            <span className= {styles['sp-3']}>{grade.icon}</span>
            <h2>{grade.title}</h2>
            <p>{grade.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
