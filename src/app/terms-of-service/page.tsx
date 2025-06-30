// pages/terms-of-service.jsx
import styles from '@/styles/Policy.module.css';

export default function TermsOfService() {
  return (
    <div className={styles.policy}>
      <h1>Terms of Service</h1>
      <p>Last updated: June 29, 2025</p>

      <p>
        Welcome to Pathshala Notes Hub. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully.
      </p>

      <h2>1. Use of Content</h2>
      <p>
        All notes, past papers, and resources provided are for personal, non-commercial use only. You may not copy, distribute, or sell any material from this website without permission.
      </p>

      <h2>2. Accuracy of Information</h2>
      <p>
        We aim to provide accurate and up-to-date educational content. However, we do not guarantee the completeness or correctness of the material.
      </p>

      <h2>3. User Conduct</h2>
      <p>
        You agree not to misuse the website in any way, including attempting to hack, spam, or cause harm to our content or users.
      </p>

      <h2>4. Modifications</h2>
      <p>
        We may change or update these terms at any time. It is your responsibility to check this page periodically for changes.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        We are not liable for any losses or damages that may arise from the use of our website or resources.
      </p>

      <h2>6. Termination</h2>
      <p>
        We reserve the right to block or suspend access to users who violate these terms.
      </p>

      <h2>7. Contact</h2>
      <p>
        If you have questions about these Terms of Service, please <a href="/contact">contact us</a>.
      </p>
    </div>
  );
}
