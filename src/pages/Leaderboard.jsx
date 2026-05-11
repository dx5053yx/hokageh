import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import '../styles/index.css';

export default function Leaderboard() {
  const dummyData = [
    { rank: 1, name: "Sakura", exp: 2450, icon: <Trophy color="gold" size={24} /> },
    { rank: 2, name: "Naruto", exp: 2100, icon: <Medal color="silver" size={24} /> },
    { rank: 3, name: "Sasuke", exp: 1950, icon: <Award color="#cd7f32" size={24} /> },
    { rank: 4, name: "Senpai (You)", exp: 120, icon: null },
    { rank: 5, name: "Hinata", exp: 90, icon: null },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <Trophy size={48} color="var(--accent-warning)" style={{ marginBottom: '1rem' }} />
      <h1 className="text-gradient" style={{ marginBottom: '2rem' }}>Weekly Rank</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {dummyData.map((user) => (
          <div 
            key={user.rank}
            className="glass-panel animate-pop-in"
            style={{ 
              padding: '1rem 1.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              background: user.name.includes('(You)') ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-glass)',
              border: user.name.includes('(You)') ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
              animationDelay: `${user.rank * 0.1}s`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-secondary)', width: '30px' }}>
                #{user.rank}
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: user.name.includes('(You)') ? 'bold' : 'normal' }}>
                {user.name}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>{user.exp} EXP</span>
              <div style={{ width: '24px' }}>{user.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
