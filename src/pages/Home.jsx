import { useEffect } from 'react';
import { BookOpen, Star, Flame, Trophy, Lock, Target, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LessonCard from '../components/LessonCard';
import useStore from '../store/useStore';
import heroImage from '../assets/hero_image.png';
import kanaData from '../data/kana.json';
import vocabData from '../data/vocab.json';
import kanjiData from '../data/kanji.json';
import { getRank } from '../utils/ranks';
import '../styles/index.css';

export default function Home() {
  const navigate = useNavigate();
  const { userLevel, streak, moduleProgress = { kana: 0, vocab: 0, kanji: 0 }, unlockedChapters, dailyQuests, generateDailyQuests } = useStore();

  useEffect(() => {
    generateDailyQuests();
  }, [generateDailyQuests]);

  const kanaProgress = Math.min(100, Math.round(((moduleProgress.kana || 0) / kanaData.length) * 100) || 0);
  const vocabProgress = Math.min(100, Math.round(((moduleProgress.vocab || 0) / vocabData.length) * 100) || 0);
  const kanjiProgress = Math.min(100, Math.round(((moduleProgress.kanji || 0) / kanjiData.length) * 100) || 0);
  
  // Grammar has 15 items right now
  const grammarProgress = Math.min(100, Math.round(((moduleProgress.grammar || 0) / 15) * 100) || 0);

  const rank = getRank(userLevel);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      
      {/* Hero Banner */}
      <div className="glass-panel animate-pop-in" style={{ marginBottom: '2rem', borderRadius: '24px', overflow: 'hidden', position: 'relative', height: '200px' }}>
        <img src={heroImage} alt="Study Vibe" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', background: 'linear-gradient(to top, rgba(15, 23, 42, 1), transparent)', padding: '2rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Okaeri, {rank.romaji}! 🎌</h1>
        </div>
      </div>

      <header className="glass-panel animate-pop-in" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)' }}>Ready to continue your Japanese journey?</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-warning)' }}>
            <Flame size={20} />
            <span style={{ fontWeight: 'bold' }}>{streak} Day Streak</span>
          </div>
          <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
            <Star size={20} />
            <span style={{ fontWeight: 'bold' }}>Lvl {userLevel} ({rank.title})</span>
          </div>
        </div>
      </header>

      {/* Daily Quests */}
      {dailyQuests && dailyQuests.length > 0 && (
        <section className="animate-pop-in" style={{ marginBottom: '2rem', animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Target color="var(--accent-warning)" />
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Daily Quests</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {dailyQuests.map((quest) => (
              <div key={quest.id} className="glass-panel" style={{ padding: '1.25rem', opacity: quest.completed ? 0.6 : 1, position: 'relative', overflow: 'hidden' }}>
                {quest.completed && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(16, 185, 129, 0.1)', zIndex: 0 }}></div>
                )}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0 }}>{quest.desc}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-warning)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      <Gift size={14} /> +{quest.expReward}
                    </div>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div style={{ height: '100%', width: `${(quest.progress / quest.target) * 100}%`, background: quest.completed ? 'var(--accent-success)' : 'var(--accent-primary)', transition: 'width 0.5s ease' }}></div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'right' }}>
                    {quest.progress} / {quest.target}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 style={{ marginBottom: '1.5rem' }}>Your Modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          <LessonCard
            title="Hiragana & Katakana"
            description="Master the basic alphabets of Japanese."
            progress={kanaProgress}
            isUnlocked={true}
            icon={<BookOpen size={24} />}
            iconColorClass="var(--accent-primary)"
            iconBgClass="rgba(139, 92, 246, 0.2)"
            progressColorClass="var(--accent-success)"
            buttonText={kanaProgress === 100 ? "Review Kana" : "Continue"}
            animationDelay="0.1s"
            onClick={() => navigate('/learn/kana')}
          />

          <LessonCard
            title="Basic Grammar & Particles"
            description="Learn how to structure sentences."
            progress={grammarProgress}
            isUnlocked={true}
            icon={<Star size={24} />}
            iconColorClass="var(--accent-warning)"
            iconBgClass="rgba(245, 158, 11, 0.2)"
            progressColorClass="var(--accent-warning)"
            buttonText={grammarProgress === 100 ? "Review Quiz" : "Take Quiz"}
            secondaryButtonText="Read Theory"
            animationDelay="0.2s"
            onClick={() => navigate('/learn/grammar')}
            onSecondaryClick={() => navigate('/theory')}
          />

          <LessonCard
            title="Basic Vocab (JLPT N5)"
            description="Learn essential daily words."
            progress={vocabProgress}
            isUnlocked={true}
            icon={<Trophy size={24} />}
            iconColorClass="var(--accent-secondary)"
            iconBgClass="rgba(236, 72, 153, 0.2)"
            progressColorClass="linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))"
            buttonText={vocabProgress === 100 ? "Review Vocab" : "Continue"}
            animationDelay="0.3s"
            onClick={() => navigate('/learn/vocab')}
          />

          <LessonCard
            title="Kanji N5"
            description="Learn 100 basic kanji characters."
            progress={kanjiProgress}
            isUnlocked={unlockedChapters.includes('kanji')}
            icon={unlockedChapters.includes('kanji') ? <BookOpen size={24} /> : <Lock size={24} />}
            iconColorClass="var(--accent-primary)"
            iconBgClass="rgba(255, 255, 255, 0.1)"
            progressColorClass="var(--accent-primary)"
            buttonText={kanjiProgress === 100 ? "Review Kanji" : "Start Kanji"}
            animationDelay="0.4s"
            onClick={() => {
              if (unlockedChapters.includes('kanji')) {
                navigate('/learn/kanji');
              } else {
                alert("Please complete 100% Kana and 50% Vocab to unlock Kanji!");
              }
            }}
          />

        </div>
      </section>
    </div>
  );
}
