'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname) return null;

  const parts = pathname.split('/').filter(Boolean); // remove empty
  const crumbs = parts.map((part, index) => {
    const href = '/' + parts.slice(0, index + 1).join('/');
    const label = decodeURIComponent(part).replace(/-/g, ' ');

    return { href, label };
  });

  return (
    <nav aria-label="breadcrumbs" style={{ fontSize: '0.9rem', color: '#555' }}>
      <ol
        style={{
          listStyle: 'none',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          padding: 0,
          margin: 0,
        }}
      >
        {/* 🏠 Home link */}
        <li>
          <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
            Home
          </Link>
        </li>

        {crumbs.map((crumb, index) => (
          <li key={crumb.href} style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ margin: '0 4px', color: '#aaa' }}>›</span>
            {index === crumbs.length - 1 ? (
              <span style={{ color: '#222', textTransform: 'capitalize' }}>
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                style={{ color: '#0070f3', textDecoration: 'none', textTransform: 'capitalize' }}
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
