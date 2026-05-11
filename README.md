# 🎌 NihonZ: Platform Belajar Bahasa Jepang untuk Gen-Z

## 📖 Deskripsi Proyek
NihonZ adalah aplikasi pembelajaran bahasa Jepang interaktif yang dirancang khusus untuk Gen-Z dan pemula. Fokus utama aplikasi ini adalah membantu pengguna mencapai tingkat kelulusan **JLPT N5 dan N4** dengan metode yang *engaging*, *bite-sized*, dan tidak membosankan.

### 🎯 Target & Ruang Lingkup Materi (N5 - N4)
- **Huruf:** Penguasaan Hiragana & Katakana.
- **Kanji:** ~200 Kanji dasar (mencakup level N5 & N4).
- **Kosakata (Kotoba):** ~1500 kosakata esensial untuk percakapan sehari-hari.
- **Tata Bahasa (Bunpou):** Partikel dasar hingga pola kalimat kompleks N4.
- **Pendengaran & Percakapan (Choukai & Kaiwa):** Kemampuan memahami dan merespons percakapan kasual dan formal dasar.

### 🎨 Desain & Vibe (Gen-Z Oriented)
- **Aesthetic:** Modern, Dark Mode default, Glassmorphism, warna aksen neon/pastel.
- **Gamification:** Sistem EXP, *streak*, *badge/achievements*, dan animasi *reward* saat menyelesaikan *lesson*.
- **Micro-learning:** Sesi belajar singkat (5-10 menit per sesi) ala Duolingo namun dengan *feel* RPG atau *visual novel*.

---

## 🛠️ Tech Stack
- **Framework:** React + Vite (Cepat, modern, ringan)
- **Styling:** Vanilla CSS (dengan CSS Variables) atau TailwindCSS (jika diminta).
- **State Management:** Zustand atau Context API (untuk menyimpan progres, skor, dan *streak*).
- **Routing:** React Router DOM.
- **Media/Audio:** Web Audio API atau HTML5 Audio untuk pelafalan (*native speaker* atau TTS berkualitas).

---

## 📋 Workflow & Rencana Pengembangan (Untuk Agen AI)

Berikut adalah urutan kerja (workflow) yang harus diikuti oleh agen AI untuk membangun aplikasi ini dari nol:

### Phase 1: Inisialisasi Proyek & Arsitektur Dasar
1. **Setup Vite & React:**
   - Jalankan `npm create vite@latest . -- --template react` (atau `react-ts` jika menggunakan TypeScript).
   - Bersihkan file *boilerplate* (`App.css`, file SVG bawaan).
2. **Setup Struktur Direktori:**
   ```text
   src/
   ├── assets/       # Gambar, icon, audio
   ├── components/   # Komponen UI (Button, Card, ProgressBar)
   ├── data/         # Data JSON (Hiragana, Kanji, Vocab)
   ├── pages/        # Halaman utama (Home, Lesson, Quiz, Profile)
   ├── store/        # State management (Zustand/Context)
   ├── styles/       # File CSS global dan variabel warna
   └── utils/        # Helper function (pengacak soal, format waktu)
   ```
3. **Setup Sistem Desain & CSS:**
   - Buat `index.css` dengan variabel warna *dark mode* dan font modern (misal: 'Inter', 'Outfit').

### Phase 2: Struktur Data Pembelajaran (Database Lokal)
1. **Buat file JSON untuk silabus:**
   - `kana.json`: Data Hiragana & Katakana dengan huruf, romaji, dan path audio.
   - `kanji.json`: Daftar 200 Kanji beserta *onyomi*, *kunyomi*, dan arti.
   - `vocab.json`: 1500 kosakata dibagi per kategori/bab.
   - `grammar.json`: Penjelasan tata bahasa dan partikel beserta contoh kalimat.

### Phase 3: Pengembangan Komponen UI Inti
1. **Komponen Navigasi:** Navbar/Bottom Navigation Bar yang responsif.
2. **Kartu Pelajaran (Lesson Card):** Menampilkan bab yang tersedia, progres persentase, dan status terkunci/terbuka.
3. **Sistem Kuis Interaktif (Flashcard & Multiple Choice):**
   - Komponen Flashcard yang bisa di-*flip*.
   - Tombol pilihan ganda dengan efek *hover* yang responsif.
   - Animasi benar/salah (warna hijau/merah dengan efek *shake* jika salah).

### Phase 4: Integrasi Halaman & Logika Aplikasi (Routing & State)
1. **Halaman Dashboard/Home:** Menampilkan sapaan, level saat ini, *streak*, dan rekomendasi pelajaran selanjutnya.
2. **Halaman Materi:** Tempat membaca teori (tata bahasa/partikel) dengan layout yang mudah dibaca (tipografi rapi).
3. **Halaman Kuis/Latihan:** Mengambil data acak dari JSON dan mencatat skor pengguna.
4. **State Management:** Implementasi penyimpanan lokal (LocalStorage) agar progres belajar (EXP, level, *unlocked chapters*) tidak hilang saat *refresh*.

### Phase 5: Fitur Audio & Percakapan
1. Tambahkan tombol "Dengarkan" pada setiap komponen kosakata/kanji.
2. Integrasikan audio file atau fitur *Text-to-Speech* browser untuk pelafalan bahasa Jepang.

### Phase 6: Polishing & Animasi (WOW Factor)
1. Tambahkan mikro-animasi pada setiap interaksi tombol.
2. Buat animasi selebrasi (seperti konfeti) ketika pengguna menyelesaikan level atau mencapai skor sempurna.
3. Pastikan aplikasi 100% responsif di perangkat *mobile* (Mobile-First Approach).

---

## 🤖 Instruksi untuk Agen AI Selanjutnya

Jika Anda adalah agen AI yang membaca dokumen ini untuk melanjutkan pengembangan:
1. **Jangan mulai dengan setup backend kompleks.** Gunakan data statis (JSON) terlebih dahulu untuk MVP (*Minimum Viable Product*).
2. **Prioritaskan UI/UX yang *stunning*.** Gunakan CSS modern, hindari desain kaku.
3. **Eksekusi secara bertahap:** Mulai dari Phase 1. Jangan langsung melompat ke Phase 3 tanpa memastikan arsitektur Vite dan CSS berjalan dengan baik.
4. Jika ada perintah untuk menginisiasi proyek, gunakan perintah terminal: `npx create-vite@latest ./ --template react` (atau sesuaikan dengan kebutuhan spesifik).
5. **Setiap membuat komponen, pastikan bersifat *reusable*.**
