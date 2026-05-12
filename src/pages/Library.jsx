import { useState } from 'react';
import { Search } from 'lucide-react';
import kanaData from '../data/kana.json';
import kanjiData from '../data/kanji.json';
import vocabData from '../data/vocab.json';
import '../styles/index.css';

export default function Library() {
  const [activeTab, setActiveTab] = useState('hiragana');
  const [searchQuery, setSearchQuery] = useState('');

  const filterData = (data, keys) => {
    if (!searchQuery) return data;
    const lowerQuery = searchQuery.toLowerCase();
    return data.filter(item => 
      keys.some(key => item[key] && item[key].toLowerCase().includes(lowerQuery))
    );
  };

  const hiraganaList = filterData(kanaData.filter(k => k.type.includes('hiragana')), ['character', 'romaji']);
  const katakanaList = filterData(kanaData.filter(k => k.type.includes('katakana')), ['character', 'romaji']);
  const filteredKanji = filterData(kanjiData, ['character', 'meaning', 'onyomi', 'kunyomi']);
  const filteredVocab = filterData(vocabData, ['word', 'romaji', 'meaning']);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Library (Kamus)</h1>
      
      {/* Search Bar */}
      <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', borderRadius: '12px' }}>
        <Search size={20} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder={`Search ${activeTab}...`} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-primary)', 
            width: '100%', 
            outline: 'none',
            fontSize: '1rem'
          }} 
        />
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {['hiragana', 'katakana', 'kanji', 'vocab'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: activeTab === tab ? 'var(--accent-primary)' : 'var(--border-color)',
              background: activeTab === tab ? 'var(--accent-primary)' : 'var(--bg-glass)',
              color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              fontWeight: 'bold',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Kana Grid (Hiragana & Katakana) */}
      {(activeTab === 'hiragana' || activeTab === 'katakana') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem' }}>
          {(activeTab === 'hiragana' ? hiraganaList : katakanaList).map(item => (
            <div key={item.id} className="glass-panel" style={{ padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{item.character}</span>
              <span style={{ color: 'var(--accent-secondary)' }}>{item.romaji}</span>
            </div>
          ))}
        </div>
      )}

      {/* Kanji List */}
      {activeTab === 'kanji' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredKanji.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No kanji found.</p>}
          {filteredKanji.map(item => (
            <div key={item.id} className="glass-panel animate-pop-in" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-primary)', minWidth: '60px', textAlign: 'center' }}>
                {item.character}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{item.meaning} <span style={{ fontSize: '0.8rem', background: 'var(--bg-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginLeft: '0.5rem' }}>{item.level}</span></h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}><strong>Onyomi:</strong> {item.onyomi}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}><strong>Kunyomi:</strong> {item.kunyomi}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vocab List */}
      {activeTab === 'vocab' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredVocab.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No vocabulary found.</p>}
          {filteredVocab.map(item => (
            <div key={item.id} className="glass-panel animate-pop-in" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-success)', marginBottom: '0.25rem' }}>{item.word}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{item.romaji}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{item.meaning}</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-warning)' }}>{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
