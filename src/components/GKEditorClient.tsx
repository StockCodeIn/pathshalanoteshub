// src/components/GKEditorClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GKEditorClient() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ✅ Check login status on mount
  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  // ✅ Logout system (clears cookie + localStorage)
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/admin/logout', { method: 'POST' }); // Backend logout
      localStorage.removeItem('admin_logged_in'); // Remove frontend flag
      setIsLoggedIn(false);
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // === Existing editor states ===
  const [topic, setTopic] = useState('current-affairs');
  const [subtopic, setSubtopic] = useState('national-affairs');
  const [name, setName] = useState('example-subsub');
  const [displayName, setDisplayName] = useState('');
  const [order, setOrder] = useState<number | ''>('');
  const [html, setHtml] = useState('<h1>Your content</h1>');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<any | null>(null);

  // ✅ Save content to server
  const handleSave = async () => {
    setLoading(true);
    setMsg(null);
    setLastSaved(null);
    try {
      const payload: any = { topic, subtopic, name, displayName, htmlContent: html };
      if (order !== '') payload.order = Number(order);

      const res = await fetch('/api/gk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setMsg('✅ Saved successfully');
        setLastSaved(data.item || null);
      } else {
        setMsg('❌ Failed: ' + (data.error || 'unknown'));
      }
    } catch {
      setMsg('⚠️ Error saving');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="editor-container">
      <div className="editor-header">
        <h2 className="editor-title">GK Admin Editor</h2>
        <button onClick={handleLogout} disabled={isLoggingOut} className="logout-btn">
          {isLoggingOut ? 'Logging out...' : '🚪 Logout'}
        </button>
      </div>

      {/* === Form === */}
      <div className="form-group">
        <label>Topic (slug):</label>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Subtopic (slug):</label>
        <input value={subtopic} onChange={(e) => setSubtopic(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Sub-subtopic name (slug):</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Display Name:</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Order (1 = first):</label>
        <input
          type="number"
          min={1}
          value={order}
          onChange={(e) =>
            setOrder(e.target.value === '' ? '' : Number(e.target.value))
          }
          style={{ width: '120px' }}
        />
        <small>Lower numbers appear first. Leave blank to auto-append.</small>
      </div>

      <div className="form-group">
        <label>HTML Content:</label>
        <textarea rows={10} value={html} onChange={(e) => setHtml(e.target.value)} />
      </div>

      {/* === Buttons === */}
      <div className="button-group">
        <button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : '💾 Save'}
        </button>
        <button onClick={() => navigator.clipboard?.writeText(html)}>📋 Copy HTML</button>
        <button onClick={() => setHtml('')}>🧹 Clear</button>
      </div>

      {msg && <p className="status-msg">{msg}</p>}

      {lastSaved && (
        <div className="response-box">
          <h4>Server response (saved item):</h4>
          <pre>{JSON.stringify(lastSaved, null, 2)}</pre>
        </div>
      )}

      <div className="preview-box">
        <h3>Preview</h3>
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* ✅ Styles */}
      <style jsx>{`
        .editor-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .editor-title {
          font-size: 24px;
          color: #333;
          margin: 0;
        }

        .logout-btn {
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 14px;
          cursor: pointer;
          font-size: 15px;
          transition: background 0.2s;
        }
        .logout-btn:hover {
          background-color: #c82333;
        }

        .form-group {
          margin-bottom: 16px;
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: 600;
          margin-bottom: 6px;
        }

        input,
        textarea {
          padding: 10px;
          font-size: 15px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .button-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 12px;
        }

        button {
          flex: 1;
          min-width: 100px;
          padding: 10px;
          font-size: 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        button:nth-child(1) {
          background-color: #007bff;
          color: white;
        }

        button:nth-child(2) {
          background-color: #28a745;
          color: white;
        }

        button:nth-child(3) {
          background-color: #ffc107;
          color: #222;
        }

        .status-msg {
          margin-top: 12px;
          font-weight: 600;
        }

        .preview-box {
          margin-top: 30px;
          border-top: 2px solid #eee;
          padding-top: 10px;
        }

        .preview-content {
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 6px;
        }

        /* ✅ Mobile */
        @media (max-width: 600px) {
          .editor-title {
            font-size: 20px;
          }
          .editor-container {
            padding: 15px;
          }
          .editor-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .logout-btn {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
