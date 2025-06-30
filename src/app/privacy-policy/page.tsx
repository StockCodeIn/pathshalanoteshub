import styles from '@/styles/Policy.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.policy}>
      <h1>Privacy Policy</h1>
      <p>Last updated: June 29, 2025</p>

      <p>
        Welcome to Pathshala Notes Hub. Your privacy is very important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We do not collect personal data like names, emails, or phone numbers. However, we may collect non-personal data such as:
      </p>
      <ul>
        <li>Browser type and version</li>
        <li>Visited pages and duration</li>
        <li>Device type and IP address</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <p>
        The collected data is used only to improve website performance, analyze traffic, and enhance user experience. We do not sell or share any data with third parties.
      </p>

      <h2>3. Third-Party Services</h2>
      <p>
        We may use tools like Google Analytics to understand how our users interact with the site. These services may use cookies to collect traffic data.
      </p>

      <h2>4. Advertisement</h2>
      <p>
        In future, we may display ads to support our free content. Ads may use cookies to show relevant content. You can control these settings in your browser.
      </p>

      <h2>5. External Links</h2>
      <p>
        Our site may contain links to other websites. We are not responsible for the privacy practices of those sites.
      </p>

      <h2>6. Children&apos;s Privacy</h2>
      <p>
        We do not knowingly collect data from children under 13. If you think your child has provided us with information, please contact us immediately.
      </p>

      <h2>7. Updates to This Policy</h2>
      <p>
        We may update this policy from time to time. Changes will be posted on this page with the updated date.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, feel free to <a href="/contact">contact us</a>.
      </p>
    </div>
  );
}

