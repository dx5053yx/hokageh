import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Flashcard from '../components/Flashcard';
import BadgeModal from '../components/BadgeModal';
import useStore from '../store/useStore';
import { generateQuizOptions, createBossQuestions } from '../utils/quizHelpers';
import kanaData from '../data/kana.json';
import vocabData from '../data/vocab.json';
import kanjiData from '../data/kanji.json';
import grammarData from '../data/grammar.json';
import { Heart, Zap, Clock, ShieldAlert } from 'lucide-react';

const getAnswerKey = (type) => {
  if (type === 'vocab' || type === 'kanji') return 'meaning';
  if (type === 'grammar') return 'particle';
  return 'romaji';
};

export default function BossBattle() {
  const navigate = useNavigate();
  const moduleProgress = useStore((s) => s.moduleProgress);
  const endBossBattle = useStore((s) => s.endBossBattle);

  const [questions, setQuestions] = useState([]);
  const [pos, setPos] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // stores the actual answer string
  const [options, setOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [sessionState, setSessionState] = useState('playing');

  const timerRef = useRef(null);
  const heartsRef = useRef(3);
  const correctRef = useRef(0);
  const [showBadge, setShowBadge] = useState(false);
  const [badgeInfo, setBadgeInfo] = useState(null);

  useEffect(() => { heartsRef.current = hearts; }, [hearts]);
  useEffect(() => { correctRef.current = correct; }, [correct]);

  useEffect(() => {
    const q = createBossQuestions({ moduleProgress, datasets: { kanaData, vocabData, kanjiData, grammarData }, n: 10 });
    setQuestions(q);
    setPos(0);
    setHearts(3);
    heartsRef.current = 3;
    setCorrect(0);
    correctRef.current = 0;
    setTimeLeft(15);
    setSessionState('playing');
  }, [moduleProgress]);

  useEffect(() => {
    if (sessionState !== 'playing') return;
    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, sessionState]);

  const triggerConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;
    const colors = ['#8b5cf6', '#ec4899', '#10b981'];
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const playSound = (freq, dur = 0.2) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0.06;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + dur);
      o.stop(ctx.currentTime + dur);
    } catch (e) { /* ignore */ }
  };

  useEffect(() => {
    const entry = questions && questions.length > 0 ? questions[pos] : null;
    if (!entry) return;
    const answerKey = getAnswerKey(entry.type);
    const dataSet = entry.type === 'vocab' ? vocabData : entry.type === 'kanji' ? kanjiData : entry.type === 'grammar' ? grammarData : kanaData;
    setOptions(generateQuizOptions(dataSet, entry.item, answerKey));
    setSelectedAnswer(null);
  }, [questions, pos]);

  const advance = (won, correctCount) => {
    setTimeout(() => {
      const next = pos + 1;
      if (next >= questions.length || (won !== undefined)) finishBattle(won, correctCount);
      else setPos(next);
    }, 800);
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null || sessionState !== 'playing') return;
    const entry = questions[pos];
    if (!entry) return;
    const answerKey = getAnswerKey(entry.type);
    const isCorrect = answer === entry.item[answerKey];

    setSelectedAnswer(answer); // store actual string for highlighting
    clearInterval(timerRef.current);

    if (isCorrect) {
      playSound(880);
      correctRef.current += 1;
      setCorrect(correctRef.current);
      const next = pos + 1;
      setTimeout(() => {
        if (next >= questions.length) finishBattle(true, correctRef.current);
        else setPos(next);
      }, 800);
    } else {
      playSound(220, 0.3);
      const newHearts = heartsRef.current - 1;
      setHearts(newHearts);
      heartsRef.current = newHearts;
      setTimeout(() => {
        if (newHearts <= 0) finishBattle(false, correctRef.current);
        else {
          const next = pos + 1;
          if (next >= questions.length) finishBattle(false, correctRef.current);
          else setPos(next);
        }
      }, 800);
    }
  };

  const handleTimeout = () => {
    setSelectedAnswer('__timeout__');
    const newHearts = heartsRef.current - 1;
    setHearts(newHearts);
    heartsRef.current = newHearts;
    playSound(220, 0.3);
    setTimeout(() => {
      if (newHearts <= 0) finishBattle(false, correctRef.current);
      else {
        const next = pos + 1;
        if (next >= questions.length) finishBattle(false, correctRef.current);
        else setPos(next);
      }
    }, 800);
  };

  const finishBattle = (explicitWin, correctCount) => {
    const total = questions.length || 10;
    const finalCorrect = correctCount !== undefined ? correctCount : correctRef.current;
    const win = explicitWin === true && finalCorrect >= Math.ceil(total * 0.5);
    setSessionState(win ? 'summary' : 'lost');
    endBossBattle({ correct: finalCorrect, total, win, badgeId: win ? 'boss_victor' : undefined });
    if (win) {
      triggerConfetti();
      playSound(880);
      setBadgeInfo({ title: 'Boss Victor', desc: 'You defeated the boss — special badge earned! +200 EXP' });
      setShowBadge(true);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="animate-pop-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ShieldAlert size={64} color="var(--accent-warning)" style={{ margin: '0 auto 1rem auto' }} />
        <h2>Not Enough Data</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Complete some lessons first to unlock the Boss Battle!</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  if (sessionState === 'lost') {
    return (
      <div className="animate-pop-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ShieldAlert size={80} color="var(--accent-danger)" style={{ margin: '0 auto 1rem auto' }} />
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Boss Defeated You!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Score: {correct} / {questions.length}</p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Don't worry — review your weak areas and try again!</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="glass-panel" style={{ padding: '1rem 2rem', fontWeight: 'bold' }} onClick={() => navigate('/')}>Return Home</button>
          <button className="btn-primary" onClick={() => navigate('/learn/kana')}>Practice More</button>
        </div>
      </div>
    );
  }

  if (sessionState === 'summary') {
    const accuracy = Math.round((correct / questions.length) * 100);
    return (
      <div className="animate-pop-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <BadgeModal open={showBadge} onClose={() => setShowBadge(false)} badge={badgeInfo} />
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Boss Vanquished!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Incredible work, warrior!</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <Zap size={32} color="var(--accent-warning)" style={{ margin: '0 auto 0.5rem auto' }} />
            <h3>+200</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>EXP Earned</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-success)', marginBottom: '0.5rem' }}>{accuracy}%</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Accuracy</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
              {[...Array(3)].map((_, i) => <Heart key={i} size={20} fill={i < hearts ? "var(--accent-danger)" : "transparent"} color="var(--accent-danger)" />)}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Hearts Left</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="glass-panel" style={{ padding: '1rem 2rem', fontWeight: 'bold' }} onClick={() => navigate('/')}>Return Home</button>
          <button className="btn-primary" onClick={() => navigate('/profile')}>View Profile</button>
        </div>
      </div>
    );
  }

  const entry = questions[pos];
  const answerKey = getAnswerKey(entry.type);
  const questionText = entry.type === 'grammar' ? entry.item.quizQuestion : (entry.item.character || entry.item.word);

  return (
    <div style={{ padding: '1rem 2rem 5rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <BadgeModal open={showBadge} onClose={() => setShowBadge(false)} badge={badgeInfo} />
      
      {/* HUD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0.5rem 1rem', background: 'var(--bg-glass)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {[...Array(3)].map((_, i) => (
            <Heart key={i} size={24} fill={i < hearts ? "var(--accent-danger)" : "transparent"} color="var(--accent-danger)" />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft <= 5 ? 'var(--accent-danger)' : 'var(--text-secondary)', fontWeight: 'bold' }}>
          <Clock size={18} /> {timeLeft}s
        </div>
        <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>Q {pos + 1}/{questions.length}</div>
      </div>

      {/* Timer Bar */}
      <div style={{ height: 8, background: 'var(--bg-glass)', borderRadius: 8, overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div style={{ height: '100%', width: `${(timeLeft / 15) * 100}%`, background: timeLeft <= 5 ? 'var(--accent-danger)' : 'linear-gradient(90deg,#8b5cf6,#10b981)', transition: 'width 0.25s linear' }} />
      </div>

      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>⚔️ Boss Battle — Hard Mode</h2>

      <Flashcard front={questionText} back={entry.item[answerKey]} onPlayAudio={() => { if ('speechSynthesis' in window) { const utter = new SpeechSynthesisUtterance(questionText); utter.lang = 'ja-JP'; window.speechSynthesis.speak(utter); } }} disableFlip={true} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
        {options.map((opt) => (
          <button 
            key={opt} 
            onClick={() => handleAnswer(opt)} 
            disabled={selectedAnswer !== null}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              background: selectedAnswer !== null
                ? (opt === entry.item[answerKey] ? 'var(--accent-success)' : (selectedAnswer === opt ? 'var(--accent-danger)' : 'var(--bg-glass)'))
                : 'var(--bg-glass)',
              border: `2px solid ${selectedAnswer === opt ? 'transparent' : 'var(--border-color)'}`,
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: selectedAnswer !== null ? 'default' : 'pointer',
              opacity: selectedAnswer !== null && opt !== entry.item[answerKey] && selectedAnswer !== opt ? 0.4 : 1
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
