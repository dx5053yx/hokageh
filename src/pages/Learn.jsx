import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Flashcard from '../components/Flashcard';
import useStore from '../store/useStore';
import { generateQuizOptions } from '../utils/quizHelpers';
import { Heart, Zap, Clock, ShieldAlert } from 'lucide-react';

import kanaData from '../data/kana.json';
import vocabData from '../data/vocab.json';
import kanjiData from '../data/kanji.json';
import grammarData from '../data/grammar.json';

export default function Learn() {
  const { type, category } = useParams();
  const decodedCategory = category ? decodeURIComponent(category) : null;
  const navigate = useNavigate();
  const { addExp, incrementStreak, updateModuleProgress, moduleProgress, updateQuestProgress, unlockAchievement, addWeakItem, removeWeakItem, categoryProgress, updateCategoryProgress } = useStore();

  const [sessionQueue, setSessionQueue] = useState([]); // [{ item, source: 'base'|'weak', dataIndex? }]
  const [queuePos, setQueuePos] = useState(0);

  // RPG Session State
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [sessionExp, setSessionExp] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [startTime] = useState(Date.now());
  const [sessionState, setSessionState] = useState('playing'); // playing, gameover, summary
  const [expPopup, setExpPopup] = useState(null); // { amount, combo }
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shakingAnswer, setShakingAnswer] = useState(null);
  const [kanjiQuestionType, setKanjiQuestionType] = useState('meaning');

  // Reset session when route type or category changes
  useEffect(() => {
    setHearts(3);
    setCombo(0);
    setSessionExp(0);
    setCorrectAnswers(0);
    setQuestionsAnswered(0);
    setSessionState('playing');
    setSessionQueue([]);
    setQueuePos(0);
    setSelectedAnswer(null);
    setIsAnimating(false);
    setShakingAnswer(null);
    setExpPopup(null);
  }, [type, category]);
  const confettiRef = useRef(null);

  // Cleanup confetti on unmount
  useEffect(() => {
    return () => {
      if (confettiRef.current) {
        cancelAnimationFrame(confettiRef.current);
      }
    };
  }, []);
  
  // Determine dataset
  const filteredVocabData = useMemo(() => {
    if (type !== 'vocab') return vocabData;
    if (!decodedCategory) return vocabData;
    return vocabData.filter(item => (item.category || '').toLowerCase() === decodedCategory.toLowerCase());
  }, [type, decodedCategory]);

  let currentData = kanaData;
  let questionKey = 'character';
  let answerKey = 'romaji';
  let title = 'Kana Practice';
  let baseExp = 5;

  if (type === 'vocab') {
    currentData = filteredVocabData;
    questionKey = 'word';
    answerKey = 'meaning';
    title = decodedCategory ? `Vocabulary — ${decodedCategory}` : 'Vocabulary';
    baseExp = 10;
  } else if (type === 'kanji') {
    currentData = kanjiData;
    questionKey = 'character';
    answerKey = kanjiQuestionType;
    title = `Kanji (${kanjiQuestionType.toUpperCase()})`;
    baseExp = 20;
  } else if (type === 'grammar') {
    currentData = grammarData;
    questionKey = 'quizQuestion';
    answerKey = 'particle';
    title = 'Grammar Quiz';
    baseExp = 15;
  }

  const buildSessionQueue = useCallback(() => {
    if (!currentData || currentData.length === 0) {
      setSessionQueue([]);
      setQueuePos(0);
      return;
    }

    const state = useStore.getState();
    const start = category ? (state.categoryProgress && state.categoryProgress[decodedCategory] ? state.categoryProgress[decodedCategory] : 0) : (state.moduleProgress[type] || 0);
    const baseNeeded = 20;
    const baseSlice = currentData.slice(start, start + baseNeeded);

    const q = baseSlice.map((it, idx) => ({ item: it, source: 'base', dataIndex: start + idx }));

    const weakPool = (state.weakItems || []).filter(w => w.__type === type);
    if (weakPool.length > 0) {
      for (let pos = 3; pos < q.length; pos += 4) {
        const w = weakPool[Math.floor(Math.random() * weakPool.length)];
        q.splice(pos, 0, { item: w, source: 'weak' });
      }
    }

    while (q.length < 10 && weakPool.length > 0) {
      const w = weakPool[Math.floor(Math.random() * weakPool.length)];
      q.push({ item: w, source: 'weak' });
    }

    setSessionQueue(q);
    setQueuePos(0);
  }, [type, category, decodedCategory, currentData]);

  const currentEntry = sessionQueue && sessionQueue.length > 0 ? sessionQueue[queuePos] : null;
  const currentItem = currentEntry ? currentEntry.item : null;

  const progress = decodedCategory ? (categoryProgress && categoryProgress[decodedCategory] ? categoryProgress[decodedCategory] : 0) : (moduleProgress[type] || 0);

  // Build queue only when type or category changes
  useEffect(() => {
    buildSessionQueue();
  }, [buildSessionQueue]);

  useEffect(() => {
    if (type === 'kanji' && currentItem) {
      const types = ['meaning'];
      if (currentItem.onyomi && currentItem.onyomi !== '-') types.push('onyomi');
      if (currentItem.kunyomi && currentItem.kunyomi !== '-') types.push('kunyomi');
      setKanjiQuestionType(types[Math.floor(Math.random() * types.length)]);
    }
  }, [queuePos, type, currentItem]);

  useEffect(() => {
    if (currentItem && sessionState === 'playing') {
      const newOptions = generateQuizOptions(currentData, currentItem, answerKey);
      setOptions(newOptions);
      setSelectedAnswer(null);
    }
  }, [queuePos, currentData, currentItem, answerKey, sessionState]);

  if (sessionState === 'playing' && !currentItem) {
    return (
      <div className="animate-pop-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ShieldAlert size={64} color="var(--accent-success)" style={{ margin: '0 auto 1rem auto' }} />
        <h2>Module Complete!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You've finished all available questions in this module. Great job!</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  const playSound = (freq, dur = 0.15) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + dur);
      o.stop(ctx.currentTime + dur);
    } catch (e) { /* ignore */ }
  };

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window && currentItem) {
      const textToSpeak = type === 'grammar' ? currentItem.example : currentItem[questionKey];
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#8b5cf6', '#ec4899', '#10b981'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#8b5cf6', '#ec4899', '#10b981'] });
      if (Date.now() < end) confettiRef.current = requestAnimationFrame(frame);
    };
    frame();
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null || sessionState !== 'playing') return;
    
    setSelectedAnswer(answer);
    
    if (answer === currentItem[answerKey]) {
      // Correct
      playSound(880);
      const newCombo = combo + 1;
      setCombo(newCombo);
      
      let multiplier = 1;
      if (newCombo >= 5) multiplier = 2.0;
      else if (newCombo >= 3) multiplier = 1.5;
      
      const gainedExp = Math.round(baseExp * multiplier);
      setSessionExp(prev => prev + gainedExp);
      addExp(gainedExp);
      const newCorrectAnswers = correctAnswers + 1;
      setCorrectAnswers(newCorrectAnswers);
      
      setExpPopup({ amount: gainedExp, combo: newCombo });
      setIsAnimating(true);
      // Advance progress: only if going forward (prevents regression from weak items)
      if (currentEntry && currentEntry.source === 'base') {
        if (!decodedCategory) {
          updateModuleProgress(type, currentEntry.dataIndex + 1);
        } else {
          try {
            const filteredIndex = currentData.findIndex((item) => item.id === currentEntry.item.id);
            if (filteredIndex !== -1) {
              updateCategoryProgress(decodedCategory, filteredIndex + 1);
            }
          } catch (e) {}
        }
      }
      updateQuestProgress(type, 1);
      // If answered correctly, remove from weak items (user mastered it)
      try {
        const itemKey = currentItem.id || currentItem.character || currentItem.word || currentItem.particle;
        if (itemKey) removeWeakItem(itemKey, type);
      } catch (e) {}
      
      if (questionsAnswered === 0 && correctAnswers === 0) unlockAchievement('first_blood');
      
      setTimeout(() => {
        setIsAnimating(false);
        setExpPopup(null);
        
        const nextQuestionsAnswered = questionsAnswered + 1;
        setQuestionsAnswered(nextQuestionsAnswered);
        
        if (nextQuestionsAnswered >= 10 || queuePos >= sessionQueue.length - 1) {
          // Finish Session
          setSessionState('summary');
          incrementStreak();
          triggerConfetti();

          if (newCorrectAnswers === nextQuestionsAnswered && hearts === 3) {
            unlockAchievement('speed_run');
          }

          const state = useStore.getState();
          const kanaProg = state.moduleProgress.kana || 0;
          const vocabProg = state.moduleProgress.vocab || 0;
          if (kanaProg >= kanaData.length && vocabProg >= Math.ceil(vocabData.length / 2)) {
            state.unlockChapter('kanji');
          }
        } else {
          setQueuePos((p) => p + 1);
        }
      }, 1000);
      
    } else {
      // Wrong
      playSound(220, 0.25);
      setCombo(0);
      const newHearts = hearts - 1;
      setHearts(newHearts);
      setShakingAnswer(answer);

      // Add to weak items for SRS
      try { addWeakItem && addWeakItem(currentItem, type); } catch (e) {}

      setTimeout(() => setShakingAnswer(null), 400);

      if (newHearts === 0) {
        setTimeout(() => setSessionState('gameover'), 800);
      } else {
        setTimeout(() => {
          // Requeue this question to appear later and advance
          setSessionQueue((prev) => [...prev, currentEntry]);
          setSelectedAnswer(null);
          setQueuePos((p) => p + 1);
        }, 1000);
      }
    }
  };

  if (sessionState === 'gameover') {
    return (
      <div className="animate-pop-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <ShieldAlert size={80} color="var(--accent-danger)" style={{ margin: '0 auto 1rem auto' }} />
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Game Over!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.2rem' }}>You ran out of hearts. Dust yourself off and try again!</p>
        <button className="btn-primary" onClick={() => {
          setHearts(3);
          setCombo(0);
          setSessionExp(0);
          setCorrectAnswers(0);
          setQuestionsAnswered(0);
          setSessionState('playing');
          setSelectedAnswer(null);
          setIsAnimating(false);
          setShakingAnswer(null);
          setExpPopup(null);
          buildSessionQueue();
          setQueuePos(0);
        }}>Retry Session</button>
      </div>
    );
  }

  if (sessionState === 'summary') {
    const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
    const timeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
    
    return (
      <div className="animate-pop-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Session Complete!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Excellent work, Senpai!</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <Zap size={32} color="var(--accent-warning)" style={{ margin: '0 auto 0.5rem auto' }} />
            <h3>+{sessionExp}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>EXP Earned</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-success)', marginBottom: '0.5rem' }}>{accuracy}%</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Accuracy</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <Clock size={32} color="var(--accent-primary)" style={{ margin: '0 auto 0.5rem auto' }} />
            <h3>{timeSpentSeconds}s</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Time Spent</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="glass-panel" style={{ padding: '1rem 2rem', fontWeight: 'bold' }} onClick={() => navigate('/')}>Return Home</button>
          {progress < currentData.length - 1 && (
            <button className="btn-primary" onClick={() => {
              setHearts(3);
              setCombo(0);
              setSessionExp(0);
              setCorrectAnswers(0);
              setQuestionsAnswered(0);
              setSessionState('playing');
              setSelectedAnswer(null);
              setIsAnimating(false);
              setShakingAnswer(null);
              setExpPopup(null);
              buildSessionQueue();
              setQueuePos(0);
            }}>Next Session</button>
          )}
          {/* Show Boss Battle option when user completed the module (global progress) and not in a category session */}
          {!category && (moduleProgress[type] || 0) >= currentData.length && (
            <button className="btn-primary" onClick={() => navigate('/boss')}>Challenge Boss</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem 2rem 5rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      {/* RPG HUD */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0.5rem 1rem', background: 'var(--bg-glass)', borderRadius: '12px' }}>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {[...Array(3)].map((_, i) => (
            <Heart key={i} size={24} fill={i < hearts ? "var(--accent-danger)" : "transparent"} color="var(--accent-danger)" />
          ))}
        </div>
        <div style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>
          {Math.min(questionsAnswered + 1, 10)} / 10
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: combo >= 3 ? 'var(--accent-warning)' : 'var(--text-primary)' }}>
          <Zap size={20} fill={combo >= 3 ? "var(--accent-warning)" : "transparent"} />
          <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>x{combo}</span>
        </div>
      </div>
      
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{title}</h2>
      
      <Flashcard 
        front={currentItem[questionKey]} 
        back={currentItem[answerKey]} 
        onPlayAudio={handlePlayAudio}
        disableFlip={true}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '2rem' }}>
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={selectedAnswer !== null && opt !== currentItem[answerKey]}
            className={shakingAnswer === opt ? 'animate-shake' : ''}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              background: selectedAnswer === opt 
                ? (opt === currentItem[answerKey] ? 'var(--accent-success)' : 'var(--accent-danger)')
                : (selectedAnswer !== null && opt === currentItem[answerKey] ? 'var(--accent-success)' : 'var(--bg-glass)'),
              border: `2px solid ${selectedAnswer === opt ? 'transparent' : 'var(--border-color)'}`,
              color: 'white',
              transition: 'all 0.3s ease',
              cursor: selectedAnswer !== null ? 'default' : 'pointer'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {isAnimating && expPopup && (
        <div className="animate-pop-in" style={{ position: 'fixed', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999, textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--accent-warning)', textShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
            +{expPopup.amount} EXP
          </div>
          {expPopup.combo >= 3 && (
            <div style={{ fontSize: '1.5rem', color: 'var(--accent-primary)', marginTop: '0.5rem', fontWeight: 'bold' }}>
              Combo {expPopup.combo}x!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
