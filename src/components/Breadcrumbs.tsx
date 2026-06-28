'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type BreadcrumbItem = {
  href: string;
  label: string;
};

type Props = {
  items?: BreadcrumbItem[];
};

const LABELS: Record<string, string> = {
  blogs: 'Blogs',

  rbse: 'RBSE Notes',

  cbse: 'CBSE Notes',

  gk: 'General Knowledge',

  'rbse-papers': 'RBSE Previous Papers',

  'study-plan': 'Study Plan',

  'time-management': 'Time Management',

  about: 'About',

  contact: 'Contact',

  'privacy-policy': 'Privacy Policy',

  disclaimer: 'Disclaimer',

  'terms-of-service': 'Terms of Service',
};

function titleCase(text: string) {
  return text
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function Breadcrumbs({ items }: Props) {
  const pathname = usePathname();

  if (!pathname) return null;

  const breadcrumbs: BreadcrumbItem[] =
  items ??
  [
    {
      href: '/',
      label: 'Home',
    },
    ...pathname
      .split('/')
      .filter(Boolean)
      .map((part, index, arr) => ({
        href: '/' + arr.slice(0, index + 1).join('/'),
        label:
          LABELS[part] ??
          titleCase(decodeURIComponent(part)),
      })),
  ];

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        marginBottom: '2rem',
        fontSize: '.95rem',
      }}
    >
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          gap: '.5rem',
          alignItems: 'center',
        }}
      >

        {breadcrumbs.map((crumb, index) => (
          <li
            key={crumb.href}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {index > 0 && (
             <span
                style={{
                  color: "#9ca3af",
                  margin: "0 .35rem",
               }}
              >
                /
              </span>
            )}

            {index === breadcrumbs.length - 1 ? (
              <span
                style={{
                  color: '#111827',
                  fontWeight: 600,
                }}
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                }}
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