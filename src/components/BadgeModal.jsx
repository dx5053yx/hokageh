import { useNavigate } from 'react-router-dom';
import { Award } from 'lucide-react';

export default function BadgeModal({ open, onClose, badge = {} }) {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
      <div style={{ width: 'min(520px, 92%)', background: 'var(--bg-panel, #0b1220)', borderRadius: 16, padding: '1.5rem', textAlign: 'center', color: 'var(--text-primary, #fff)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ width: 96, height: 96, borderRadius: 56, background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
            <Award size={48} color="white" />
          </div>
        </div>
        <h2 style={{ marginBottom: '0.5rem' }}>{badge.title || 'Boss Victor'}</h2>
        <p style={{ color: 'var(--text-secondary, #9aa4b2)', marginBottom: '1rem' }}>{badge.desc || 'You vanquished the boss! +200 EXP'}</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button className="glass-panel" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={() => { onClose(); navigate('/profile'); }}>View Profile</button>
        </div>
      </div>
    </div>
  );
}
