import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  updateGoalProgress
} from '../store/goalSlice';
import { SavingsGoal } from '../types';

export const useGoals = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { goals, loading, error } = useSelector((state: RootState) => state.goals);

  useEffect(() => {
    if (goals.length === 0 && !loading) {
      dispatch(fetchGoals());
    }
  }, [dispatch, goals.length, loading]);

  const createGoal = async (data: Omit<SavingsGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      await dispatch(addGoal(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const editGoal = async (id: number, data: Partial<SavingsGoal>) => {
    try {
      await dispatch(updateGoal({ id, ...data })).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const removeGoal = async (id: number) => {
    try {
      await dispatch(deleteGoal(id)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const addProgress = async (id: number, amount: number) => {
    try {
      await dispatch(updateGoalProgress({ id, amount })).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const getGoalProgress = (goal: SavingsGoal) => {
    return (goal.current_amount / goal.target_amount) * 100;
  };

  const getActiveGoals = () => {
    return goals.filter(goal => {
      const progress = getGoalProgress(goal);
      return progress < 100;
    });
  };

  const getCompletedGoals = () => {
    return goals.filter(goal => {
      const progress = getGoalProgress(goal);
      return progress >= 100;
    });
  };

  const getGoalsByCategory = (category: string) => {
    return goals.filter(goal => goal.category === category);
  };

  const getTotalTargetAmount = () => {
    return goals.reduce((sum, goal) => sum + goal.target_amount, 0);
  };

  const getTotalCurrentAmount = () => {
    return goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  };

  const getOverallProgress = () => {
    const total = getTotalTargetAmount();
    const current = getTotalCurrentAmount();
    return total > 0 ? (current / total) * 100 : 0;
  };

  const getUpcomingDeadlines = (days: number = 30) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    
    return goals.filter(goal => {
      const deadline = new Date(goal.target_date);
      return deadline >= now && deadline <= futureDate && getGoalProgress(goal) < 100;
    });
  };

  return {
    goals,
    loading,
    error,
    createGoal,
    editGoal,
    removeGoal,
    addProgress,
    getGoalProgress,
    getActiveGoals,
    getCompletedGoals,
    getGoalsByCategory,
    getTotalTargetAmount,
    getTotalCurrentAmount,
    getOverallProgress,
    getUpcomingDeadlines,
    refreshGoals: () => dispatch(fetchGoals())
  };
};
