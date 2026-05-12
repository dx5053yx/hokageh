import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Flashcard from '../components/Flashcard';
import useStore from '../store/useStore';
import { generateQuizOptions } from '../utils/quizHelpers';

import kanaData from '../data/kana.json';
import vocabData from '../data/vocab.json';
import kanjiData from '../data/kanji.json';

export default function Learn() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { addExp, incrementStreak, updateModuleProgress, moduleProgress } = useStore();

  const [currentIndex, setCurrentIndex] = useState(moduleProgress[type] || 0);

  // Reset index when route type changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(0);
  }, [type]);

  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shakingAnswer, setShakingAnswer] = useState(null);
  const [kanjiQuestionType, setKanjiQuestionType] = useState('meaning');
  const confettiRef = useRef(null);

  // Cleanup confetti on unmount
  useEffect(() => {
    return () => {
      if (confettiRef.current) {
        cancelAnimationFrame(confettiRef.current);
      }
    };
  }, []);
  
  // Determine which dataset and keys to use based on dynamic route param
  let currentData = kanaData;
  let questionKey = 'character';
  let answerKey = 'romaji';
  let title = 'Hiragana & Katakana Practice';

  if (type === 'vocab') {
    currentData = vocabData;
    questionKey = 'word';
    answerKey = 'meaning';
    title = 'Vocabulary Practice';
  } else if (type === 'kanji') {
    currentData = kanjiData;
    questionKey = 'character';
    answerKey = kanjiQuestionType; // dynamic: meaning, onyomi, kunyomi
    title = `Kanji N5 Practice (${kanjiQuestionType.toUpperCase()})`;
  }

  const currentItem = currentData && currentData.length > 0 ? currentData[currentIndex] : null;

  // Randomize kanji question type
  useEffect(() => {
    if (type === 'kanji') {
      const types = ['meaning', 'onyomi', 'kunyomi'];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setKanjiQuestionType(types[Math.floor(Math.random() * types.length)]);
    }
  }, [currentIndex, type]);

  useEffect(() => {
    if (currentItem) {
      // Generate new options whenever the current item changes
      const newOptions = generateQuizOptions(currentData, currentItem, answerKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOptions(newOptions);
      setSelectedAnswer(null);
    }
  }, [currentIndex, currentData, currentItem, answerKey]);

  // Handle case where route is invalid or data is missing
  if (!currentItem) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Data not found for {type}</div>;
  }

  const handlePlayAudio = () => {
    if ('speechSynthesis' in window) {
      // For vocab or kana, we use the character/word. For kanji, the character.
      const textToSpeak = currentItem[questionKey];
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    } else {
      console.log('Text-to-speech not supported');
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    // eslint-disable-next-line react-hooks/purity
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8b5cf6', '#ec4899', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8b5cf6', '#ec4899', '#10b981']
      });

      if (Date.now() < end) {
        confettiRef.current = requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answer);
    
    if (answer === currentItem[answerKey]) {
      addExp(10);
      setIsAnimating(true);
      updateModuleProgress(type, currentIndex + 1);
      
      setTimeout(() => {
        setIsAnimating(false);
        if (currentIndex < currentData.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // Completed lesson
          incrementStreak();
          triggerConfetti();
          setTimeout(() => {
            navigate('/');
          }, 3500); // Wait for confetti to finish before navigating back
        }
      }, 1000);
    } else {
      // Wrong answer
      setShakingAnswer(answer);
      setTimeout(() => setShakingAnswer(null), 400);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingBottom: '100px' }}>
      <h2 style={{ marginBottom: '2rem' }}>{title}</h2>
      
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

      {isAnimating && (
        <div className="animate-pop-in" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '5rem', zIndex: 9999 }}>
          ⭐ +10 EXP
        </div>
      )}
    </div>
  );
}
