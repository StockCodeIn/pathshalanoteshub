import Link from 'next/link';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import { assets } from '@/assets/assets';

// Data for the cards - boards information
const boardsData = [
  {
    href: '/rbse',
    color: '#dbcfb7',
    img: assets.rbse,
    title: 'RBSE Notes',
    description: 'Rajasthan Board of Secondary Education',
  },
  {
    href: '/cbse',
    color: '#7297a9',
    img: assets.cbse,
    title: 'CBSE Notes',
    description: 'Central Board of Secondary Education',
  },
  {
    href: '/rbse-papers',
    color: 'linear-gradient(to bottom, #dbcfb7, #7297a9)',
    img: assets.pastPapers,
    title: 'RBSE Old Papers',
    description: 'Get previous years exam papers',
  },
];

// Data for subjects links
const subjectsData = [
  {
    href: '/rbse/10/mathematics',
    background: '#f1e8de',
    color: '#4a3f35',
    title: 'Mathematics Notes',
    description: 'Rbse 10th Mathematics Notes',
  },
  {
    href: '/cbse/10/mathematics',
    background: '#d0dce0',
    color: '#2e3c44',
    title: 'Mathematics Notes',
    description: 'Cbse 10th Mathematics Notes',
  },
  {
    href: '/rbse/10/science',
    background: '#f1e8de',
    color: '#4a3f35',
    title: 'Science Notes',
    description: 'Rbse 10th Science Notes',
  },
  {
    href: '/cbse/10/science',
    background: '#d0dce0',
    color: '#2e3c44',
    title: 'Science Notes',
    description: 'Cbse 10th Science Notes',
  },
  {
    href: '/rbse/12/mathematics',
    background: '#f1e8de',
    color: '#4a3f35',
    title: 'Mathematics Notes',
    description: 'Rbse 12th Mathematics Notes',
  },
  {
    href: '/cbse/12/mathematics',
    background: '#d0dce0',
    color: '#2e3c44',
    title: 'Mathematics Notes',
    description: 'Cbse 12th Mathematics Notes',
  },
  
  {
    href: '/rbse/12/physics',
    background: '#f1e8de',
    color: '#4a3f35',
    title: 'Physics Notes',
    description: 'Rbse 12th Physics Notes',
  },
  {
    href: '/cbse/12/physics',
    background: '#d0dce0',
    color: '#2e3c44',
    title: 'Physics Notes',
    description: 'Cbse 12th Physics Notes',
  },
  {
    href: '/rbse/12/chemistry',
    background: '#f1e8de',
    color: '#4a3f35',
    title: 'Chemistry Notes',
    description: 'Rbse 12th Chemistry Notes',
  },
  {
    href: '/cbse/12/chemistry',
    background: '#d0dce0',
    color: '#2e3c44',
    title: 'Chemistry Notes',
    description: 'Cbse 12th Chemistry Notes',
  },
];

// Data for study resources
const studyResources = [
  {
    href: '/study-plan',
    color: '#a8c6d9',
    img: assets.study,
    title: 'Study Plan',
  },
  {
    href: '/time-management',
    color: '#c7b398',
    img: assets.time,
    title: 'Time Manage',
  },
  {
    href: '/gk',
    color: '#8ea3d9',
    img: assets.gk,
    title: 'Indian GK',
  },
];

export default function Home() {
  return (
    <main>
      <div className={styles['intro-section']}>
        <p>यहाँ आपको Indian G.K and RBSE, CBSE बोर्ड के 10th और 12th कक्षा के Important विषयों के Free Notes और Previous Year Papers मिलेंगे।</p>
      </div>
      <h2 className={styles['h2class']}>Rbse & Cbse Notes</h2>
      <div className={styles['card-container']}>
        {boardsData.map((board, index) => (
          <Link key={index} href={board.href} className={styles["card"]} style={{ background: board.color }}>
            <Image src={board.img} alt="img" width={80} height={80} />
            <h2>{board.title}</h2>
            <p>{board.description}</p>
          </Link>
        ))}
      </div>

      {/* Study Resources Section */}
      <h2 className={styles['h2class']}>Study Resources</h2>
      <div className={styles['card-container']}>
        {studyResources.map((resource, index) => (
          <Link key={index} href={resource.href} className={styles["card"]} style={{ background: resource.color }}>
            <span className={styles['sp-1']}> <Image src={resource.img} alt="img" width={80} height={80} /> </span>
            <h2 style={{fontSize: '12px'}} >{resource.title}</h2>
          </Link>
        ))}
      </div>

      {/* Subjects Section */}
      <h2 className={styles['h2class']}>Important Subjects</h2>
      <div className={styles['card-container-2']}>
        {subjectsData.map((subject, index) => (
          <Link key={index} href={subject.href} className={styles["card-2"]} style={{ background: subject.background }}>
            <h2>{subject.title}</h2>
            <p>{subject.description}</p>
          </Link>
        ))}
      </div>

      
    </main>
  );
}