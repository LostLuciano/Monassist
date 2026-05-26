import api from './api';
import { SavingsGoal } from '../types';

const goalService = {
  getAll: async (): Promise<SavingsGoal[]> => {
    const response = await api.get('/goals');
    return response.data.data;
  },

  getById: async (id: number): Promise<SavingsGoal> => {
    const response = await api.get(`/goals/${id}`);
    return response.data.data;
  },

  create: async (data: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<SavingsGoal> => {
    const response = await api.post('/goals', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<SavingsGoal>): Promise<SavingsGoal> => {
    const response = await api.put(`/goals/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/goals/${id}`);
  },

  updateProgress: async (id: number, amount: number): Promise<SavingsGoal> => {
    const response = await api.post(`/goals/${id}/progress`, { amount });
    return response.data.data;
  },

  getProgress: async (id: number) => {
    const response = await api.get(`/goals/${id}/progress`);
    return response.data.data;
  },

  getSuggestions: async () => {
    const response = await api.get('/goals/suggestions');
    return response.data.data;
  },

  markAsCompleted: async (id: number): Promise<SavingsGoal> => {
    const response = await api.post(`/goals/${id}/complete`);
    return response.data.data;
  },

  getStatistics: async () => {
    const response = await api.get('/goals/statistics');
    return response.data.data;
  }
};

export default goalService;
