// src/components/HTMLContentViewer.tsx
'use client';

import { useEffect, useState } from 'react';
import styles from '../styles/HTMLContent.module.css';

interface HTMLContentViewerProps {
  htmlContent: string;
  title: string;
  readingTime?: number;
  lastUpdated?: Date;
  pdfDownloadUrl?: string;
  board?: string;
  grade?: string;
  subject?: string;
}

export default function HTMLContentViewer({
  htmlContent,
  title,
  readingTime = 0,
  lastUpdated,
  pdfDownloadUrl,
  board,
  grade,
  subject,
}: HTMLContentViewerProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [showTOC, setShowTOC] = useState(false);
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [readProgress, setReadProgress] = useState(0);

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, []);

  // Extract headings for TOC
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const content = document.querySelector('.html-content');
    if (!content) return;

    const headingElements = content.querySelectorAll('h2, h3');
    const headingData = Array.from(headingElements).map((elem, idx) => {
      if (!elem.id) {
        elem.id = `heading-${idx}`;
      }
      return {
        id: elem.id,
        text: elem.textContent || '',
        level: parseInt(elem.tagName.substring(1)),
      };
    });
    setHeadings(headingData);
  }, [htmlContent]);

  // Read progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setReadProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    localStorage.setItem('fontSize', String(newSize));
  };

  const handlePrint = () => {
    window.print();
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied! Share with your friends.');
  };

  return (
    <>
      {/* Reading Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          width: `${readProgress}%`,
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          zIndex: 9999,
          transition: 'width 0.1s ease',
        }}
      />

      <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
        {/* Control Panel */}
        <div className={styles.controls}>
          <button onClick={toggleDarkMode} className={styles.btn} title="Toggle Dark Mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => changeFontSize(-2)} className={styles.btn} title="Decrease Font">
            A-
          </button>
          <button onClick={() => changeFontSize(2)} className={styles.btn} title="Increase Font">
            A+
          </button>
          <button onClick={() => setShowTOC(!showTOC)} className={styles.btn} title="Table of Contents">
            📑
          </button>
          <button onClick={handlePrint} className={styles.btn} title="Print Notes">
            🖨️
          </button>
          <button onClick={copyLink} className={styles.btn} title="Copy Link">
            🔗
          </button>
          {pdfDownloadUrl && (
            <a href={pdfDownloadUrl} download className={styles.btn} title="Download PDF">
              📥 PDF
            </a>
          )}
        </div>

        {/* Article Header */}
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            {board && <span>{board}</span>}
            {grade && <span> › Class {grade}</span>}
            {subject && <span> › {subject}</span>}
          </div>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.meta}>
            {readingTime > 0 && <span>📖 {readingTime} min read</span>}
            {lastUpdated && (
              <span>🕒 Updated: {new Date(lastUpdated).toLocaleDateString('en-IN')}</span>
            )}
            <span>✓ Verified Content</span>
          </div>
        </header>

        {/* Table of Contents (Collapsible) */}
        {showTOC && headings.length > 0 && (
          <nav className={styles.toc}>
            <h3>📑 Table of Contents</h3>
            <ul>
              {headings.map((h) => (
                <li
                  key={h.id}
                  style={{ marginLeft: h.level === 3 ? '1.5rem' : '0' }}
                >
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Main Content */}
        <article
          className={`${styles.article} html-content`}
          style={{ fontSize: `${fontSize}px` }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Mark as Read Button */}
        <div className={styles.completion}>
          <button
            className={styles.completeBtn}
            onClick={() => {
              const key = `read_${board}_${grade}_${subject}_${title}`;
              localStorage.setItem(key, 'true');
              alert('✅ Marked as complete! Great job!');
            }}
          >
            ✓ Mark as Read
          </button>
        </div>
      </div>
    </>
  );
}
