// TransactionForm.js
import React, { useContext, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import NecessitySlider from '../UI/Slider';
import { TransactionContext } from '../context/TransactionContext';

const TransactionForm = ({ isVisible, onClose }) => {
  const { addTransaction } = useContext(TransactionContext);
  
  const [formData, setFormData] = useState({
    category: '',
    type: true,
    status: false,
    dateTime: new Date().toISOString(),
    necessity: { level: 0, description: '' },
    amount: { value: 0, currency: 'USD' }
  });
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const categories = [
    { id: 1, name: 'Food', icon: '🍕' },
    { id: 2, name: 'Transport', icon: '🚗' },
    { id: 3, name: 'Shopping', icon: '🛍️' },
    { id: 4, name: 'Entertainment', icon: '🎬' },
    { id: 5, name: 'Bills', icon: '📄' },
    { id: 6, name: 'Health', icon: '🏥' },
    { id: 7, name: 'Income', icon: '💰' },
    { id: 8, name: 'Education', icon: '📚' },
    { id: 9, name: 'Travel', icon: '✈️' },
    { id: 10, name: 'Other', icon: '📦' }
  ];

  const resetForm = () => {
    setFormData({
      category: '',
      type: true,
      status: false,
      dateTime: new Date().toISOString(),
      necessity: { level: 0, description: '' },
      amount: { value: 0, currency: 'USD' }
    });
  };

  const handleSubmit = () => {
    if (!formData.category || !formData.amount.value || formData.amount.value <= 0) {
      Alert.alert('Error', 'Please fill in all required fields with valid values');
      return;
    }

    addTransaction(formData);
    resetForm();
    onClose();
    Alert.alert('Success', 'Transaction added successfully!');
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: { ...prev[parentField], [childField]: value }
    }));
  };

  const handleNecessityChange = (level) => {
    updateNestedField('necessity', 'level', level);
  };

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Add New Transaction</Text>

        {/* Category Selection */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity 
            style={styles.categoryButton}
            onPress={() => setShowCategoryModal(true)}
          >
            <Text style={styles.categoryButtonText}>
              {formData.category || 'Select Category'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Type Switch */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Transaction Type</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>
              {formData.type ? 'Income 💰' : 'Expense 💸'}
            </Text>
            <Switch
              value={formData.type}
              onValueChange={(value) => updateFormField('type', value)}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={formData.type ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.textInput}
            value={formData.amount.value === 0 ? '' : formData.amount.value.toString()}
            onChangeText={(text) => {
              const numericValue = text === '' ? 0 : parseFloat(text);
              updateNestedField('amount', 'value', numericValue);
            }}
            keyboardType="numeric"
            placeholder="Enter amount"
            returnKeyType="done"
          />
        </View>

        {/* Currency Input */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Currency</Text>
          <TextInput
            style={styles.textInput}
            value={formData.amount.currency}
            onChangeText={(text) => updateNestedField('amount', 'currency', text)}
            placeholder="Currency (e.g., USD)"
            returnKeyType="done"
          />
        </View>

        {/* Necessity Slider */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Necessity Level</Text>
          <NecessitySlider
            value={formData.necessity.level}
            onValueChange={handleNecessityChange}
            min={0}
            max={5}
          />
        </View>

        {/* Necessity Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Necessity Description (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={formData.necessity.description}
            onChangeText={(text) => updateNestedField('necessity', 'description', text)}
            placeholder="Describe why this transaction is necessary..."
            multiline
            numberOfLines={3}
            returnKeyType="done"
          />
        </View>

        {/* Date Time Display */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Transaction Date</Text>
          <Text style={styles.dateText}>
            {new Date(formData.dateTime).toLocaleDateString()} at {new Date(formData.dateTime).toLocaleTimeString()}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>

        {/* Category Selection Modal */}
        <Modal
          visible={showCategoryModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCategoryModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryItem,
                      formData.category === cat.name && styles.categoryItemSelected
                    ]}
                    onPress={() => {
                      updateFormField('category', cat.name);
                      setShowCategoryModal(false);
                    }}
                  >
                    <Text style={styles.categoryIcon}>{cat.icon}</Text>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setShowCategoryModal(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    color: '#2c3e50',
  },
  fieldContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: 'white',
    color: '#2c3e50',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 8,
    marginBottom: 5,
  },
  categoryItemSelected: {
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  categoryIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  categoryName: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '500',
  },
  closeModalButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
});

export default TransactionForm;