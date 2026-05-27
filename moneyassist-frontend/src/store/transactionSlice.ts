// src/store/transactionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import transactionService from '../services/transactionService';
import { Transaction } from '../types';

export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async (_, { rejectWithValue }) => {
  try {
    return await transactionService.getAll();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
  }
});

export const addTransaction = createAsyncThunk('transactions/addTransaction', async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
  try {
    return await transactionService.create(data as any);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add transaction');
  }
});

export const updateTransaction = createAsyncThunk('transactions/updateTransaction', async (data: Partial<Transaction> & { id: number }, { rejectWithValue }) => {
  try {
    const { id, ...updateData } = data;
    return await transactionService.update(id, updateData);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update transaction');
  }
});

export const deleteTransaction = createAsyncThunk('transactions/deleteTransaction', async (id: number, { rejectWithValue }) => {
  try {
    await transactionService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction');
  }
});

interface TransactionState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  loading: boolean;
  error: string | null;
  isFetched: boolean;
  filters: {
    type?: 'income' | 'expense' | 'all';
    category?: string;
    searchTerm?: string;
  };
}

const initialState: TransactionState = {
  transactions: [],
  filteredTransactions: [],
  loading: false,
  error: null,
  isFetched: false,
  filters: {
    type: 'all',
    category: '',
    searchTerm: ''
  }
};

const filterHelper = (state: TransactionState) => {
  state.filteredTransactions = state.transactions.filter(t => {
    const matchesType = !state.filters.type || state.filters.type === 'all' || t.type === state.filters.type;
    const matchesSearch = !state.filters.searchTerm || 
      t.description?.toLowerCase().includes(state.filters.searchTerm.toLowerCase()) ||
      t.category?.name.toLowerCase().includes(state.filters.searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<TransactionState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      filterHelper(state);
    },
    clearFilters: (state) => {
      state.filters = { type: 'all', category: '', searchTerm: '' };
      state.filteredTransactions = state.transactions;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.isFetched = true;
        state.transactions = action.payload || [];
        filterHelper(state);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
        filterHelper(state);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
          filterHelper(state);
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
        filterHelper(state);
      });
  }
});

export const { setFilter, clearFilters } = transactionSlice.actions;
export default transactionSlice.reducer;
