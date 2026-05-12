export function getRank(level) {
  if (level >= 1 && level <= 5) {
    return { title: '見習い', romaji: 'Minarai', english: 'Apprentice' };
  } else if (level >= 6 && level <= 10) {
    return { title: '学生', romaji: 'Gakusei', english: 'Student' };
  } else if (level >= 11 && level <= 20) {
    return { title: '先輩', romaji: 'Senpai', english: 'Senior' };
  } else if (level >= 21 && level <= 30) {
    return { title: '武士', romaji: 'Bushi', english: 'Warrior' };
  } else if (level >= 31 && level <= 40) {
    return { title: '忍者', romaji: 'Ninja', english: 'Master' };
  } else if (level >= 41 && level <= 50) {
    return { title: '大名', romaji: 'Daimyo', english: 'Lord' };
  } else {
    return { title: '将軍', romaji: 'Shogun', english: 'Legend' };
  }
}
