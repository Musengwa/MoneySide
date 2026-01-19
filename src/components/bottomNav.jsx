import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNav = ({ activeTab, onTabChange, onAddTransaction }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'profile', label: 'Profile', icon: 'account' },
    { id: 'analysis', label: 'Analysis', icon: 'chart-line' },
    { id: 'ai', label: 'AI', icon: 'robot' }
  ];

  return (
    <View style={styles.container}>
      {tabs.slice(0, 2).map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabChange(tab.id)}
        >
          <MaterialCommunityIcons
            name={tab.icon}
            size={24}
            color={activeTab === tab.id ? '#2196F3' : '#999'}
          />
          <Text style={[styles.label, activeTab === tab.id && styles.activeLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity
        style={styles.centerButton}
        onPress={onAddTransaction}
      >
        <MaterialCommunityIcons
          name="plus"
          size={32}
          color="#fff"
        />
      </TouchableOpacity>
      
      {tabs.slice(2).map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabChange(tab.id)}
        >
          <MaterialCommunityIcons
            name={tab.icon}
            size={24}
            color={activeTab === tab.id ? '#2196F3' : '#999'}
          />
          <Text style={[styles.label, activeTab === tab.id && styles.activeLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#2196F3'
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  label: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
    marginTop: 4
  },
  activeLabel: {
    color: '#2196F3',
    fontWeight: '700'
  }
});

export default BottomNav;
