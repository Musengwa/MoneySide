import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { BalanceContext } from '../context/BalanceContext';
import { TransactionContext } from '../context/TransactionContext';

const CATEGORY_ICONS = {
  Food: '🍕',
  Transport: '🚗',
  Shopping: '🛍️',
  Entertainment: '🎬',
  Bills: '📄',
  Health: '🏥',
  Income: '💰',
  Education: '📚',
  Travel: '✈️',
  Other: '📦'
};

const formatDateTime = (iso) => {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  } catch (e) {
    return iso;
  }
};

const TransactionList = () => {
  const {
    transactions,
    updateTransactionStatus,
    getCommittedTransactions,
    getUncommittedTransactions
  } = useContext(TransactionContext);

  // Optional: if you'd like to use BalanceContext to reflect balance changes
  const { computeBalanceFromTransactions, applyTransaction } = useContext(BalanceContext) ?? {};

  const [activeTab, setActiveTab] = useState('uncommitted'); // 'uncommitted' | 'committed'
  const uncommitted = useMemo(() => getUncommittedTransactions(), [transactions]);
  const committed = useMemo(() => getCommittedTransactions(), [transactions]);

  const [potentialBalance, setPotentialBalance] = useState(0);
  const [actualBalance, setActualBalance] = useState(0);

  // Recalculate balances whenever transactions change
  useEffect(() => {
    const all = transactions || [];

    const calc = (list) =>
      list.reduce((acc, txn) => {
        const val = txn.amount?.value ?? 0;
        return txn.type === true ? acc + val : acc - val;
      }, 0);

    const potential = calc(all);
    const actual = calc(committed);

    setPotentialBalance(potential);
    setActualBalance(actual);

    // Console log values for debugging/testing
    console.log('[TransactionList] potentialBalance:', potential);
    console.log('[TransactionList] actualBalance:', actual);

    // Optional: keep global BalanceContext in-sync with committed txns
    // computeBalanceFromTransactions && computeBalanceFromTransactions(committed, { onlyCommitted: true });
  }, [transactions, committed, computeBalanceFromTransactions]);

  // commit handler
  const handleCommit = (txn) => {
    if (!txn) return;

    Alert.alert(
      'Commit Transaction',
      `Commit "${txn.category || 'transaction'}" for ${(txn.amount?.value ?? 0)} ${txn.amount?.currency ?? ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Commit',
          onPress: () => {
            // Mark it committed in the transactions context
            updateTransactionStatus(txn.id, true);

            // Optimistically update the local "actual balance" to reflect the commit instantly
            const delta = (txn.type ? 1 : -1) * (txn.amount?.value ?? 0);
            setActualBalance((prev) => prev + delta);

            // Also ensure global BalanceContext is updated:
            // Prefer computeBalanceFromTransactions (rebuild from committed txns) but fallback to applyTransaction.
            if (computeBalanceFromTransactions) {
              // Build a temporary committed list including this txn (in case transaction state hasn't updated yet)
              const updatedCommitted = [...committed.filter(t => t.id !== txn.id), { ...txn, status: true }];
              computeBalanceFromTransactions(updatedCommitted, { onlyCommitted: true });
            } else if (applyTransaction) {
              // Apply single transaction (ensure status is true)
              applyTransaction({ ...txn, status: true }, { commitOnly: true });
            }
          },
        },
      ],
    );
  };

  const renderItem = ({ item }) => {
    const icon = CATEGORY_ICONS[item.category] ?? CATEGORY_ICONS.Other;
    const isOverdue = new Date(item.dateTime) < new Date();

    return (
      <View style={styles.itemContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{item.category || 'Unnamed'}</Text>
          <Text style={styles.meta}>
            {formatDateTime(item.dateTime)} {isOverdue ? '· Overdue' : ''}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={[styles.amount, item.type ? styles.income : styles.expense]}>
            {(item.type ? '+' : '-') + (item.amount?.value ?? 0)} {item.amount?.currency ?? 'USD'}
          </Text>

          {/* Commit button only for uncommitted transactions */}
          {item.status === false && (
            <TouchableOpacity style={styles.commitButton} onPress={() => handleCommit(item)}>
              <Text style={styles.commitButtonText}>Commit</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab toggles */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'uncommitted' && styles.tabActive]}
          onPress={() => setActiveTab('uncommitted')}
        >
          <Text style={[styles.tabText, activeTab === 'uncommitted' && styles.tabTextActive]}>
            Awaiting (Uncommitted)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'committed' && styles.tabActive]}
          onPress={() => setActiveTab('committed')}
        >
          <Text style={[styles.tabText, activeTab === 'committed' && styles.tabTextActive]}>
            Committed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Balances (console also shows) */}
      <View style={styles.balances}>
        <Text style={styles.balanceText}>Potential Balance (uncommitted + committed): {potentialBalance}</Text>
        <Text style={styles.balanceText}>Actual Balance (committed only): {actualBalance}</Text>
      </View>

      {/* List */}
      <FlatList
        data={activeTab === 'uncommitted' ? uncommitted : committed}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {activeTab === 'uncommitted' ? 'No awaiting transactions' : 'No committed transactions'}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  tabs: { flexDirection: 'row', marginBottom: 12, borderRadius: 8, overflow: 'hidden' },
  tab: { flex: 1, paddingVertical: 10, backgroundColor: '#f1f3f5', alignItems: 'center' },
  tabActive: { backgroundColor: '#4f8cff' },
  tabText: { color: '#495057', fontWeight: '600' },
  tabTextActive: { color: 'white', fontWeight: '700' },
  balances: { marginBottom: 12, padding: 10, backgroundColor: '#f8f9fa', borderRadius: 8 },
  balanceText: { fontSize: 14, color: '#2c3e50' },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 12,
    padding: 12,
    elevation: 2
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2ff',
    marginRight: 12
  },
  iconText: { fontSize: 20 },
  content: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700', color: '#111827' },
  meta: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amount: { fontSize: 16, fontWeight: '700' },
  income: { color: '#16a34a' },
  expense: { color: '#dc2626' },
  commitButton: {
    marginTop: 8,
    backgroundColor: '#2563eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  commitButtonText: { color: 'white', fontWeight: '700' },
  empty: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#6b7280' }
});

export default TransactionList;