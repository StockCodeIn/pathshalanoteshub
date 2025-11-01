'use client';

import { useState, useEffect } from 'react';

export default function AdminLoginClient() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      // ✅ Already logged in, redirect to editor
      window.location.href = '/admin/gk-editor';
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_logged_in', 'true');
        window.location.href = '/admin/gk-editor';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>

      {/* ✅ Inline CSS for mobile-friendly layout */}
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f8f9fa;
          padding: 20px;
        }

        .login-box {
          width: 100%;
          max-width: 400px;
          background: white;
          padding: 24px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        h2 {
          font-size: 22px;
          margin-bottom: 20px;
          text-align: center;
          color: #333;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
          margin-bottom: 12px;
        }

        .login-btn {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          border: none;
          color: white;
          font-size: 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .login-btn:hover {
          background-color: #0056b3;
        }

        .error-text {
          color: red;
          font-size: 14px;
          margin-top: 8px;
          text-align: center;
        }

        @media (max-width: 480px) {
          .login-box {
            padding: 18px;
          }
          h2 {
            font-size: 20px;
          }
          .input-field,
          .login-btn {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}
