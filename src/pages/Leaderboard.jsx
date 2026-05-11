import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, User } from 'lucide-react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import useStore from '../store/useStore';
import '../styles/index.css';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserExp = useStore(state => state.exp);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('exp', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        
        const fetchedUsers = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() });
        });
        
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy color="gold" size={24} />;
    if (index === 1) return <Medal color="silver" size={24} />;
    if (index === 2) return <Award color="#cd7f32" size={24} />;
    return null;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingBottom: '100px' }}>
      <Trophy size={48} color="var(--accent-warning)" style={{ marginBottom: '1rem' }} />
      <h1 className="text-gradient" style={{ marginBottom: '0.5rem' }}>Global Rank</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Top 10 Players Worldwide</p>
      
      {loading ? (
        <div className="animate-pulse" style={{ color: 'var(--accent-primary)' }}>Loading Top Players...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {users.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No players found. Be the first to login and earn EXP!</p>
          ) : (
            users.map((user, index) => (
              <div 
                key={user.id}
                className="glass-panel animate-pop-in"
                style={{ 
                  padding: '1rem 1.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  background: user.exp === currentUserExp ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-glass)',
                  border: user.exp === currentUserExp ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-secondary)', width: '30px' }}>
                    #{index + 1}
                  </span>
                  
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <User size={20} color="var(--text-secondary)" />
                    </div>
                  )}

                  <span style={{ fontSize: '1.2rem', fontWeight: user.exp === currentUserExp ? 'bold' : 'normal', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                    {user.displayName} {user.exp === currentUserExp ? '(You)' : ''}
                  </span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--accent-success)', fontWeight: 'bold', display: 'block' }}>{user.exp} EXP</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Lvl {user.userLevel}</span>
                  </div>
                  <div style={{ width: '24px' }}>{getRankIcon(index)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
