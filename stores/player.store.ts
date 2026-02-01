import { create } from "zustand";
import { persist } from "zustand/middleware";

type PlayerState = {
  volume: Array<number>;
  setVolume: (v: Array<number>) => void;
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      volume: [40],
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: "player-storage",

      /**
       * ⭐ 核心配置
       * hydration 完成前，不使用 localStorage 的值
       */
      skipHydration: true,
    },
  ),
);
