import { configureStore } from '@reduxjs/toolkit';
import localeReducer from './slices/locale.slice';

export const store = configureStore({
  reducer: {
    locale: localeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

