/**
 * Generates random multiple choice options
 * @param {Array} fullData - The complete dataset for the quiz type
 * @param {Object} currentItem - The current question item
 * @param {String} answerKey - The object key that holds the correct answer (e.g. 'romaji', 'meaning')
 * @returns {Array} Shuffled array of 4 options
 */
export const generateQuizOptions = (fullData, currentItem, answerKey) => {
  let newOptions = [currentItem[answerKey]];
  
  // Extract all unique answers to avoid infinite loops if data is small, and filter out '-'
  const allUniqueAnswers = [...new Set(fullData.map(item => item[answerKey]).filter(val => val && val !== '-'))];
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
