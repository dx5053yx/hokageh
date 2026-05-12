import { useEffect, useState, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import useStore from './store/useStore'
import Home from './pages/Home'
import Learn from './pages/Learn'
import Theory from './pages/Theory'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Library from './pages/Library'
import BottomNav from './components/BottomNav'

// NotFound Component
const NotFound = () => (
  <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
    <h1 className="text-gradient" style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
    <p style={{ color: 'var(--text-secondary)' }}>Oops! Senpai got lost...</p>
  </div>
);

function App() {
  const syncFromFirestore = useStore((state) => state.syncFromFirestore);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const debounceTimer = useRef(null);

  useEffect(() => {
    let unsubscribeStore = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch existing data
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          syncFromFirestore(docSnap.data());
        } else {
          // Initialize user in firestore with local data
          const state = useStore.getState();
          await setDoc(userRef, {
            displayName: user.displayName || 'Guest Senpai',
            photoURL: user.photoURL || '',
            userLevel: state.userLevel,
            exp: state.exp,
            streak: state.streak,
            lastStreakDate: state.lastStreakDate || null,
            moduleProgress: state.moduleProgress || { kana: 0, vocab: 0, kanji: 0 },
            unlockedChapters: state.unlockedChapters
          });
        }

        setLoadingAuth(false);

        // Subscribe to local changes and push to Firestore with Debounce (2 seconds)
        unsubscribeStore = useStore.subscribe((state) => {
          if (debounceTimer.current) clearTimeout(debounceTimer.current);
          
          debounceTimer.current = setTimeout(() => {
            setDoc(userRef, {
              displayName: user.displayName || 'Guest Senpai',
              photoURL: user.photoURL || '',
              userLevel: state.userLevel,
              exp: state.exp,
              streak: state.streak,
              lastStreakDate: state.lastStreakDate || null,
              moduleProgress: state.moduleProgress || { kana: 0, vocab: 0, kanji: 0 },
              unlockedChapters: state.unlockedChapters
            }, { merge: true });
          }, 2000);
        });

      } else {
        setLoadingAuth(false);
        if (unsubscribeStore) unsubscribeStore();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeStore) unsubscribeStore();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [syncFromFirestore, setCurrentUser]);

  if (loadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="animate-pulse" style={{ fontSize: '3rem' }}>🎌</div>
        <p style={{ color: 'var(--text-secondary)' }}>Loading NihonZ...</p>
      </div>
    );
  }

  return (
    <div className="app-container" style={{ paddingBottom: '80px' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn/:type" element={<Learn />} />
        <Route path="/theory" element={<Theory />} />
        <Route path="/library" element={<Library />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App
