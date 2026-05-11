import React from 'react';

export default function ProgressBar({ progress, colorClass = 'var(--accent-primary)' }) {
  return (
    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1rem' }}>
      <div style={{ width: `${progress}%`, height: '100%', background: colorClass, transition: 'width 0.5s ease' }}></div>
    </div>
  );
}
