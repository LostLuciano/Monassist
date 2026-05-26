// src/utils/constants.ts
export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  GOALS: '/goals',
  PROFILE: '/profile',
  RECOMMENDATIONS: '/recommendations',
} as const;

export const FINANCIAL_STATUS = {
  CONTROLLED: 'controlled',
  ELEVATED: 'elevated',
  CRITICAL: 'critical',
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
} as const;
