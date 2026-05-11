import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { User, Settings, Flame, Star, Zap, LogIn, LogOut } from 'lucide-react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import '../styles/index.css';

export default function Profile() {
  const { userLevel, exp, streak, unlockedChapters } = useStore();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <header className="glass-panel animate-pop-in" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        
        {user ? (
          <>
            <img src={user.photoURL} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '1rem', boxShadow: 'var(--shadow-glow)' }} />
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{user.displayName}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{user.email}</p>
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
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Current Level</p>
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
        <h3 style={{ marginBottom: '1rem' }}>Achievements</h3>
        <p style={{ color: 'var(--text-secondary)' }}>You have unlocked {unlockedChapters.length} modules.</p>
      </div>
    </div>
  );
}
