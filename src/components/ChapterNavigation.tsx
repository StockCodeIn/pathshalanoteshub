import Link from "next/link";
import { ChapterInfo } from "@/lib/chapterMetadata";
import styles from "@/styles/ChapterNavigation.module.css";

interface Props {
  board: "CBSE" | "RBSE";
  grade: string;
  subject: string;
  currentChapter: string;
  chapterInfo: ChapterInfo;
}

export default function ChapterNavigation({
  board,
  grade,
  subject,
  currentChapter,
  chapterInfo,
}: Props) {
  const baseUrl = `/${board.toLowerCase()}/${grade}/${subject}`;

  return (
    <section
      className={styles.wrapper}
      aria-labelledby="chapter-navigation"
    >
      <h2 id="chapter-navigation" className={styles.title}>
        Explore More Chapters
      </h2>

      {/* Previous / Next */}
      <div className={styles.prevNext}>
        {chapterInfo.previous ? (
          <Link
            href={`${baseUrl}/${chapterInfo.previous.no}`}
            className={styles.navCard}
          >
            ← Previous
            <span>{chapterInfo.previous.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {chapterInfo.next ? (
          <Link
            href={`${baseUrl}/${chapterInfo.next.no}`}
            className={styles.navCard}
          >
            Next →
            <span>{chapterInfo.next.title}</span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Same Subject Chapters */}

      <h3 className={styles.subtitle}>
        {chapterInfo.subjectName} Chapters
      </h3>

      <div className={styles.chapterGrid}>
        {chapterInfo.chapters.map((title, index) => {
          const no = index + 1;

          const active =
            String(no) === currentChapter;

          return (
            <Link
              key={no}
              href={`${baseUrl}/${no}`}
              className={`${styles.chapterCard} ${
                active ? styles.active : ""
              }`}
            >
              <strong>Chapter {no}</strong>

              <span>{title}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}