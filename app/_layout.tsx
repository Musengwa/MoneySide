import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BalanceProvider } from '../src/context/BalanceContext';
import { TransactionProvider } from '../src/context/TransactionContext';

export default function Layout() {
  return (
    <BalanceProvider>
      <TransactionProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="analysis" />
            <Stack.Screen name="settings" />
          </Stack>
        </SafeAreaProvider>
      </TransactionProvider>
    </BalanceProvider>
  );
}
