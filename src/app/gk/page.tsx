'use client';

import Link from 'next/link';

const topics = [
  { title: 'करंट अफेयर्स', slug: 'current-affairs' },
  { title: 'भारतीय इतिहास', slug: 'indian-history' },
  { title: 'भूगोल (भारत और विश्व)', slug: 'geography' },
  { title: 'राजव्यवस्था (भारतीय संविधान)', slug: 'polity' },
  { title: 'विज्ञान और प्रौद्योगिकी', slug: 'science-technology' },
  { title: 'महत्वपूर्ण दिन और घटनाएँ', slug: 'important-days-events' },
  { title: 'खेल सामान्य ज्ञान', slug: 'sports-gk' },
  { title: 'पुस्तकें और लेखक', slug: 'books-authors' },
  { title: 'पुरस्कार और सम्मान', slug: 'awards-honours' },
  { title: 'स्थैतिक सामान्य ज्ञान', slug: 'static-gk' },
];

export default function GKPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        सामान्य ज्ञान विषय
      </h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        {topics.map((topic) => (
          <Link href={`/gk/${topic.slug}`} key={topic.slug}>
            <div
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                transition: 'box-shadow 0.3s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)')
              }
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>
                {topic.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

