import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setFilter
} from '../store/transactionSlice';
import { Transaction } from '../types';

export const useTransactions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, filteredTransactions, loading, error, filters, isFetched } = useSelector(
    (state: RootState) => state.transactions
  );

  useEffect(() => {
    if (!isFetched && !loading) {
      dispatch(fetchTransactions());
    }
  }, [dispatch, isFetched, loading]);

  const createTransaction = async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      await dispatch(addTransaction(data)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const editTransaction = async (id: number, data: Partial<Transaction>) => {
    try {
      await dispatch(updateTransaction({ id, ...data })).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const removeTransaction = async (id: number) => {
    try {
      await dispatch(deleteTransaction(id)).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const applyFilter = (filterType: string, value: any) => {
    dispatch(setFilter({ [filterType]: value }));
  };

  const clearFilters = () => {
    dispatch(setFilter({}));
  };

  const getTransactionsByType = (type: 'income' | 'expense') => {
    return filteredTransactions.filter(t => t.type === type);
  };

  const getTransactionsByCategory = (category: string) => {
    return filteredTransactions.filter(t => t.category?.name === category);
  };

  const getTotalIncome = () => {
    return filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpense = () => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpense();
  };

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    loading,
    error,
    filters,
    createTransaction,
    editTransaction,
    removeTransaction,
    applyFilter,
    clearFilters,
    getTransactionsByType,
    getTransactionsByCategory,
    getTotalIncome,
    getTotalExpense,
    getBalance,
    refreshTransactions: () => dispatch(fetchTransactions())
  };
};
