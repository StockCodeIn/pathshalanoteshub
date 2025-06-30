// pages/about.jsx
import styles from '@/styles/Policy.module.css';

export default function About() {
  return (
    <div className={styles.policy}>
      <h1>About Us</h1>
      <p>
        <strong>Pathshala Notes Hub</strong> is a free educational platform designed for RBSE and CBSE board students. Our mission is to provide all essential study materials in one place — including Notes, Previous Year Papers, Study Plans, Time Management tips, and Indian GK.
      </p>

      <h2>What We Offer</h2>
      <ul>
        <li>✅ Subject-wise notes for RBSE & CBSE Classes 10, 11, and 12</li>
        <li>✅ Previous years exam papers</li>
        <li>✅ Smart study plans and time management resources</li>
        <li>✅ Updated Indian GK notes</li>
      </ul>

      <h2>Our Vision</h2>
      <p>
        Our aim is to make studying stress-free and well-organized. We want to guide students in the right direction so that they can score well even through self-study — without depending on expensive tuitions or coaching classes.
      </p>

      <h2>Future Plans</h2>
      <p>
        In the coming days, we plan to include study materials for Classes 8 and 9 as well. We’re also working on adding more subjects, sample papers, mock tests, and educational videos.
      </p>

      <h2>Connect With Us</h2>
      <p>
        If you have any suggestions or feedback, please feel free to reach out to us via our <strong><a href="/contact">Contact Page</a></strong>.
      </p>
    </div>
  );
}
