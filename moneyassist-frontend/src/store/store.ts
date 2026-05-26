// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import transactionReducer from './transactionSlice';
import goalReducer from './goalSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    goals: goalReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
