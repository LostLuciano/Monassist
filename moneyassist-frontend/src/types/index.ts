// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profile_photo_path?: string;
  monthly_income: number;
  reminder_frequency: string;
  reminder_time: string;
  notification_enabled: boolean;
  currency?: string;
  language?: string;
  theme?: string;
  telegram_id?: string;
  telegram_pairing_code?: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  category_id: number;
  type: 'income' | 'expense';
  amount: number;
  description?: string;
  receipt_image_path?: string;
  transaction_date: string;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
}

export interface SavingsGoal {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category?: string;
  status: 'active' | 'completed' | 'abandoned';
  priority: 'low' | 'medium' | 'high';
  progress_percentage?: number;
  remaining_amount?: number;
  days_remaining?: number;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: number;
  user_id: number;
  type: string;
  title: string;
  description: string;
  action_url?: string;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  user_id?: number;
  message: string;
  response: string;
  is_guest: boolean;
  created_at: string;
}

export interface FinancialSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  financial_status: 'controlled' | 'elevated' | 'critical';
  expense_by_category: ExpenseByCategory[];
  savings_goals_progress: SavingsGoal[];
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}
