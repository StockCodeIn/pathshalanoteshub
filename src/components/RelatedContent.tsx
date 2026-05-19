// src/components/RelatedContent.tsx
import Link from 'next/link';
import styles from '../styles/RelatedContent.module.css';

interface RelatedItem {
  title: string;
  url: string;
  category?: string;
  meta?: string; // e.g., "5 min read" or "Chapter 2"
}

interface RelatedContentProps {
  items: RelatedItem[];
  title?: string;
}

export default function RelatedContent({
  items,
  title = '📚 Related Study Material',
}: RelatedContentProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.grid}>
        {items.map((item, index) => (
          <Link href={item.url} key={index} className={styles.card}>
            {item.category && <span className={styles.category}>{item.category}</span>}
            <h3 className={styles.cardTitle}>{item.title}</h3>
            {item.meta && <span className={styles.meta}>{item.meta}</span>}
            <span className={styles.arrow}>→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
