import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      userLevel: 3,
      streak: 5,
      exp: 120,
      unlockedChapters: ['kana', 'basic_vocab'],
      
      addExp: (amount) => set((state) => {
        const newExp = state.exp + amount;
        // Level up every 100 EXP
        const newLevel = Math.floor(newExp / 100) + 1;
        return { 
          exp: newExp, 
          userLevel: newLevel > state.userLevel ? newLevel : state.userLevel 
        };
      }),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
      unlockChapter: (chapterId) => set((state) => ({
        unlockedChapters: state.unlockedChapters.includes(chapterId) 
          ? state.unlockedChapters 
          : [...state.unlockedChapters, chapterId]
      })),
    }),
    {
      name: 'nihonz-storage', // unique name
    }
  )
);

export default useStore;
