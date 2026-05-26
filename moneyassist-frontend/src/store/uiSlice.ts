// src/store/uiSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';
import { Recommendation } from '../types';

export const fetchRecommendations = createAsyncThunk(
  'ui/fetchRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/recommendations');
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations');
    }
  }
);

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
}

const initialState: UIState = {
  sidebarOpen: false,
  theme: 'light',
  recommendations: [],
  loading: false,
  error: null
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload || [];
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { toggleSidebar, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
