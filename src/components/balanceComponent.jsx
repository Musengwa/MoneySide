import { useContext, useMemo } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { BalanceContext } from '../context/BalanceContext';
import { TransactionContext } from '../context/TransactionContext';

const BalanceComponent = () => {
  const { balance, calculatePotentialBalance, getLastCommittedTransactionTime } = useContext(BalanceContext);
  const { transactions } = useContext(TransactionContext);

  const potentialBalance = useMemo(() => {
    return calculatePotentialBalance(transactions);
  }, [transactions, calculatePotentialBalance]);

  const lastCommittedTime = useMemo(() => {
    return getLastCommittedTransactionTime(transactions);
  }, [transactions, getLastCommittedTransactionTime]);

  const formatCurrency = (amount, currency) => {
    return `${currency} ${amount.toFixed(2)}`;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Never';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ImageBackground 
      source={require('../images/balanceBG.jpeg')} 
      style={styles.container}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        {/* Main Balance */}
        <Text style={styles.balanceAmount}>{formatCurrency(balance.value, balance.currency)}</Text>

        {/* Potential Balance */}
        <Text style={styles.potentialBalance}>Potential: {formatCurrency(potentialBalance, balance.currency)}</Text>

        {/* Last Update Date */}
        <Text style={styles.lastUpdate}>Last updated: {formatDateTime(lastCommittedTime)}</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderColor: '#5a5a5a55',
    borderWidth: 0.5,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden'
  },
  backgroundImage: {
    borderRadius: 12
  },
  overlay: {
    backgroundColor: 'rgba(12, 12, 12, 0.5)'
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 8
  },
  potentialBalance: {
    fontSize: 14,
    color: '#999',
    marginBottom: 6
  },
  lastUpdate: {
    fontSize: 12,
    color: '#CCC',
    fontStyle: 'italic'
  }
});

export default BalanceComponent;
