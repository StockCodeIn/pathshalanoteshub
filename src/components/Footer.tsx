import Link from 'next/link';
import styles from '@/styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-container']}>
        <p className={styles.tagline}>
          Pathshala Notes Hub provides quality educational resources for competitive exams.
        </p>
        <nav className={styles['footer-links']} aria-label="Footer Navigation">
          <Link href="/privacy-policy" className={styles['footer-link']}>Privacy Policy</Link>
          <Link href="/terms-of-service" className={styles['footer-link']}>Terms of Service</Link>
          <Link href="/disclaimer" className={styles['footer-link']}>Disclaimer</Link>
          <Link href="/contact" className={styles['footer-link']}>Contact Us</Link>
        </nav>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} PathshalaNotesHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
