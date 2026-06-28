import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function BlogsNotFoundPage() {
  return (
    <main>
      <section
        className={styles.hero}
        style={{ padding: '3rem 1rem', textAlign: 'left' }}
      >
        <div className={styles.heroContent}>
          <p style={{ margin: 0, color: '#2563eb', fontWeight: 700 }}>
            404 Error
          </p>
          <h1>Blog post nahi mila</h1>
          <p style={{ maxWidth: '760px', margin: '1rem 0 0' }}>
            Jo blog post aap dekhna chahte the wo available nahi hai, remove ho chuka hai,
            ya URL galat hai.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              marginTop: '1.5rem',
            }}
          >
            <Link href="/blogs" className={styles.ctaButton}>
              All Blogs
            </Link>

            <Link href="/" className={styles.ctaButtonSecondary}>
              Home Page
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 900, margin: '0 auto 2rem', padding: '0 1rem' }}>
        <div className={styles.trust}>
          <h2>Aap kya kar sakte hain?</h2>
          <ul>
            <li>✔ URL ko dobara check karein</li>
            <li>✔ Blogs list page se related post kholen</li>
            <li>✔ Home page par jaakar doosri category browse karein</li>
          </ul>
        </div>
      </section>
    </main>
  );
}