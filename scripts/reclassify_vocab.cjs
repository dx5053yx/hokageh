const fs = require('fs');
const path = 'src/data/vocab.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const backupPath = path + '.bak.' + Date.now();
fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');

const lower = (s) => (s || '').toLowerCase();

const bodyKW = ['head','hand','foot','leg','eye','ear','mouth','nose','finger','arm','back','neck','toe','shoulder','stomach','waist','hip','throat','face','tooth','teeth','skin','hair','knee'];
const clothingKW = ['coat','jacket','shirt','pants','trouser','skirt','dress','shoe','shoes','sock','socks','hat','cap','glove','gloves','belt','scarf','sweater','top','uniform','kimono','underwear','suit','apron','pajama','vest'];
const natureKW = ['rain','sea','mountain','river','tree','sky','sun','wind','weather','beach','forest','flower','season','leaf','snow','cloud','lake','ocean','island','field','pond','valley','garden','beach'];
const animalsKW = ['dog','cat','bird','cow','horse','pig','fish','chicken','rabbit','monkey','bear','sheep','elephant','lion','tiger','whale','animal','insect','crab','butterfly'];
const schoolKW = ['school','teacher','student','class','desk','library','study','exam','homework','university','college','classroom','pupil'];
const houseKW = ['apartment','apartment (abbr.)','room','kitchen','door','window','house','home','bed','table','chair','bathroom','toilet','entrance','living room','bedroom','apartment'];
const adjKW = ['hot','cold','warm','new','old','bright','cheerful','good','bad','generous','sweet','thin','thick','heavy','light','big','small','cheap','expensive','beautiful','ugly','easy','difficult','kind','busy','noisy','quiet','hard','soft','strong','weak','sharp','quick','slow','fast','early','late'];

function includesAny(s, list) {
  if (!s) return false;
  for (const kw of list) {
    if (s.indexOf(kw) !== -1) return true;
  }
  return false;
}

function classify(entry) {
  const meaning = lower(entry.meaning || '');
  const word = entry.word || '';
  // Check kanji/hiragana for common body parts
  const bodyKanji = /(手|足|頭|目|耳|口|鼻|指|肩|顔|腰|背|歯|膝|胸|顎|腕|腿|首)/;
  if (includesAny(meaning, bodyKW) || bodyKanji.test(word)) return 'Body Parts';
  if (includesAny(meaning, clothingKW)) return 'Clothing';
  if (includesAny(meaning, animalsKW)) return 'Animals';
  if (includesAny(meaning, houseKW)) return 'House';
  if (includesAny(meaning, schoolKW)) return 'School';
  if (includesAny(meaning, natureKW)) return 'Nature';
  // Heuristic for adjectives: ends with い (e.g., 新しい, 暑い) or english meaning contains adjective keywords
  if (/(い)$/.test(word) || includesAny(meaning, adjKW)) return 'Adjectives & Adverbs';
  return 'Nouns & Others';
}

const statsBefore = {};
for (const e of data) { statsBefore[e.category] = (statsBefore[e.category] || 0) + 1; }

let moved = 0;
const statsAfter = {};

for (const entry of data) {
  if (entry.category === 'Nouns & Others') {
    const newCat = classify(entry);
    if (newCat !== entry.category) {
      entry.category = newCat;
      moved++;
    }
  }
  statsAfter[entry.category] = (statsAfter[entry.category] || 0) + 1;
}

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
console.log('Backup saved to', backupPath);
console.log('Moved', moved, 'entries from Nouns & Others to new categories.');
console.log('Before distribution:');
console.log(statsBefore);
console.log('After distribution:');
console.log(statsAfter);
