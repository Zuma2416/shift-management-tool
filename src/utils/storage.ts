import { AppState } from '../types';

const STORAGE_KEY = 'shift-manager-state';

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Failed to save state:', err);
  }
};

export const loadState = (): AppState | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return undefined;
    
    const state = JSON.parse(serializedState);
    // 日付文字列をDateオブジェクトに変換
    state.staff.forEach((staff: any) => {
      staff.ngDays = staff.ngDays.map((day: string) => new Date(day));
    });
    state.patterns.forEach((pattern: any) => {
      pattern.date = new Date(pattern.date);
    });
    state.history.forEach((entry: any) => {
      entry.timestamp = new Date(entry.timestamp);
      entry.data.date = new Date(entry.data.date);
    });
    
    return state;
  } catch (err) {
    console.error('Failed to load state:', err);
    return undefined;
  }
};

export const clearState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear state:', err);
  }
}; 