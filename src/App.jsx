import { Routes, Route } from 'react-router-dom'
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
