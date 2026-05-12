import { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { User, Flame, Star, Zap, LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import vocabData from '../data/vocab.json';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import '../styles/index.css';

import { getRank } from '../utils/ranks';
import { Trophy, Medal, Target } from 'lucide-react';

const ACHIEVEMENT_DATA = {
  first_blood: { title: 'First Blood', desc: 'Answer your first question correctly.', icon: <Target size={24} color="var(--accent-primary)" /> },
  speed_run: { title: 'Speed Run', desc: 'Finish a session with 100% accuracy and 3 hearts.', icon: <Zap size={24} color="var(--accent-warning)" /> },
  week_warrior: { title: 'Week Warrior', desc: 'Reach a 7-day streak.', icon: <Flame size={24} color="var(--accent-danger)" /> }
};

export default function Profile() {
  const { userLevel, exp, streak, achievements, currentUser, categoryProgress } = useStore();
  const rank = getRank(userLevel);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert(`Login Gagal! Pesan Error: ${error.message}\n\nPastikan Anda sudah mengaktifkan 'Google Sign-in' di menu Authentication Firebase Console.`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      <header className="glass-panel animate-pop-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        
        {currentUser ? (
          <>
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '1rem', boxShadow: 'var(--shadow-glow)' }} />
            ) : (
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', boxShadow: 'var(--shadow-glow)' }}>
                <User size={48} color="white" />
              </div>
            )}
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{currentUser.displayName}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{currentUser.email}</p>
            <button onClick={handleLogout} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', color: 'var(--accent-danger)', cursor: 'pointer', border: '1px solid var(--accent-danger)' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', boxShadow: 'var(--shadow-glow)' }}>
              <User size={48} color="white" />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Guest Senpai</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Login to save your progress!</p>
            <button onClick={handleLogin} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LogIn size={20} /> Login with Google
            </button>
          </>
        )}
        
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel animate-pop-in" style={{ padding: '1.5rem', textAlign: 'center', animationDelay: '0.1s' }}>
          <Star size={32} color="var(--accent-primary)" style={{ margin: '0 auto 0.5rem auto' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Lvl {userLevel}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Current Level</p>
          <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'var(--bg-secondary)', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>
            {rank.title} ({rank.english})
          </div>
        </div>
        
        <div className="glass-panel animate-pop-in" style={{ padding: '1.5rem', textAlign: 'center', animationDelay: '0.2s' }}>
          <Flame size={32} color="var(--accent-warning)" style={{ margin: '0 auto 0.5rem auto' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{streak}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Day Streak</p>
        </div>
        
        <div className="glass-panel animate-pop-in" style={{ padding: '1.5rem', textAlign: 'center', animationDelay: '0.3s' }}>
          <Zap size={32} color="var(--accent-success)" style={{ margin: '0 auto 0.5rem auto' }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{exp}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total EXP</p>
        </div>
      </div>

      <div className="glass-panel animate-pop-in" style={{ padding: '1.5rem', animationDelay: '0.4s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Trophy color="var(--accent-primary)" />
          <h3 style={{ margin: 0 }}>Achievements</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(ACHIEVEMENT_DATA).map(([id, data]) => {
            const isUnlocked = achievements && achievements.includes(id);
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: isUnlocked ? 'var(--bg-secondary)' : 'transparent', border: '1px solid', borderColor: isUnlocked ? 'var(--accent-primary)' : 'var(--border-color)', borderRadius: '12px', opacity: isUnlocked ? 1 : 0.5 }}>
                <div style={{ background: isUnlocked ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-glass)', padding: '0.75rem', borderRadius: '50%' }}>
                  {isUnlocked ? data.icon : <Medal size={24} color="var(--text-secondary)" />}
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.25rem', color: isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{data.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{data.desc}</p>
                </div>
                {isUnlocked && <div style={{ marginLeft: 'auto', color: 'var(--accent-success)', fontSize: '0.8rem', fontWeight: 'bold' }}>Unlocked!</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-panel animate-pop-in" style={{ padding: '1.5rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Medal color="var(--accent-primary)" />
          <h3 style={{ margin: 0 }}>Category Progress</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array.from(new Set(vocabData.map(v => v.category).filter(Boolean))).map(cat => {
            const total = vocabData.filter(v => v.category === cat).length || 1;
            const done = (categoryProgress && categoryProgress[cat]) || 0;
            const pct = Math.min(100, Math.round((done / total) * 100));
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{cat}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{done}/{total} ({pct}%)</div>
                  </div>
                  <div style={{ height: 8, background: 'var(--bg-glass)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#8b5cf6,#10b981)' }} />
                  </div>
                </div>
                <Link to={`/learn/vocab/${encodeURIComponent(cat)}`} className="glass-panel" style={{ padding: '0.5rem 0.75rem', textDecoration: 'none' }}>Practice</Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
