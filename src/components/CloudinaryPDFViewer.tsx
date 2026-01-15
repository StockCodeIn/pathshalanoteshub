'use client';

import { useEffect, useState } from 'react';
import styles from "./CloudinaryPDFViewer.module.css";

interface Props {
  title: string;
  pageImages: string[];
}

export default function CloudinaryPDFViewer({
  title,
  pageImages,
}: Props) {
  const INITIAL_PAGES = 3;
  const LOAD_MORE = 3;

  const [visibleCount, setVisibleCount] = useState(INITIAL_PAGES);

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >
        document.body.offsetHeight - 800
      ) {
        setVisibleCount(v =>
          Math.min(v + LOAD_MORE, pageImages.length)
        );
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pageImages.length]);

  return (
    <div className={styles.pdfViewer}>
      {pageImages.slice(0, visibleCount).map((src, index) => (
        <figure key={index} className={styles.page}>
          <img
            src={src}
            alt={`${title} PDF Page ${index + 1}`}
            width={1200}
            height={1550}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? "high" : "low"}
            decoding="async"
          />
          {/* <span className={styles.pageNumber}>
            Page {index + 1}
          </span> */}
        </figure>
      ))}
    </div>
  );
}
