// src/stores/user.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { BaseUser } from '../types/user.type';

const STORAGE_KEY = 'user-store';

interface UserStore {
  /** 로그인한 유저 (없으면 null) */
  user: BaseUser | null;

  /** 유저 저장(로그인/프로필 갱신 시) */
  setUser: (data: BaseUser) => void;

  /** 현재 유저 가져오기(없으면 undefined) */
  getUser: () => BaseUser | undefined;

  /** 로그인 여부 */
  isLoggedIn: () => boolean;

  /** 로그아웃/리셋 */
  clear: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: data => set({ user: data }),

      getUser: () => get().user ?? undefined,

      isLoggedIn: () => get().user !== null,

      clear: () => set({ user: null }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // 메서드는 저장하지 않고 user만 저장
      partialize: state => ({ user: state.user }),
      // 필요시 버전 마이그레이션
      version: 1,
    }
  )
);
