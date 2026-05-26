import api from './api';

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  data?: any;
}

const chatService = {
  sendMessage: async (message: string, context?: any): Promise<ChatResponse> => {
    const response = await api.post('/chat/message', { message, context });
    return response.data.data;
  },

  getHistory: async (limit: number = 50): Promise<ChatMessage[]> => {
    const response = await api.get('/chat/history', { params: { limit } });
    return response.data.data;
  },

  clearHistory: async (): Promise<void> => {
    await api.delete('/chat/history');
  },

  getFinancialAnalysis: async (): Promise<any> => {
    const response = await api.get('/chat/analysis');
    return response.data.data;
  },

  askQuestion: async (question: string): Promise<ChatResponse> => {
    const response = await api.post('/chat/ask', { question });
    return response.data.data;
  },

  getRecommendations: async (): Promise<any[]> => {
    const response = await api.get('/chat/recommendations');
    return response.data.data;
  },

  processVoiceNote: async (audioFile: File): Promise<ChatResponse> => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    const response = await api.post('/chat/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  processReceipt: async (imageFile: File): Promise<any> => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.post('/chat/receipt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  getSuggestions: async (context: string): Promise<string[]> => {
    const response = await api.get('/chat/suggestions', { params: { context } });
    return response.data.data;
  }
};

export default chatService;
