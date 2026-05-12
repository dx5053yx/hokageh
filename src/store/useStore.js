import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      userLevel: 1,
      streak: 0,
      exp: 0,
      lastStreakDate: null,
      currentUser: null,
      moduleProgress: { kana: 0, vocab: 0, kanji: 0 },
      unlockedChapters: ['kana', 'vocab'],
      
      setCurrentUser: (user) => set({ currentUser: user }),
      updateModuleProgress: (module, index) => set((state) => ({
        moduleProgress: { ...state.moduleProgress, [module]: index }
      })),
      addExp: (amount) => set((state) => {
        const newExp = state.exp + amount;
        // Level up every 100 EXP
        const newLevel = Math.floor(newExp / 100) + 1;
        return { 
          exp: newExp, 
          userLevel: newLevel > state.userLevel ? newLevel : state.userLevel 
        };
      }),
      incrementStreak: () => set((state) => {
        const today = new Date().toDateString();
        if (state.lastStreakDate !== today) {
          return { streak: state.streak + 1, lastStreakDate: today };
        }
        return {}; // Do nothing if already incremented today
      }),
      resetStreak: () => set({ streak: 0, lastStreakDate: null }),
      unlockChapter: (chapterId) => set((state) => ({
        unlockedChapters: state.unlockedChapters.includes(chapterId) 
          ? state.unlockedChapters 
          : [...state.unlockedChapters, chapterId]
      })),
      syncFromFirestore: (data) => set((state) => ({
        userLevel: data.userLevel ?? state.userLevel,
        streak: data.streak ?? state.streak,
        exp: data.exp ?? state.exp,
        lastStreakDate: data.lastStreakDate ?? state.lastStreakDate,
        moduleProgress: data.moduleProgress ?? state.moduleProgress,
        unlockedChapters: data.unlockedChapters ?? state.unlockedChapters
      })),
    }),
    {
      name: 'nihonz-storage', // unique name
    }
  )
);

export default useStore;
