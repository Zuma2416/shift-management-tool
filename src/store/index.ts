import { configureStore } from '@reduxjs/toolkit';
import shiftReducer from './slices/shiftSlice';
import { saveState } from '../utils/storage';

export const store = configureStore({
  reducer: {
    shift: shiftReducer,
  },
});

store.subscribe(() => {
  saveState(store.getState().shift);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 