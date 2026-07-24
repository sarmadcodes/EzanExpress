import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackBar from '../../../components/BackBar';

const ACTIVITIES_STORAGE_KEY = 'ezan_wallet_activities';

const DEFAULT_ACTIVITIES = [
  {
    id: 'seed-earning-1',
    title: 'Delivery #4928',
    subtitle: 'NYC (JFK) to London (LHR)',
    amount: 120.0,
    date: 'Oct 24',
    type: 'delivery_flight',
  },
  {
    id: 'seed-earning-2',
    title: 'Delivery #4904',
    subtitle: 'Berlin to Istanbul',
    amount: 95.0,
    date: 'Oct 16',
    type: 'delivery_box',
  },
];

const WalletComp = () => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [activities, setActivities] = useState([]);
  const totalBalance = "$0.00";
  const pendingAmount = activities.filter((item) => item.status === 'Pending').reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const navigation = useNavigation();

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const storedActivities = await AsyncStorage.getItem(ACTIVITIES_STORAGE_KEY);
      if (storedActivities) {
        const parsedActivities = JSON.parse(storedActivities);
        setActivities(parsedActivities.length > 0 ? parsedActivities : DEFAULT_ACTIVITIES);
      } else {
        setActivities(DEFAULT_ACTIVITIES);
      }
    } catch (error) {
      console.log(error);
      setActivities(DEFAULT_ACTIVITIES);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadActivities();
    });

    return unsubscribe;
  }, [navigation]);

  const renderTransactionIcon = (type) => {
    let iconName = 'airplane-outline';
    if (type === 'delivery_box') iconName = 'cube-outline';
    if (type === 'withdrawal') iconName = 'card-outline';

    return (
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={22} color="#5dade2" />
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={styles.leftRow}>
        {renderTransactionIcon(item.type)}
        <View style={styles.textDetails}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.rightRow}>
        {item.status ? (
          <Text style={styles.statusText}>{item.status}</Text>
        ) : null}
        <Text
          style={[
            styles.amountText,
            { color: item.amount > 0 ? '#2ecc71' : '#ffffff' },
          ]}
        >
          {item.amount > 0
            ? `+$${item.amount.toFixed(2)}`
            : `-$${Math.abs(item.amount).toFixed(2)}`}
        </Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#0B121C', paddingHorizontal:15}}>
      <StatusBar barStyle='light-content' backgroundColor='#0B121C' />
      <BackBar title='My Wallet' />

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
            <Ionicons
              name={isBalanceVisible ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#94a3b8"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.balanceAmount}>
          {isBalanceVisible ? totalBalance : '••••••'}
        </Text>

        {pendingAmount > 0 && (
          <View style={styles.pendingContainer}>
            <Ionicons
              name="ellipsis-horizontal-circle-outline"
              size={16}
              color="#2ecc71"
            />
            <Text style={styles.pendingText}>
              Pending: ${pendingAmount.toFixed(2)}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.withdrawButton}
          onPress={() => navigation.navigate('WithdrawScreen')}
        >
          <Ionicons
            name="arrow-up-outline"
            size={20}
            color="#FFF"
            style={styles.btnIcon}
          />
          <Text style={styles.buttonText}>Withdraw</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBankButton}
          onPress={() => navigation.navigate('AddBankScreen')}
        >
          <Ionicons
            name="business-outline"
            size={20}
            color="#FFF"
            style={styles.btnIcon}
          />
          <Text style={styles.buttonText}>Add Bank</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Activities List */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllTransactions')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {activities.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No activities yet</Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  balanceCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 25,
    marginTop: 20,
    marginBottom: 25,
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
  statusText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  dateText: {
    color: '#64748b',
    fontSize: 12,
  },
});

export default WalletComp;
