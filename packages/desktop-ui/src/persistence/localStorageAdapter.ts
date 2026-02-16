import type { DesktopStorageAdapter } from './types';

export const localStorageAdapter: DesktopStorageAdapter = {
  async get(key: string): Promise<string | null> {
    try {
      const value = localStorage.getItem(key);
      return Promise.resolve(value);
    } catch {
      return Promise.resolve(null);
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch {
      return Promise.resolve();
    }
  },
};
