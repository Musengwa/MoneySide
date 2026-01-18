import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import BalanceComponent from '../src/components/balanceComponent';
import BottomNav from '../src/components/bottomNav';
import TransactionForm from '../src/components/TransactionForm';
import TransactionList from '../src/components/TransactionList';
import AIScreen from '../src/screens/AIScreen';
import AnalysisScreen from '../src/screens/AnalysisScreen';
import ProfileScreen from '../src/screens/ProfileScreen';
import SettingsScreen from '../src/screens/SettingsScreen';

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView style={styles.content}>
            <BalanceComponent />
            <TransactionList />
            <Button
              title="Add New Transaction"
              onPress={() => setShowForm(true)}
            />
            <TransactionForm
              isVisible={showForm}
              onClose={() => setShowForm(false)}
            />
          </ScrollView>
        );
      case 'profile':
        return <ProfileScreen />;
      case 'analysis':
        return <AnalysisScreen />;
      case 'ai':
        return <AIScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    padding: 20
  }
});

export default App;