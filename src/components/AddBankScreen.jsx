import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@react-native-vector-icons/ionicons';
import BackBar from './BackBar';

const BANKS_STORAGE_KEY = 'ezan_bank_accounts';

const AddBankScreen = ({ navigation }) => {
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const storedAccounts = await AsyncStorage.getItem(BANKS_STORAGE_KEY);
      if (storedAccounts) {
        setAccounts(JSON.parse(storedAccounts));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    if (!bankName.trim() || !iban.trim() || !accountHolderName.trim()) {
      Alert.alert('Missing details', 'Please fill in all bank details.');
      return;
    }

    const newAccount = {
      id: Date.now().toString(),
      bankName: bankName.trim(),
      iban: iban.trim(),
      accountHolderName: accountHolderName.trim(),
    };

    const updatedAccounts = [newAccount, ...accounts];

    try {
      await AsyncStorage.setItem(BANKS_STORAGE_KEY, JSON.stringify(updatedAccounts));
      setAccounts(updatedAccounts);
      setBankName('');
      setIban('');
      setAccountHolderName('');
      Alert.alert('Success', 'Bank account added successfully.');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to save bank account right now.');
    }
  };

  const handleDelete = async (accountId) => {
    Alert.alert(
      'Delete bank',
      'Are you sure you want to delete bank?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedAccounts = accounts.filter((account) => account.id !== accountId);
            try {
              await AsyncStorage.setItem(BANKS_STORAGE_KEY, JSON.stringify(updatedAccounts));
              setAccounts(updatedAccounts);
            } catch (error) {
              console.log(error);
              Alert.alert('Error', 'Unable to delete bank account right now.');
            }
          },
        },
      ],
    );
  };

  const renderAccountItem = ({ item }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountDetails}>
        <Text style={styles.accountBankName}>{item.bankName}</Text>
        <Text style={styles.accountSubtitle}>Account Holder: {item.accountHolderName}</Text>
        <Text style={styles.accountSubtitle}>IBAN: {item.iban}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash-outline" size={18} color="#f87171" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />
      <BackBar title="Add Bank" />

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Add new bank account</Text>

        <TextInput
          value={bankName}
          onChangeText={setBankName}
          placeholder="Bank Name"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />

        <TextInput
          value={iban}
          onChangeText={setIban}
          placeholder="IBAN"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />

        <TextInput
          value={accountHolderName}
          onChangeText={setAccountHolderName}
          placeholder="Account Holder Name"
          placeholderTextColor="#94a3b8"
          style={styles.input}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Bank</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Saved accounts</Text>
        {accounts.length === 0 ? (
          <Text style={styles.emptyText}>No bank accounts added yet.</Text>
        ) : (
          <FlatList
            data={accounts}
            keyExtractor={(item) => item.id}
            renderItem={renderAccountItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
    paddingHorizontal: 15,
  },
  formCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#1f2937',
    borderColor: '#1E90FF',
    borderWidth: 1,
    borderRadius: 12,
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  listSection: {
    marginTop: 20,
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  accountCard: {
    backgroundColor: '#111827',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountDetails: {
    flex: 1,
    marginRight: 10,
  },
  accountBankName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  accountSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 2,
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AddBankScreen;
