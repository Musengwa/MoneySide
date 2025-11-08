import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Load stored data when app starts
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('transactions');
      if (saved) setTransactions(JSON.parse(saved));
    })();
  }, []);

  // Save to storage whenever transactions change
  useEffect(() => {
    AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (txn) => {
    const newTransaction = {
      id: Date.now(), // Using timestamp as ID
      category: txn.category || '',
      type: txn.type ?? true, // true = income, false = expense
      status: txn.status ?? false, // true = committed, false = uncommitted
      dateTime: txn.dateTime || new Date().toISOString(),
      necessity: txn.necessity || { level: 0, description: '' }, // You can define this structure further
      amount: txn.amount || { value: 0, currency: 'USD' }, // You can define this structure further
      abandonment_status: false // Fixed as per requirement
    };
    
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const updateTransactionStatus = (id, newStatus) => {
    setTransactions((prev) =>
      prev.map((txn) => 
        txn.id === id ? { ...txn, status: newStatus } : txn
      )
    );
  };

  const updateTransaction = (id, updatedFields) => {
    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === id ? { ...txn, ...updatedFields } : txn
      )
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  };

  const clearAllTransactions = async () => {
    await AsyncStorage.removeItem('transactions');
    setTransactions([]);
  };

  // Helper functions to filter transactions
  const getIncomeTransactions = () => transactions.filter(txn => txn.type === true);
  const getExpenseTransactions = () => transactions.filter(txn => txn.type === false);
  const getCommittedTransactions = () => transactions.filter(txn => txn.status === true);
  const getUncommittedTransactions = () => transactions.filter(txn => txn.status === false);

  return (
    <TransactionContext.Provider
      value={{ 
        transactions, 
        addTransaction, 
        updateTransactionStatus,
        updateTransaction,
        deleteTransaction, 
        clearAllTransactions,
        // Helper selectors
        getIncomeTransactions,
        getExpenseTransactions,
        getCommittedTransactions,
        getUncommittedTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};