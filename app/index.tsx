import React, { useState } from 'react';
import { Button, View } from 'react-native';
import TransactionForm from '../src/components/TransactionForm';

const App = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <View style={{ flex: 1, padding: 20 }}>
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