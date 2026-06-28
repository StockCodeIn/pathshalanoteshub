'use client';

import Link from 'next/link';
import type { TocHeading } from '@/lib/extractHeadings';
import styles from '@/styles/TableOfContents.module.css';

type Props = {
  headings: TocHeading[];
};

export default function TableOfContents({ headings }: Props) {
  if (!headings.length) return null;

  return (
    <aside className={styles.toc}>
      <h2 className={styles.title}>
        📑 Table of Contents
      </h2>

      <nav
        className={styles.nav}
        aria-label="Table of contents"
      >
        <ol className={styles.list}>
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`${styles.item} ${
                styles[`level${heading.level}`]
              }`}
            >
              <Link
                href={`#${heading.id}`}
                className={styles.link}
              >
                {heading.text}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}