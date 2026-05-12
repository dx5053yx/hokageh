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
        const today = new Date();
        const todayStr = today.toDateString();
        
        if (state.lastStreakDate === todayStr) return {}; // Already incremented today

        if (state.lastStreakDate) {
          const lastDate = new Date(state.lastStreakDate);
          today.setHours(0,0,0,0);
          lastDate.setHours(0,0,0,0);
          const diffTime = today - lastDate;
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 1) {
            // Missed a day! Reset to 1 (they just finished a lesson today)
            return { streak: 1, lastStreakDate: todayStr };
          }
        }
        
        return { streak: state.streak + 1, lastStreakDate: todayStr };
      }),
      checkStreak: () => set((state) => {
        if (state.lastStreakDate) {
          const today = new Date();
          const lastDate = new Date(state.lastStreakDate);
          today.setHours(0,0,0,0);
          lastDate.setHours(0,0,0,0);
          const diffTime = today - lastDate;
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 1 && state.streak > 0) {
            return { streak: 0 }; // Missed a day, reset streak to 0
          }
        }
        return {};
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
