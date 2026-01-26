'use client';

import { useEffect, useState } from 'react';
import styles from "./CloudinaryPDFViewer.module.css";
import AdsenseAd from './AdsenseAd';

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
  const AD_AFTER_PAGES = 5; // हर 5 pages के बाद ad

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
        <div key={index}>
          <figure className={styles.page}>
            <img
              src={src}
              alt={`${title} PDF Page ${index + 2}`}
              width={1200}
              height={1550}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? "high" : "low"}
              decoding="async"
            />
          </figure>
          
          {/* 
            ============================================
            IN-ARTICLE AD (Content between PDF pages)
            ============================================
            Type: in-article (fluid format)
            Purpose: Native ad between content
            Slot: 3645773527 (Google in-article slot)
            Format: data-ad-format="fluid" + data-ad-layout="in-article"
            CLS: ✅ No CLS (flexible height)
            Best for: Between long content/pages
            ============================================
          */}
          {(index + 1) % AD_AFTER_PAGES === 0 && index < visibleCount - 1 && (
            <div style={{ margin: '2rem 0', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
              <AdsenseAd slot="1396603768" variant="in-article" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
