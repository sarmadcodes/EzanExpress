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
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../src/components/BackBar';
import { useNavigation } from '@react-navigation/native';
import { USER } from '../context/User';
import { LOADING } from '../context/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_API_URI } from '../constant/API';

const BANKS_STORAGE_KEY = 'ezan_bank_accounts';
const ACTIVITIES_STORAGE_KEY = 'ezan_wallet_activities';

const WithdrawScreen = () => {
  const navigation = useNavigation();
  const { userData, setUserData } = useContext(USER);
  const { loading, setLoading } = useContext(LOADING);
  const [amount, setAmount] = useState('');
  const [selectedBankId, setSelectedBankId] = useState('');
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    loadAccounts();

    const unsubscribe = navigation.addListener('focus', () => {
      loadAccounts();
    });

    return unsubscribe;
  }, [navigation]);

  const loadAccounts = async () => {
    try {
      const storedAccounts = await AsyncStorage.getItem(BANKS_STORAGE_KEY);
      if (storedAccounts) {
        const parsed = JSON.parse(storedAccounts);
        setAccounts(parsed);
        if (parsed.length > 0) {
          setSelectedBankId(parsed[0].id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onCreateRequest = async () => {
    if (!amount || Number(amount) <= 0) {
      Alert.alert('Enter a valid amount!');
      return;
    }

    if (!selectedBankId) {
      Alert.alert('Select a bank account');
      return;
    }

    const chosenBank = accounts.find((account) => account.id === selectedBankId);

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('usertoken');

      await axios.post(
        `${BASE_API_URI}/request`,
        {
          amount: Number(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newActivity = {
        id: Date.now().toString(),
        title: `Withdrawal to ${chosenBank?.bankName || 'Bank'}`,
        subtitle: `${chosenBank?.accountHolderName || 'Account holder'} • ${chosenBank?.iban || 'IBAN'}`,
        amount: -Number(amount),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        type: 'withdrawal',
        status: 'Pending',
      };

      const existingActivities = await AsyncStorage.getItem(ACTIVITIES_STORAGE_KEY);
      const parsedActivities = existingActivities ? JSON.parse(existingActivities) : [];
      const updatedActivities = [newActivity, ...parsedActivities];
      await AsyncStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(updatedActivities));

      Alert.alert('Success', 'Withdrawal request submitted successfully!');
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Server error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#0B121C', paddingHorizontal: 15 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />
      <BackBar title="Withdraw" />
      {/* <WalletComp /> */}
      <View style={{ padding: 10, marginTop: 20 }}>
        <TextInput
          keyboardType="number-pad"
          placeholder="Enter Amount"
          placeholderTextColor="#ffffffde"
          style={{
            color: 'white',
            borderColor: '#1E90FF',
            width: '100%',
            height: 50,
            borderWidth: 1,
            borderRadius: 10,
            fontSize: 18,
            padding: 10,
          }}
          onChangeText={(e)=>setAmount(e)}
        />
        <View style={styles.bankPickerCard}>
          <Text style={styles.bankPickerLabel}>Select Bank</Text>
          {accounts.length === 0 ? (
            <Text style={styles.emptyText}>No saved accounts yet. Add one first.</Text>
          ) : (
            <FlatList
              data={accounts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.bankOption,
                    selectedBankId === item.id && styles.selectedBankOption,
                  ]}
                  onPress={() => setSelectedBankId(item.id)}
                >
                  <Text style={styles.bankOptionTitle}>{item.bankName}</Text>
                  <Text style={styles.bankOptionSubtitle}>{item.accountHolderName}</Text>
                  <Text style={styles.bankOptionSubtitle}>{item.iban}</Text>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={[styles.buttonRow, { marginTop: 20 }]}>
          <TouchableOpacity
            style={styles.withdrawButton}
              onPress={onCreateRequest}
          >
            <Text style={styles.buttonText}>Submit Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addBankButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WithdrawScreen;

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 25,
    marginTop: 20,
    marginBottom: 25,
  },
  bankPickerCard: {
    marginTop: 12,
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E90FF',
  },
  bankPickerLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  bankOption: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedBankOption: {
    borderColor: '#1E90FF',
    backgroundColor: '#172554',
  },
  bankOptionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  bankOptionSubtitle: {
    color: '#94a3b8',
    fontSize: 12,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 13,
    marginVertical: 6,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceLabel: {
    color: '#94a3b8',
    fontSize: 16,
    marginRight: 8,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: 'bold',
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  pendingText: {
    color: '#2ecc71',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  withdrawButton: {
    flex: 0.48,
    backgroundColor: '#1E90FF',
    flexDirection: 'row',
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBankButton: {
    flex: 0.48,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnIcon: {
    marginRight: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#1E90FF',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.7,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textDetails: {
    justifyContent: 'center',
  },
  transactionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionSubtitle: {
    color: '#94a3b8',
    fontSize: 13,
  },
  rightRow: {
    alignItems: 'flex-end',
    flex: 0.3,
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateText: {
    color: '#64748b',
    fontSize: 12,
  },
});
