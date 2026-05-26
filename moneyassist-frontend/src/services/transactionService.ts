import api from './api';
import { Transaction } from '../types';

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

const transactionService = {
  getAll: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    const response = await api.get('/transactions', { params: filters });
    return response.data.data;
  },

  getById: async (id: number): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Transaction> => {
    const response = await api.post('/transactions', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  uploadReceipt: async (id: number, file: File): Promise<{ receiptUrl: string }> => {
    const formData = new FormData();
    formData.append('receipt', file);
    const response = await api.post(`/transactions/${id}/receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  getStatistics: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') => {
    const response = await api.get('/transactions/statistics', { params: { period } });
    return response.data.data;
  },

  getCategoryBreakdown: async (type: 'income' | 'expense', period: string = 'monthly') => {
    const response = await api.get('/transactions/category-breakdown', {
      params: { type, period }
    });
    return response.data.data;
  },

  getTrends: async (period: 'weekly' | 'monthly' | 'yearly' = 'monthly') => {
    const response = await api.get('/transactions/trends', { params: { period } });
    return response.data.data;
  },

  bulkImport: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/transactions/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  export: async (format: 'csv' | 'excel' | 'pdf' = 'csv', filters?: TransactionFilters) => {
    const response = await api.get('/transactions/export', {
      params: { format, ...filters },
      responseType: 'blob'
    });
    return response.data;
  }
};

export default transactionService;
