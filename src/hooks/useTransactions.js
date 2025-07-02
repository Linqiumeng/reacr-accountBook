import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const { token, logout, API_URL } = useAuth();

  const apiCall = async (endpoint, options = {}) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      if (response.status === 401) {
        // Token expired or invalid
        logout();
        throw new Error('Session expired. Please login again.');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  return { apiCall };
};

// ============================================
// src/hooks/useTransactions.js
import { useState, useEffect } from 'react';
import { useApi } from './useApi';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { apiCall } = useApi();

  // Fetch transactions with filters
  const fetchTransactions = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = `/transactions${queryParams ? `?${queryParams}` : ''}`;
      const data = await apiCall(endpoint);
      setTransactions(data.data.transactions || []);
    } catch (err) {
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new transaction
  const addTransaction = async (transactionData) => {
    try {
      const data = await apiCall('/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionData)
      });
      
      // Refresh transactions list
      await fetchTransactions();
      return { success: true, data: data.data.transaction };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update transaction
  const updateTransaction = async (id, transactionData) => {
    try {
      const data = await apiCall(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(transactionData)
      });
      
      // Update local state
      setTransactions(prev => 
        prev.map(t => t._id === id ? data.data.transaction : t)
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      await apiCall(`/transactions/${id}`, { method: 'DELETE' });
      
      // Update local state
      setTransactions(prev => prev.filter(t => t._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete all transactions
  const deleteAllTransactions = async () => {
    try {
      await apiCall('/transactions', { method: 'DELETE' });
      setTransactions([]);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Get financial summary
  const getSummary = async () => {
    try {
      const data = await apiCall('/transactions/summary');
      return data.data.summary;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Calculate balance from current transactions
  const calculateBalance = () => {
    return transactions.reduce((balance, transaction) => {
      if (transaction.type === 'income') {
        return balance + transaction.amount;
      } else {
        return balance - transaction.amount;
      }
    }, 0);
  };

  // Get income total
  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((total, t) => total + t.amount, 0);
  };

  // Get expense total
  const getTotalExpense = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((total, t) => total + t.amount, 0);
  };

  return {
    transactions,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteAllTransactions,
    getSummary,
    calculateBalance,
    getTotalIncome,
    getTotalExpense
  };
};