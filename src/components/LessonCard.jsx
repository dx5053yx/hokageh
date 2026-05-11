
import ProgressBar from './ProgressBar';

export default function LessonCard({ 
  title, 
  description, 
  progress = 0, 
  isUnlocked = true, 
  icon, 
  iconColorClass = 'var(--accent-primary)',
  iconBgClass = 'rgba(139, 92, 246, 0.2)',
  progressColorClass = 'var(--accent-primary)',
  buttonText = 'Continue',
  animationDelay = '0s',
  onClick
}) {
  return (
    <div className="glass-panel animate-pop-in" style={{ padding: '1.5rem', animationDelay: animationDelay }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ backgroundColor: iconBgClass, padding: '0.75rem', borderRadius: '12px', color: iconColorClass }}>
          {icon}
        </div>
        <span style={{ 
          backgroundColor: isUnlocked ? (progress === 100 ? 'var(--accent-success)' : 'rgba(255, 255, 255, 0.1)') : 'rgba(255, 255, 255, 0.05)', 
          color: isUnlocked ? (progress === 100 ? '#fff' : 'var(--text-secondary)') : 'var(--text-secondary)', 
          padding: '0.25rem 0.75rem', 
          borderRadius: '999px', 
          fontSize: '0.8rem', 
          fontWeight: 'bold' 
        }}>
          {isUnlocked ? (progress === 100 ? 'Completed' : (progress > 0 ? 'In Progress' : 'Unlocked')) : 'Locked'}
        </span>
      </div>
      <h3 style={{ marginBottom: '0.5rem', color: isUnlocked ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{description}</p>
      
      {isUnlocked && <ProgressBar progress={progress} colorClass={progressColorClass} />}
      
      <button 
        className="btn-primary" 
        style={{ 
          width: '100%', 
          opacity: isUnlocked ? 1 : 0.5,
          cursor: isUnlocked ? 'pointer' : 'not-allowed'
        }}
        disabled={!isUnlocked}
        onClick={onClick}
      >
        {isUnlocked ? buttonText : 'Locked'}
      </button>
    </div>
  );
}
