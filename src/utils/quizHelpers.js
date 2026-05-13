/**
 * Generates random multiple choice options
 * @param {Array} fullData - The complete dataset for the quiz type
 * @param {Object} currentItem - The current question item
 * @param {String} answerKey - The object key that holds the correct answer (e.g. 'romaji', 'meaning')
 * @returns {Array} Shuffled array of 4 options
 */
export const generateQuizOptions = (fullData, currentItem, answerKey) => {
  const correctAnswer = currentItem[answerKey];
  let newOptions = [correctAnswer];
  
  // Extract all unique answers, filter out '-' and empty
  const allUniqueAnswers = [...new Set(
    fullData.map(item => item[answerKey]).filter(val => val && val !== '-')
  )];
  
  // Guard: if no valid answers exist or only the correct one, return what we have
  if (allUniqueAnswers.length <= 1) return newOptions;
  
  const maxOptions = Math.min(4, allUniqueAnswers.length);
  
  while (newOptions.length < maxOptions) {
    const randomAnswer = allUniqueAnswers[Math.floor(Math.random() * allUniqueAnswers.length)];
    if (!newOptions.includes(randomAnswer)) {
      newOptions.push(randomAnswer);
    }
  }
  
  // Shuffle options
  return newOptions.sort(() => Math.random() - 0.5);
};

/**
 * Create a mixed list of boss questions from available module progress and datasets
 * @param {Object} params
 * @param {Object} params.moduleProgress - { kana, vocab, kanji, grammar }
 * @param {Object} params.datasets - { kanaData, vocabData, kanjiData, grammarData }
 * @param {Number} params.n - number of questions (default 10)
 * @returns {Array} Array of { type, item }
 */
export const createBossQuestions = ({ moduleProgress = {}, datasets = {}, n = 10 } = {}) => {
  const { kanaData = [], vocabData = [], kanjiData = [], grammarData = [] } = datasets;
  const pool = [];

  const addRange = (arr, limit, type) => {
    const count = Math.min(arr.length, Math.max(0, Math.floor(limit || 0)));
    for (let i = 0; i < count; i++) {
      pool.push({ type, item: arr[i] });
    }
  };

  addRange(kanaData, moduleProgress.kana || 0, 'kana');
  addRange(vocabData, moduleProgress.vocab || 0, 'vocab');
  addRange(kanjiData, moduleProgress.kanji || 0, 'kanji');
  addRange(grammarData, moduleProgress.grammar || 0, 'grammar');

  // Fallback: if pool empty, seed with first few kana items
  if (pool.length === 0) {
    for (let i = 0; i < Math.min(10, kanaData.length); i++) pool.push({ type: 'kana', item: kanaData[i] });
  }

  // Shuffle pool and pick up to n unique items
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const selected = [];
  const seen = new Set();
  for (let i = 0; i < pool.length && selected.length < n; i++) {
    const key = `${pool[i].type}-${pool[i].item.id ?? i}`;
    if (!seen.has(key)) {
      seen.add(key);
      selected.push(pool[i]);
    }
  }

  return selected;
};
