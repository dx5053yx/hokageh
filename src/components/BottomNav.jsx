import { Home, Book, Trophy, User, Library as LibraryIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: <Home size={24} />, label: 'Home' },
    { path: '/learn/kana', icon: <Book size={24} />, label: 'Learn' },
    { path: '/library', icon: <LibraryIcon size={24} />, label: 'Library' },
    { path: '/leaderboard', icon: <Trophy size={24} />, label: 'Rank' },
    { path: '/profile', icon: <User size={24} />, label: 'Profile' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '1rem 0.5rem',
      paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
      zIndex: 1000,
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              background: 'transparent',
              transition: 'color 0.3s ease',
            }}
          >
            {item.icon}
            <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
