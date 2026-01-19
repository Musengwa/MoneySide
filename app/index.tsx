import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import BalanceComponent from '../src/components/balanceComponent';
import BottomNav from '../src/components/bottomNav';
import TransactionForm from '../src/components/TransactionForm';
import TransactionList from '../src/components/TransactionList';
import AIScreen from '../src/screens/AIScreen';
import AnalysisScreen from '../src/screens/AnalysisScreen';
import GetStartedScreen from '../src/screens/GetStartedScreen';
import ProfileScreen from '../src/screens/ProfileScreen';
import SettingsScreen from '../src/screens/SettingsScreen';

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const seen = await AsyncStorage.getItem('hasSeenGetStarted');
      if (seen === 'true') {
        setHasSeenOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenGetStarted', 'true');
      setHasSeenOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  if (isLoading) {
    return <View style={styles.container} />;
  }

  if (!hasSeenOnboarding) {
    return <GetStartedScreen onComplete={handleCompleteOnboarding} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView style={styles.content}>
            <Text style={styles.header}>Dashboard.</Text>
            <BalanceComponent />
            <TransactionList />
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
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onAddTransaction={() => setShowForm(true)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    color: "white"
  },
  content: {
    flex: 1,
    padding: 20
  },
  header: {
    fontSize: 30,
    fontWeight: 400,
    color: "white",
    padding: 10
  }
});

export default App;