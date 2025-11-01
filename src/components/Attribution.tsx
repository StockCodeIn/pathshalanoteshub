import React from 'react';

interface Props {
  dateModified?: string | Date | null;
}

function formatDate(d?: string | Date | null) {
  try {
    const dt = d ? new Date(d) : new Date();
    return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
}

export default function Attribution({ dateModified }: Props) {
  const year = (dateModified && new Date(dateModified).getFullYear()) || new Date().getFullYear();
  return (
    <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', margin: '2rem 0' }}>
      © {year} Pathshala Notes Hub | Last Updated: {formatDate(dateModified)}
    </div>
  );
}
