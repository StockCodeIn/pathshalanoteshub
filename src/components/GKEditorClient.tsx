'use client';

import { useState } from 'react';

interface Props { }

export default function GKEditorClient({ }: Props) {
  const [topic, setTopic] = useState('current-affairs');
  const [subtopic, setSubtopic] = useState('national-affairs');
  const [name, setName] = useState('example-subsub');
  const [displayName, setDisplayName] = useState('');
  const [order, setOrder] = useState<number | ''>('');
  const [html, setHtml] = useState('<h1>Your content</h1>');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<any | null>(null);
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
        setMsg('Saved successfully');
        setLastSaved(data.item || null);
      } else {
        setMsg('Failed: ' + (data.error || 'unknown'));
        setLastSaved(data || null);
      }
    } catch (err) {
      setMsg('Error saving');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
      <h2>GK Admin Editor</h2>
      <div style={{ marginBottom: 8 }}>
        <label>Topic (slug): </label>
        <input value={topic} onChange={(e) => setTopic(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Subtopic (slug): </label>
        <input value={subtopic} onChange={(e) => setSubtopic(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Sub-subtopic name (slug): </label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Display Name:</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Order (1 = first):</label>
        <input
          type="number"
          min={1}
          value={order}
          onChange={(e) => setOrder(e.target.value === '' ? '' : Number(e.target.value))}
          style={{ width: 120 }}
        />
        <div style={{ fontSize: 12, color: '#666' }}>Lower numbers appear first. Leave blank to auto-append.</div>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>HTML Content:</label>
        <textarea rows={12} style={{ width: '100%' }} value={html} onChange={(e) => setHtml(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button onClick={() => navigator.clipboard?.writeText(html)}>Copy HTML</button>
        <button onClick={() => setHtml('')}>Clear</button>
      </div>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      {lastSaved && (
        <div style={{ marginTop: 12 }}>
          <h4>Server response (saved item):</h4>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fafafa', padding: 8, border: '1px solid #eee' }}>
            {JSON.stringify(lastSaved, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <h3>Preview</h3>
        <div dangerouslySetInnerHTML={{ __html: html }} style={{ border: '1px solid #eee', padding: 10 }} />
      </div>
    </div>
  );
}
