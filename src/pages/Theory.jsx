
import grammarData from '../data/grammar.json';
import { BookOpen } from 'lucide-react';
import '../styles/index.css';

export default function Theory() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header className="glass-panel animate-pop-in" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '16px', color: 'var(--accent-warning)' }}>
          <BookOpen size={32} />
        </div>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Basic Grammar</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Learn how to build sentences with particles.</p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {grammarData.map((item, index) => (
          <div key={item.id} className="glass-panel animate-pop-in" style={{ padding: '1.5rem', animationDelay: `${index * 0.1}s` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{item.particle}</span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>({item.romaji})</span>
            </div>
            
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}><strong>Usage:</strong> {item.usage}</p>
            
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', borderLeft: '4px solid var(--accent-secondary)' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{item.example}</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', fontStyle: 'italic' }}>{item.exampleRomaji}</p>
              <p style={{ color: 'var(--text-secondary)' }}>"{item.meaning}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
