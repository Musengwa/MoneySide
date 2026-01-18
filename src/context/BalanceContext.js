import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const initialBalance = { value: 0, currency: 'USD' };
  const [balance, setBalance] = useState(initialBalance);
  const [history, setHistory] = useState([]); // { id, type: 'income'|'expense'|'manual', amount: {value, currency}, dateTime, txnId? }

  // Load stored data on startup
  useEffect(() => {
    (async () => {
      try {
        const storedBalance = await AsyncStorage.getItem('balance');
        const storedHistory = await AsyncStorage.getItem('balanceHistory');
        if (storedBalance) setBalance(JSON.parse(storedBalance));
        if (storedHistory) setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.warn('Failed to load balance data', e);
      }
    })();
  }, []);

  // Persist whenever balance/history change
  useEffect(() => {
    AsyncStorage.setItem('balance', JSON.stringify(balance)).catch((e) =>
      console.warn('Failed to persist balance', e)
    );
  }, [balance]);

  useEffect(() => {
    AsyncStorage.setItem('balanceHistory', JSON.stringify(history)).catch((e) =>
      console.warn('Failed to persist balance history', e)
    );
  }, [history]);

  const addHistoryEntry = (entry) => {
    const newEntry = {
      id: Date.now(),
      type: entry.type || 'manual',
      amount: typeof entry.amount === 'number' ? { value: entry.amount, currency: entry.currency || balance.currency } : entry.amount,
      dateTime: entry.dateTime || new Date().toISOString(),
      txnId: entry.txnId ?? null,
      note: entry.note ?? '',
      lastTransactionTime: entry.lastTransactionTime || new Date().toISOString()
    };
    setHistory((prev) => [...prev, newEntry]);
    return newEntry;
  };

  const setBalanceValue = (newBalance) => {
    if (typeof newBalance === 'number') {
      setBalance((prev) => ({ ...prev, value: newBalance }));
    } else if (newBalance && typeof newBalance === 'object') {
      setBalance(newBalance);
    }
  };

  const resetBalance = async (keepCurrency = true) => {
    const resetValue = keepCurrency ? { value: 0, currency: balance.currency } : initialBalance;
    await AsyncStorage.removeItem('balance');
    await AsyncStorage.removeItem('balanceHistory');
    setBalance(resetValue);
    setHistory([]);
  };

  // deposit/withdraw helpers (value is number or object {value, currency})
  const deposit = (amount, { txnId = null, dateTime, note } = {}) => {
    const amt = typeof amount === 'number' ? { value: amount, currency: balance.currency } : amount;
    setBalance((prev) => ({ ...prev, value: (prev.value || 0) + (amt.value || 0) }));
    addHistoryEntry({ type: 'income', amount: amt, txnId, dateTime, note });
  };

  const withdraw = (amount, { txnId = null, dateTime, note } = {}) => {
    const amt = typeof amount === 'number' ? { value: amount, currency: balance.currency } : amount;
    setBalance((prev) => ({ ...prev, value: (prev.value || 0) - (amt.value || 0) }));
    addHistoryEntry({ type: 'expense', amount: amt, txnId, dateTime, note });
  };

  // Apply a transaction object from TransactionContext
  // txn must have { id, type (true=income/false=expense), amount: { value }, status }
  const applyTransaction = (txn, opts = { commitOnly: true }) => {
    if (!txn) return;
    // optionally skip uncommitted transactions:
    if (opts.commitOnly && !txn.status) return;
    const amt = txn.amount?.value ?? 0;
    const currency = txn.amount?.currency ?? balance.currency;
    if (txn.type === true) deposit({ value: amt, currency }, { txnId: txn.id });
    else withdraw({ value: amt, currency }, { txnId: txn.id });
  };

  // Recalculate entire balance from a provided list of transactions
  // transactions: array of txn objects { type: true/false, amount: {value}, status }
  const computeBalanceFromTransactions = (transactions = [], opts = { onlyCommitted: true }) => {
    const filtered = opts.onlyCommitted ? transactions.filter((t) => t.status === true) : transactions;
    const total = filtered.reduce((acc, txn) => {
      const val = txn.amount?.value ?? 0;
      return txn.type === true ? acc + val : acc - val;
    }, 0);
    // Set currency to the first transaction currency if available, otherwise keep current
    const currency = (filtered[0]?.amount?.currency) || balance.currency;
    setBalance({ value: total, currency });
    // create history based on these transactions
    const newHistory = filtered.map((txn) => ({
      id: txn.id ?? Date.now(),
      txnId: txn.id ?? null,
      type: txn.type === true ? 'income' : 'expense',
      amount: txn.amount ? txn.amount : { value: 0, currency },
      dateTime: txn.dateTime || new Date().toISOString(),
      note: txn.note ?? ''
    }));
    setHistory(newHistory);
  };

  // Helpers
  const getTotalIncome = () => history.filter((h) => h.type === 'income').reduce((s, e) => s + (e.amount?.value || 0), 0);
  const getTotalExpense = () => history.filter((h) => h.type === 'expense').reduce((s, e) => s + (e.amount?.value || 0), 0);
  const getNet = () => (balance?.value ?? 0);
  
  // Calculate potential balance (all non-abandoned transactions)
  const calculatePotentialBalance = (transactions = []) => {
    const nonAbandoned = transactions.filter((t) => !t.abandonment_status);
    const total = nonAbandoned.reduce((acc, txn) => {
      const val = txn.amount?.value ?? 0;
      return txn.type === true ? acc + val : acc - val;
    }, 0);
    return total;
  };
  
  // Get the time of the last committed transaction
  const getLastCommittedTransactionTime = (transactions = []) => {
    const committed = transactions.filter((t) => t.status === true);
    if (committed.length === 0) return null;
    const sortedByTime = committed.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    return sortedByTime[0]?.dateTime || null;
  };

  return (
    <BalanceContext.Provider
      value={{
        balance,
        history,
        setBalance: setBalanceValue,
        resetBalance,
        deposit,
        withdraw,
        applyTransaction,
        computeBalanceFromTransactions,
        addHistoryEntry,
        // getters
        getTotalIncome,
        getTotalExpense,
        getNet,
        calculatePotentialBalance,
        getLastCommittedTransactionTime,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};