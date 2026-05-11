import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import '../styles/index.css';

export default function Flashcard({ front, back, onPlayAudio }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip state when moving to next question
  useEffect(() => {
    setIsFlipped(false);
  }, [front]);

  const handleAudioClick = (e) => {
    e.stopPropagation(); // prevent flipping when clicking audio
    if (onPlayAudio) {
      onPlayAudio();
    }
  };

  return (
    <div 
      className="flashcard-container" 
      onClick={() => setIsFlipped(!isFlipped)}
      style={{
        perspective: '1000px',
        width: '100%',
        height: '300px',
        cursor: 'pointer',
        marginBottom: '2rem'
      }}
    >
      <div 
        className="flashcard-inner" 
        style={{
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative'
        }}
      >
        {/* Front */}
        <div 
          className="glass-panel" 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '4rem',
            fontWeight: 'bold'
          }}
        >
          {front}
          <button 
            onClick={handleAudioClick}
            style={{
              position: 'absolute',
              bottom: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              padding: '0.75rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Volume2 size={24} />
          </button>
        </div>

        {/* Back */}
        <div 
          className="glass-panel" 
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '2rem',
            color: 'var(--accent-primary)',
            background: 'var(--bg-secondary)'
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
