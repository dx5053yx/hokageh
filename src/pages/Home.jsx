import React from 'react';
import { BookOpen, Star, Flame, Trophy, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonCard from '../components/LessonCard';
import useStore from '../store/useStore';
import heroImage from '../assets/hero_image.png';
import '../styles/index.css';

export default function Home() {
  const navigate = useNavigate();
  const { streak, userLevel, exp } = useStore();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Hero Banner */}
      <div className="glass-panel animate-pop-in" style={{ marginBottom: '2rem', borderRadius: '24px', overflow: 'hidden', position: 'relative', height: '200px' }}>
        <img src={heroImage} alt="Study Vibe" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'linear-gradient(to top, rgba(15, 23, 42, 1), transparent)', padding: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Okaeri, Senpai! 🎌</h1>
        </div>
      </div>

      <header className="glass-panel animate-pop-in" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)' }}>Ready to continue your Japanese journey?</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-warning)' }}>
            <Flame size={20} />
            <span style={{ fontWeight: 'bold' }}>{streak} Day Streak</span>
          </div>
          <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
            <Star size={20} />
            <span style={{ fontWeight: 'bold' }}>Lvl {userLevel}</span>
          </div>
        </div>
      </header>

      <section>
        <h2 style={{ marginBottom: '1.5rem' }}>Your Modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          <LessonCard
            title="Hiragana & Katakana"
            description="Master the basic alphabets of Japanese."
            progress={100}
            isUnlocked={true}
            icon={<BookOpen size={24} />}
            iconColorClass="var(--accent-primary)"
            iconBgClass="rgba(139, 92, 246, 0.2)"
            progressColorClass="var(--accent-success)"
            buttonText="Review Kana"
            animationDelay="0.1s"
            onClick={() => navigate('/learn/kana')}
          />

          <LessonCard
            title="Basic Grammar & Particles"
            description="Learn how to structure sentences."
            progress={0}
            isUnlocked={true}
            icon={<Star size={24} />}
            iconColorClass="var(--accent-warning)"
            iconBgClass="rgba(245, 158, 11, 0.2)"
            buttonText="Read Theory"
            animationDelay="0.2s"
            onClick={() => navigate('/theory')}
          />

          <LessonCard
            title="Basic Vocab (JLPT N5)"
            description="Learn essential daily words."
            progress={35}
            isUnlocked={true}
            icon={<Trophy size={24} />}
            iconColorClass="var(--accent-secondary)"
            iconBgClass="rgba(236, 72, 153, 0.2)"
            progressColorClass="linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))"
            buttonText="Continue Lesson"
            animationDelay="0.3s"
            onClick={() => navigate('/learn/vocab')}
          />

          <LessonCard
            title="Kanji N5"
            description="Learn 100 basic kanji characters."
            progress={10}
            isUnlocked={true}
            icon={<Lock size={24} />}
            iconColorClass="var(--accent-primary)"
            iconBgClass="rgba(255, 255, 255, 0.1)"
            progressColorClass="var(--accent-primary)"
            buttonText="Start Kanji"
            animationDelay="0.4s"
            onClick={() => navigate('/learn/kanji')}
          />

        </div>
      </section>
    </div>
  );
}
