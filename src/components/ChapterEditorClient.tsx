// src/components/ChapterEditorClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/ChapterEditor.module.css';

interface Chapter {
  _id: string;
  name: string;
  board: string;
  grade: string;
  subject: string;
  htmlContent: string;
  isHtmlReady: boolean;
  metaDescription: string;
  htmlTitle: string;
  keywords: string[];
}

export default function ChapterEditorClient() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [htmlTitle, setHtmlTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState({ board: 'ALL', grade: 'ALL', subject: 'ALL' });

  // Check login status on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch chapters when filter changes or user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchChapters();
    }
  }, [filter, isLoggedIn]);

  const fetchChapters = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.board !== 'ALL') params.append('board', filter.board);
      if (filter.grade !== 'ALL') params.append('grade', filter.grade);
      if (filter.subject !== 'ALL') params.append('subject', filter.subject);

      const res = await fetch(`/api/admin/chapters?${params.toString()}`, {
        credentials: 'include', // ✅ Send cookies for authentication
      });
      
      console.log('📡 API Response Status:', res.status);
      
      const data = await res.json();
      console.log('📡 API Response Data:', data);
      
      if (data.success) {
        setChapters(data.chapters);
        console.log('✅ Chapters loaded:', data.chapters.length);
      } else {
        console.error('❌ API Error:', data.error);
        if (res.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('admin_logged_in');
          router.push('/admin/login');
        }
      }
    } catch (error) {
      console.error('❌ Fetch Error:', error);
    }
  };

  const selectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setHtmlContent(chapter.htmlContent || '');
    setMetaDescription(chapter.metaDescription || '');
    setKeywords(chapter.keywords?.join(', ') || '');
    setHtmlTitle(chapter.htmlTitle || '');
    setMessage('');
  };

  // ✅ Auto-extract meta tags from HTML
  const extractMetaTags = (html: string) => {
    try {
      // Extract title from <title> tag
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';

      // Extract meta description
      const descMatch = html.match(/<meta\s+name=["']?description["']?\s+content=["']?([^"'>]*)["']?/i);
      const desc = descMatch ? descMatch[1].trim() : '';

      // Extract keywords
      const keywordsMatch = html.match(/<meta\s+name=["']?keywords["']?\s+content=["']?([^"'>]*)["']?/i);
      let kw = keywordsMatch ? keywordsMatch[1].trim() : '';

      // Update states
      setHtmlTitle(title);
      setMetaDescription(desc);
      setKeywords(kw);

      // Show confirmation message
      if (title || desc || kw) {
        setMessage('✅ Meta tags extracted from HTML!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error extracting meta tags:', error);
    }
  };

  const saveChapter = async () => {
    if (!selectedChapter) return;

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin/chapters/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ Send cookies for authentication
        body: JSON.stringify({
          chapterId: selectedChapter._id,
          htmlContent,
          metaDescription,
          htmlTitle,
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
          isHtmlReady: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('✅ Chapter updated successfully!');
        fetchChapters(); // Refresh list
      } else {
        setMessage('❌ Error: ' + data.error);
      }
    } catch (error) {
      setMessage('❌ Failed to save chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
      localStorage.removeItem('admin_logged_in');
      setIsLoggedIn(false);
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  // Don't render if not logged in
  if (!isLoggedIn) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>📚 Chapter HTML Editor</h1>
          <p>Select a chapter and add HTML content</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Logout
        </button>
      </header>

      <div className={styles.layout}>
        {/* Sidebar - Chapter List */}
        <aside className={styles.sidebar}>
          <div className={styles.filters}>
            <select
              value={filter.board}
              onChange={(e) => setFilter({ ...filter, board: e.target.value })}
            >
              <option value="ALL">All Boards</option>
              <option value="RBSE">RBSE</option>
              <option value="CBSE">CBSE</option>
            </select>

            <select
              value={filter.grade}
              onChange={(e) => setFilter({ ...filter, grade: e.target.value })}
            >
              <option value="ALL">All Grades</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>

            <select
              value={filter.subject}
              onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
            >
              <option value="ALL">All Subjects</option>
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="biology">Biology</option>
            </select>
          </div>

          <div className={styles.chapterCount}>
            📊 {chapters.length} chapter{chapters.length !== 1 ? 's' : ''} found
          </div>

          <div className={styles.chapterList}>
            {chapters.length === 0 ? (
              <div className={styles.emptyState}>
                <p>😔 No chapters found</p>
                <small>Try changing the filters above</small>
              </div>
            ) : (
              chapters.map((chapter) => (
                <div
                  key={chapter._id}
                  className={`${styles.chapterItem} ${
                    selectedChapter?._id === chapter._id ? styles.selected : ''
                  } ${chapter.isHtmlReady ? styles.ready : ''}`}
                  onClick={() => selectChapter(chapter)}
                >
                  <div className={styles.chapterInfo}>
                    <strong>{chapter.name}</strong>
                    <span>
                      {chapter.board} • Class {chapter.grade} • {chapter.subject}
                    </span>
                  </div>
                  {chapter.isHtmlReady && <span className={styles.badge}>✓</span>}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Editor */}
        <main className={styles.editor}>
          {selectedChapter ? (
            <>
              <div className={styles.editorHeader}>
                <h2>{selectedChapter.name}</h2>
                <p>
                  {selectedChapter.board} Class {selectedChapter.grade} - {selectedChapter.subject}
                </p>
              </div>

              <div className={styles.form}>
                {/* HTML Content */}
                <div className={styles.formGroup}>
                  <label>HTML Content (with &lt;head&gt; tags):</label>
                  <div className={styles.formHelper}>
                    <p>📌 Paste your complete HTML here (including &lt;title&gt;, &lt;meta&gt; tags, etc.)</p>
                    <p>✨ Meta tags will be automatically extracted when you paste!</p>
                  </div>
                  <textarea
                    value={htmlContent}
                    onChange={(e) => {
                      setHtmlContent(e.target.value);
                      // Auto-extract on paste
                      if (e.target.value.includes('<meta') || e.target.value.includes('<title')) {
                        extractMetaTags(e.target.value);
                      }
                    }}
                    rows={25}
                    className={styles.htmlTextarea}
                    placeholder="<!DOCTYPE html>
<html>
<head>
<title>Chapter Title</title>
<meta name='description' content='...'>
<meta name='keywords' content='...'>
</head>
<body>
<!-- Your content here -->
</body>
</html>"
                  />
                </div>

                {/* Extracted Meta Description */}
                <div className={styles.formGroup}>
                  <label>🔍 Extracted Meta Description:</label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={2}
                    placeholder="Auto-extracted from HTML <meta> tag..."
                    maxLength={160}
                  />
                  <span className={styles.charCount}>{metaDescription.length}/160</span>
                </div>

                {/* Extracted Title */}
                <div className={styles.formGroup}>
                  <label>🏷️ Extracted HTML Title:</label>
                  <input
                    type="text"
                    value={htmlTitle}
                    onChange={(e) => setHtmlTitle(e.target.value)}
                    placeholder="Auto-extracted from HTML <title> tag..."
                  />
                </div>

                {/* Extracted Keywords */}
                <div className={styles.formGroup}>
                  <label>🔑 Extracted Keywords:</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Auto-extracted from HTML <meta keywords> tag... (comma separated)"
                  />
                </div>

                {/* Preview */}
                <div className={styles.formGroup}>
                  <label>👁️ HTML Preview (body only):</label>
                  <div
                    className={styles.preview}
                    dangerouslySetInnerHTML={{
                      __html: htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || htmlContent
                    }}
                  />
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                  <button
                    onClick={saveChapter}
                    disabled={loading}
                    className={styles.saveBtn}
                  >
                    {loading ? '⏳ Saving...' : '💾 Save Chapter'}
                  </button>
                  {message && (
                    <span
                      className={
                        message.includes('✅') ? styles.success : styles.error
                      }
                    >
                      {message}
                    </span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className={styles.placeholder}>
              <p>👈 Select a chapter from the list to start editing</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
