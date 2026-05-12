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
import { Zap, Clock } from 'lucide-react';

export default function BossBattle() {
  const navigate = useNavigate();
  const moduleProgress = useStore((s) => s.moduleProgress);
  const endBossBattle = useStore((s) => s.endBossBattle);
  const addExp = useStore((s) => s.addExp);

  const [questions, setQuestions] = useState([]);
  const [pos, setPos] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [options, setOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const [sessionState, setSessionState] = useState('playing'); // playing, summary, lost

  const timerRef = useRef(null);
  const [showBadge, setShowBadge] = useState(false);
  const [badgeInfo, setBadgeInfo] = useState(null);

  useEffect(() => {
    const q = createBossQuestions({ moduleProgress, datasets: { kanaData, vocabData, kanjiData, grammarData }, n: 10 });
    setQuestions(q);
    setPos(0);
    setHearts(3);
    setCorrect(0);
    setTimeLeft(15);
    setSessionState('playing');
  }, [moduleProgress]);

  useEffect(() => {
    // Setup timer for each question
    if (sessionState !== 'playing') return;
    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleWrong();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos, sessionState]);

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;
    const colors = ['#8b5cf6', '#ec4899', '#10b981'];

    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const playWinSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.value = 0.06;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.25);
      o.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // ignore if audio context blocked
    }
  };

  useEffect(() => {
    // Build options for current question
    const entry = questions && questions.length > 0 ? questions[pos] : null;
    if (!entry) return;

    let dataSet = kanaData;
    let answerKey = 'romaji';
    if (entry.type === 'vocab') { dataSet = vocabData; answerKey = 'meaning'; }
    else if (entry.type === 'kanji') { dataSet = kanjiData; answerKey = 'meaning'; }
    else if (entry.type === 'grammar') { dataSet = grammarData; answerKey = 'particle'; }

    setOptions(generateQuizOptions(dataSet, entry.item, answerKey));
    setSelectedAnswer(null);
  }, [questions, pos]);

  const handleCorrect = () => {
    setSelectedAnswer(true);
    setCorrect((c) => c + 1);
    clearInterval(timerRef.current);
    setTimeout(() => {
      const next = pos + 1;
      if (next >= questions.length) finishBattle(true);
      else setPos(next);
    }, 700);
  };

  const handleWrong = () => {
    setSelectedAnswer(false);
    clearInterval(timerRef.current);
    const newHearts = hearts - 1;
    setHearts(newHearts);
    setTimeout(() => {
      if (newHearts <= 0) {
        finishBattle(false);
      } else {
        const next = pos + 1;
        if (next >= questions.length) finishBattle(false);
        else setPos(next);
      }
    }, 700);
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null || sessionState !== 'playing') return;
    const entry = questions[pos];
    if (!entry) return;

    let answerKey = 'romaji';
    if (entry.type === 'vocab') answerKey = 'meaning';
    else if (entry.type === 'kanji') answerKey = 'meaning';
    else if (entry.type === 'grammar') answerKey = 'particle';

    if (answer === entry.item[answerKey]) handleCorrect();
    else handleWrong();
  };

  const finishBattle = (explicitWin) => {
    const total = questions.length || 10;
    const win = explicitWin || (correct >= Math.ceil(total * 0.7) && hearts > 0);
    setSessionState(win ? 'summary' : 'lost');
    // Record and award via store
    endBossBattle({ correct, total, win, badgeId: win ? 'boss_victor' : undefined });
    if (win) {
      // celebration + modal
      triggerConfetti();
      playWinSound();
      setBadgeInfo({ title: 'Boss Victor', desc: 'You defeated the boss — special badge earned! +200 EXP' });
      setShowBadge(true);
    }
  };

  if (!questions || questions.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Not enough data to start Boss Battle.</div>;
  }

  if (sessionState === 'lost') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Boss Defeated You...</h1>
        <p>Don't worry — try again to earn the special badge.</p>
        <button className="btn-primary" onClick={() => navigate('/learn/kana')}>Return to Practice</button>
      </div>
    );
  }

  if (sessionState === 'summary') {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <BadgeModal open={showBadge} onClose={() => setShowBadge(false)} badge={badgeInfo} />
        <h1>Boss Battle Result</h1>
        <p style={{ marginTop: '1rem' }}>Correct: {correct} / {questions.length}</p>
        <p style={{ marginTop: '0.25rem' }}>Status: {correct >= Math.ceil(questions.length * 0.7) ? 'Victory!' : 'Defeated'}</p>
        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn-primary" onClick={() => navigate('/')}>Return Home</button>
          <button className="glass-panel" style={{ marginLeft: '1rem' }} onClick={() => navigate('/learn/vocab')}>Review Vocab</button>
        </div>
      </div>
    );
  }

  const entry = questions[pos];
  let questionText = entry ? (entry.type === 'grammar' ? entry.item.quizQuestion : (entry.item.character || entry.item.word)) : '';
  let answerKey = entry && entry.type === 'vocab' ? 'meaning' : (entry && entry.type === 'grammar' ? 'particle' : 'romaji');

  return (
    <div style={{ padding: '1rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <BadgeModal open={showBadge} onClose={() => setShowBadge(false)} badge={badgeInfo} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>Hearts: {hearts}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock />{timeLeft}s</div>
        <div>Q {pos + 1} / {questions.length}</div>
      </div>
      <div style={{ height: 8, background: 'var(--bg-glass)', borderRadius: 8, overflow: 'hidden', marginBottom: '1rem' }}>
        <div style={{ height: '100%', width: `${(timeLeft / 15) * 100}%`, background: 'linear-gradient(90deg,#8b5cf6,#10b981)', transition: 'width 0.25s linear' }} />
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Boss Battle — Hard Mode</h2>

      <Flashcard front={questionText} back={entry.item[answerKey]} onPlayAudio={() => { if ('speechSynthesis' in window) { const utter = new SpeechSynthesisUtterance(questionText); utter.lang = 'ja-JP'; window.speechSynthesis.speak(utter); } }} disableFlip={false} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
        {options.map((opt) => (
          <button key={opt} onClick={() => handleAnswer(opt)} className={selectedAnswer !== null ? '' : ''} style={{ padding: '1rem', borderRadius: '12px' }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
