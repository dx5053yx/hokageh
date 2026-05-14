<div align="center">

# 🎌 NihonZ

**Platform belajar bahasa Jepang bergaya RPG untuk Gen-Z**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5-brown?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Demo](#) · [Screenshots](#-screenshots) · [Fitur](#-fitur) · [Instalasi](#-instalasi) · [Kontribusi](#-kontribusi)

</div>

---

## ✨ Tentang NihonZ

NihonZ adalah aplikasi web belajar bahasa Jepang yang menggabungkan sistem pembelajaran spaced repetition (SRS) dengan mekanisme RPG seperti EXP, streak, achievements, dan boss battle. Dibuat dengan vibe dark mode + glassmorphism, cocok buat yang mau mulai belajar Jepang dari nol sampai level JLPT N5.

---

## 🚀 Fitur

### 📚 Konten Pembelajaran
| Modul | Jumlah | Keterangan |
|-------|--------|------------|
| Hiragana & Katakana | 208 karakter | Quiz romaji & karakter |
| Kosakata (Vocab) | 718 kata | 21 kategori (Food, Nature, Verbs, dll) |
| Kanji N5 | 100 kanji | Quiz meaning, onyomi, & kunyomi |
| Grammar & Partikel | 15 pola | Quiz pilihan ganda kontekstual |

### 🎮 Gamification
- **Sistem EXP & Level** — dapat EXP setiap jawaban benar, naik level setiap 100 EXP
- **Streak Harian** — belajar setiap hari untuk jaga streak; dilindungi oleh Streak Shield
- **Combo Multiplier** — jawab berturut-turut untuk bonus EXP (1.5x kombo 3, 2x kombo 5)
- **Achievements** — unlock badge seperti `first_blood`, `speed_run`, `week_warrior`
- **Boss Battle** — mode hard dengan timer 15 detik per soal, mix semua modul
- **Daily Chest** — buka chest setiap hari untuk bonus EXP atau Streak Shield
- **Daily Quests** — misi harian seperti "jawab 20 kana dengan benar"
- **Leaderboard** — ranking global berdasarkan EXP via Firestore

### 🧠 Spaced Repetition (SRS)
- Item yang salah dijawab masuk ke **Weak Items pool**
- Weak items otomatis muncul kembali di sesi berikutnya (setiap 4 soal sekali)
- Item yang berhasil dijawab benar dihapus dari weak items

### 🎯 Fitur Lainnya
- **Category Practice** — latihan kosakata per kategori (Colors, Food, Verbs, dll)
- **Library / Kamus** — referensi semua kana, kanji, dan vocab dengan search
- **Theory Page** — materi teori grammar & partikel
- **Audio TTS** — tombol dengarkan menggunakan Web Speech API (bahasa Jepang)
- **Cloud Sync** — progress tersimpan di Firestore dan sync antar device via Google login
- **Offline-first** — progress juga tersimpan di localStorage via Zustand persist

---

## 🛠️ Tech Stack

- **Frontend** — React 19 + Vite 8
- **Routing** — React Router DOM v7
- **State Management** — Zustand v5 (dengan `persist` middleware)
- **Backend/Auth** — Firebase v12 (Authentication + Firestore)
- **Styling** — Vanilla CSS dengan CSS Variables (dark mode, glassmorphism)
- **Animasi** — CSS animations + `canvas-confetti`
- **Icons** — Lucide React
- **Audio** — Web Audio API + Web Speech API (TTS)

---

## 📁 Struktur Proyek

```
src/
├── assets/
│   └── hero_image.png
├── components/
│   ├── BadgeModal.jsx      # Modal achievement/badge
│   ├── BottomNav.jsx       # Navigasi bawah (mobile-first)
│   ├── ErrorBoundary.jsx   # Error boundary global
│   ├── Flashcard.jsx       # Kartu soal (flippable)
│   ├── LessonCard.jsx      # Card modul di halaman home
│   └── ProgressBar.jsx     # Bar progress
├── data/
│   ├── grammar.json        # 15 pola grammar & partikel
│   ├── kana.json           # 208 hiragana & katakana
│   ├── kanji.json          # 100 kanji N5
│   └── vocab.json          # 718 kosakata, 21 kategori
├── pages/
│   ├── BossBattle.jsx      # Mode boss battle (timed)
│   ├── Home.jsx            # Dashboard utama
│   ├── Learn.jsx           # Sesi belajar / quiz
│   ├── Leaderboard.jsx     # Ranking global
│   ├── Library.jsx         # Kamus & referensi
│   ├── Profile.jsx         # Profil, achievements, category progress
│   └── Theory.jsx          # Materi teori grammar
├── store/
│   └── useStore.js         # Zustand store (semua state global)
├── styles/
│   └── index.css           # CSS variables, komponen global
├── utils/
│   ├── quizHelpers.js      # generateQuizOptions, createBossQuestions
│   └── ranks.js            # Sistem rank berdasarkan level
├── firebase.js             # Firebase initialization
└── App.jsx                 # Root component + routing
```

---

## ⚙️ Instalasi

### Prasyarat
- Node.js v18+
- Akun Firebase (untuk auth & cloud sync)

### 1. Clone repo

```bash
git clone https://github.com/username/nihonz.git
cd nihonz
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Firebase

Buat project baru di [Firebase Console](https://console.firebase.google.com/), lalu aktifkan:
- **Authentication** → Google Sign-in provider
- **Firestore Database** → mode production

Salin konfigurasi Firebase ke file `src/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

> ⚠️ Jangan commit `firebase.js` yang sudah berisi API key ke repo publik. Gunakan environment variables dan `.env` jika perlu.

### 4. Jalankan dev server

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### 5. Build untuk production

```bash
npm run build
```

---

## 🔥 Deploy ke Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # pilih dist/ sebagai public dir, SPA: yes
npm run build
firebase deploy
```

---

## 🗺️ Roadmap

- [ ] Tambah konten grammar & pola kalimat N4
- [ ] Mode listening (audio soal)
- [ ] Sistem review terjadwal (SRS interval sesungguhnya)
- [ ] Notifikasi streak harian (PWA push notification)
- [ ] Dark/light mode toggle
- [ ] Halaman statistik belajar (grafik progres mingguan)

---

## 🤝 Kontribusi

Pull request terbuka! Untuk perubahan besar, buka issue dulu ya.

```bash
# Fork repo, lalu:
git checkout -b feature/nama-fitur
git commit -m "feat: tambah fitur X"
git push origin feature/nama-fitur
# Buka Pull Request
```

---

## 📄 Lisensi

MIT © 2025 — bebas dipakai, dimodifikasi, dan didistribusikan.

---

<div align="center">

Dibuat dengan ☕ dan semangat belajar Jepang

**がんばって！**

</div>