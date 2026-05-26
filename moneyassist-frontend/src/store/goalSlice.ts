import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import goalService from '../services/goalService';
import { SavingsGoal } from '../types';

export const fetchGoals = createAsyncThunk('goals/fetchGoals', async (_, { rejectWithValue }) => {
  try {
    return await goalService.getAll();
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch goals');
  }
});

export const addGoal = createAsyncThunk('goals/addGoal', async (data: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
  try {
    return await goalService.create(data);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add goal');
  }
});

export const updateGoal = createAsyncThunk('goals/updateGoal', async (data: Partial<SavingsGoal> & { id: number }, { rejectWithValue }) => {
  try {
    const { id, ...updateData } = data;
    return await goalService.update(id, updateData);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update goal');
  }
});

export const deleteGoal = createAsyncThunk('goals/deleteGoal', async (id: number, { rejectWithValue }) => {
  try {
    await goalService.delete(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete goal');
  }
});

export const updateGoalProgress = createAsyncThunk('goals/updateGoalProgress', async ({ id, amount }: { id: number, amount: number }, { rejectWithValue }) => {
  try {
    return await goalService.updateProgress(id, amount);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update progress');
  }
});

interface GoalState {
  goals: SavingsGoal[];
  loading: boolean;
  error: string | null;
}

const initialState: GoalState = {
  goals: [],
  loading: false,
  error: null,
};

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setGoals: (state, action: PayloadAction<SavingsGoal[]>) => {
      state.goals = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter(g => g.id !== action.payload);
      })
      .addCase(updateGoalProgress.fulfilled, (state, action) => {
        const index = state.goals.findIndex(g => g.id === action.payload.id);
        if (index !== -1) {
          state.goals[index] = action.payload;
        }
      });
  },
});

export const { setGoals } = goalSlice.actions;
export default goalSlice.reducer;

