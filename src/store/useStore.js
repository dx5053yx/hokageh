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
      moduleProgress: { kana: 0, vocab: 0, kanji: 0, grammar: 0 },
      categoryProgress: {},
      unlockedChapters: ['kana', 'vocab'],
      achievements: [],
      dailyQuests: [],
      lastQuestDate: null,
      inventory: { streakShields: 0 },
      weakItems: [], // { id/key, type, data }
      lastChestDate: null,
      bossBattles: [], // history of boss battles { time, correct, total, win }
      
      setCurrentUser: (user) => set({ currentUser: user }),
      updateModuleProgress: (module, index) => set((state) => ({
        moduleProgress: { ...state.moduleProgress, [module]: index }
      })),
      updateCategoryProgress: (category, index) => set((state) => ({
        categoryProgress: { ...state.categoryProgress, [category]: index }
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

        let newStreak = state.streak + 1;
        let newShields = state.inventory.streakShields;

        if (state.lastStreakDate) {
          const lastDate = new Date(state.lastStreakDate);
          today.setHours(0,0,0,0);
          lastDate.setHours(0,0,0,0);
          const diffTime = today - lastDate;
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 1) {
            // Missed a day! 
            if (state.inventory.streakShields > 0) {
              // Use a shield!
              newShields -= 1;
              // Keep the old streak but increment it as if they just returned
            } else {
              // Reset to 1 (they just finished a lesson today)
              newStreak = 1;
            }
          }
        }
        
        // Grant a shield every 7 days (7, 14, 21) if they just hit it
        if (newStreak > 0 && newStreak % 7 === 0) {
          newShields += 1;
        }
        
        return { 
          streak: newStreak, 
          lastStreakDate: todayStr,
          inventory: { ...state.inventory, streakShields: newShields }
        };
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
            if (state.inventory.streakShields > 0) {
              // Consume shield silently to protect streak until they return
              return { 
                inventory: { ...state.inventory, streakShields: state.inventory.streakShields - 1 },
                // We update lastStreakDate so it doesn't consume multiple shields for the same missed period
                lastStreakDate: new Date(lastDate.getTime() + (24 * 60 * 60 * 1000)).toDateString()
              };
            } else {
              return { streak: 0 }; // Missed a day, reset streak to 0
            }
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
      
      unlockAchievement: (achievementId) => set((state) => {
        if (state.achievements.includes(achievementId)) return {};
        // Bonus EXP for achievement
        const newExp = state.exp + 50;
        const newLevel = Math.floor(newExp / 100) + 1;
        return { 
          achievements: [...state.achievements, achievementId],
          exp: newExp,
          userLevel: newLevel > state.userLevel ? newLevel : state.userLevel
        };
      }),

      generateDailyQuests: () => set((state) => {
        const todayStr = new Date().toDateString();
        if (state.lastQuestDate === todayStr && state.dailyQuests.length > 0) return {};
        
        const newQuests = [
          { id: 'q1', type: 'kana', target: 20, progress: 0, completed: false, expReward: 30, desc: 'Answer 20 Kana correctly' },
          { id: 'q2', type: 'vocab', target: 10, progress: 0, completed: false, expReward: 40, desc: 'Answer 10 Vocab correctly' },
          { id: 'q3', type: 'any', target: 30, progress: 0, completed: false, expReward: 50, desc: 'Answer 30 questions correctly' }
        ];
        
        return { dailyQuests: newQuests, lastQuestDate: todayStr };
      }),

      updateQuestProgress: (questionType, amount) => set((state) => {
        let expBonus = 0;
        const updatedQuests = state.dailyQuests.map(q => {
          if (q.completed) return q;
          if (q.type === questionType || q.type === 'any') {
            const newProgress = Math.min(q.target, q.progress + amount);
            if (newProgress >= q.target) {
              expBonus += q.expReward;
              return { ...q, progress: newProgress, completed: true };
            }
            return { ...q, progress: newProgress };
          }
          return q;
        });
        
        if (expBonus > 0) {
          const newExp = state.exp + expBonus;
          const newLevel = Math.floor(newExp / 100) + 1;
          return {
            dailyQuests: updatedQuests,
            exp: newExp,
            userLevel: newLevel > state.userLevel ? newLevel : state.userLevel
          };
        }
        
        return { dailyQuests: updatedQuests };
      }),

      addWeakItem: (item, type) => set((state) => {
        // Prevent duplicates
        const exists = state.weakItems.some(w => w.id === item.id && w.__type === type);
        if (exists) return {};
        return { weakItems: [...state.weakItems, { ...item, __type: type }] };
      }),
      
      removeWeakItem: (itemId, type) => set((state) => ({
        weakItems: state.weakItems.filter(w => !(w.id === itemId && w.__type === type))
      })),
      
      openDailyChest: () => set((state) => {
        const todayStr = new Date().toDateString();
        if (state.lastChestDate === todayStr) return {};
        
        // Random reward: 80% chance for EXP, 20% chance for Streak Shield
        const rand = Math.random();
        if (rand > 0.8) {
          return {
            inventory: { ...state.inventory, streakShields: state.inventory.streakShields + 1 },
            lastChestDate: todayStr
          };
        } else {
          const bonusExp = Math.floor(Math.random() * 50) + 50; // 50 - 100 EXP
          const newExp = state.exp + bonusExp;
          const newLevel = Math.floor(newExp / 100) + 1;
          return {
            exp: newExp,
            userLevel: newLevel > state.userLevel ? newLevel : state.userLevel,
            lastChestDate: todayStr
          };
        }
      }),

      endBossBattle: (result) => set((state) => {
        const { correct = 0, total = 10, win = false, badgeId } = result || {};
        const expAward = win ? 200 : 25;
        const newExp = state.exp + expAward;
        const newLevel = Math.floor(newExp / 100) + 1;
        const newAchievements = Array.from(state.achievements || []);
        if (win) {
          const id = badgeId || 'boss_victor';
          if (!newAchievements.includes(id)) newAchievements.push(id);
        }

        return {
          bossBattles: [...(state.bossBattles || []), { time: new Date().toISOString(), correct, total, win }],
          exp: newExp,
          userLevel: newLevel > state.userLevel ? newLevel : state.userLevel,
          achievements: newAchievements
        };
      }),

      syncFromFirestore: (data) => set((state) => ({
        userLevel: data.userLevel ?? state.userLevel,
        streak: data.streak ?? state.streak,
        exp: data.exp ?? state.exp,
        lastStreakDate: data.lastStreakDate ?? state.lastStreakDate,
        moduleProgress: data.moduleProgress ?? state.moduleProgress,
        unlockedChapters: data.unlockedChapters ?? state.unlockedChapters,
        achievements: data.achievements ?? state.achievements,
        dailyQuests: data.dailyQuests ?? state.dailyQuests,
        lastQuestDate: data.lastQuestDate ?? state.lastQuestDate,
        inventory: data.inventory ?? state.inventory,
        weakItems: data.weakItems ?? state.weakItems,
        lastChestDate: data.lastChestDate ?? state.lastChestDate
      })),
    }),
    {
      name: 'nihonz-storage', // unique name
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !['currentUser'].includes(key))
      ),
    }
  )
);

export default useStore;
