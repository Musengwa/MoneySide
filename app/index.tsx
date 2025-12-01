import React, { useState } from 'react';
import { Button, View } from 'react-native';
import TransactionForm from '../src/components/TransactionForm';
import TransactionList from '../src/components/TransactionList';

const App = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TransactionList/>
      <Button 
        title="Add New Transaction" 
        onPress={() => setShowForm(true)} 
      />
      
      <TransactionForm 
        isVisible={showForm} 
        onClose={() => setShowForm(false)} 
      />
    </View>
  );
};

export default App;