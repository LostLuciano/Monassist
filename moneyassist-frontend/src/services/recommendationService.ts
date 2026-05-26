import api from './api';

export interface Recommendation {
  id: number;
  type: 'warning' | 'suggestion' | 'achievement';
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  createdAt: string;
}

const recommendationService = {
  getAll: async (): Promise<Recommendation[]> => {
    const response = await api.get('/recommendations');
    return response.data.data;
  },

  getById: async (id: number): Promise<Recommendation> => {
    const response = await api.get(`/recommendations/${id}`);
    return response.data.data;
  },

  dismiss: async (id: number): Promise<void> => {
    await api.post(`/recommendations/${id}/dismiss`);
  },

  markAsRead: async (id: number): Promise<void> => {
    await api.post(`/recommendations/${id}/read`);
  },

  getByType: async (type: 'warning' | 'suggestion' | 'achievement'): Promise<Recommendation[]> => {
    const response = await api.get('/recommendations', { params: { type } });
    return response.data.data;
  },

  getByCategory: async (category: string): Promise<Recommendation[]> => {
    const response = await api.get('/recommendations', { params: { category } });
    return response.data.data;
  },

  refresh: async (): Promise<Recommendation[]> => {
    const response = await api.post('/recommendations/refresh');
    return response.data.data;
  },

  getSpendingInsights: async (): Promise<any> => {
    const response = await api.get('/recommendations/spending-insights');
    return response.data.data;
  },

  getSavingsOpportunities: async (): Promise<any> => {
    const response = await api.get('/recommendations/savings-opportunities');
    return response.data.data;
  },

  getBudgetSuggestions: async (): Promise<any> => {
    const response = await api.get('/recommendations/budget-suggestions');
    return response.data.data;
  }
};

export default recommendationService;
