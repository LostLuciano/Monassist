// src/services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../utils/constants';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor with seamless Demo Mode fallback
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config;
        
        // If it's a network error (server is offline) or a 404/500 fallback to mock data
        if (!error.response || error.response.status === 404 || error.code === 'ERR_NETWORK') {
          const url = config?.url || '';
          console.warn(`[MoneyAssist API Offline] Entering Demo Fallback Mode for URL: ${url}`);
          
          let mockData: any = null;

          if (url.includes('/auth/login') || url.includes('/auth/register')) {
            mockData = {
              token: 'demo-token-jwt-secure-123456',
              user: {
                id: 1,
                name: 'Demo Account',
                email: 'demo@moneyassist.com',
                phone: '08123456789',
                currency: 'IDR',
                language: 'id'
              }
            };
          } else if (url.includes('/auth/me')) {
            mockData = {
              id: 1,
              name: 'Demo Account',
              email: 'demo@moneyassist.com',
              phone: '08123456789',
              currency: 'IDR',
              language: 'id'
            };
          } else if (url.includes('/transactions/statistics')) {
            mockData = {
              data: {
                totalIncome: 0,
                totalExpense: 0,
                netSavings: 0,
                efficiencyScore: 0
              }
            };
          } else if (url.includes('/transactions/category-breakdown')) {
            mockData = {
              data: []
            };
          } else if (url.includes('/transactions')) {
            mockData = {
              data: []
            };
          } else if (url.includes('/goals')) {
            mockData = {
              data: []
            };
          } else if (url.includes('/recommendations')) {
            mockData = {
              data: []
            };
          } else if (url.includes('/chat/send')) {
            mockData = {
              response: 'Berdasarkan catatan transaksi Anda, pengeluaran makan di luar dan hiburan Anda cukup tinggi bulan ini. Saya merekomendasikan untuk membatasi belanja luar ruangan maksimal Rp500.000 per minggu untuk mengamankan sisa anggaran Anda.'
            };
          }

          if (mockData) {
            return Promise.resolve({
              data: mockData,
              status: 200,
              statusText: 'OK',
              headers: {},
              config: config
            } as any);
          }
        }

        // Standard 401 session expiration
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  getApi() {
    return this.api;
  }
}

export const apiService = new ApiService();
export const api = apiService.getApi();
export default api;
