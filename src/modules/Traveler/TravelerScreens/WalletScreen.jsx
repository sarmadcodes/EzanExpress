import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BackBar from '../../../components/BackBar';
import { BASE_API_URI } from '../../../constant/API';

const toNumber = amount => Number(amount || 0);

const WalletScreen = () => {
  const navigation = useNavigation();
  const [wallet, setWallet] = useState({ availableBalance: 0, pendingBalance: 0, currency: 'gbp' });
  const [connect, setConnect] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const headers = async () => {
    const token = await AsyncStorage.getItem('usertoken');
    if (!token) throw new Error('Please log in again.');
    return { Authorization: `Bearer ${token}` };
  };

  const loadWallet = useCallback(async () => {
    try {
      setError('');
      const auth = { headers: await headers() };
      const [summaryResponse, connectResponse, withdrawalsResponse] = await Promise.all([
        axios.get(`${BASE_API_URI}/wallet`, auth),
        axios.get(`${BASE_API_URI}/withdrawals/connect/status`, auth),
        axios.get(`${BASE_API_URI}/withdrawals`, auth),
      ]);
      const summary = summaryResponse.data?.wallet || summaryResponse.data;
      const history = withdrawalsResponse.data?.withdrawals || withdrawalsResponse.data?.data || withdrawalsResponse.data || [];
      setWallet({ availableBalance: toNumber(summary?.availableBalance), pendingBalance: toNumber(summary?.pendingBalance), currency: String(summary?.currency || 'gbp').toLowerCase() });
      setConnect(connectResponse.data?.status || connectResponse.data);
      setWithdrawals(Array.isArray(history) ? history : []);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to load wallet.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadWallet(); }, [loadWallet]);
  useEffect(() => navigation.addListener('focus', loadWallet), [navigation, loadWallet]);

  const money = amount => `${wallet.currency === 'gbp' ? '£' : wallet.currency === 'usd' ? '$' : `${wallet.currency.toUpperCase()} `}${toNumber(amount).toFixed(2)}`;
  const payoutsEnabled = Boolean(connect?.payoutsEnabled);
  const withdrawalItem = ({ item }) => <View style={styles.item}>
    <View style={styles.itemIcon}><Ionicons name="arrow-up-outline" size={20} color="#fbbf24" /></View>
    <View style={styles.itemCopy}><Text style={styles.itemTitle}>Withdrawal request</Text><Text style={styles.itemSub}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Bank transfer'}</Text></View>
    <View style={styles.itemRight}><Text style={styles.itemAmount}>-{money(item.amount)}</Text><Text style={styles.itemStatus}>{String(item.status || 'requested').replaceAll('_', ' ')}</Text></View>
  </View>;

  return <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#0B121C" />
    <BackBar title="My Wallet" />
    <View style={styles.balanceCard}><View style={styles.balanceHeader}><Text style={styles.balanceLabel}>Available balance</Text><TouchableOpacity onPress={() => setVisible(value => !value)}><Ionicons name={visible ? 'eye-outline' : 'eye-off-outline'} size={20} color="#94a3b8" /></TouchableOpacity></View><Text style={styles.balance}>{visible ? money(wallet.availableBalance) : '••••••'}</Text>{wallet.pendingBalance > 0 ? <Text style={styles.pending}>Pending withdrawals: {money(wallet.pendingBalance)}</Text> : null}</View>

    <View style={styles.buttons}><TouchableOpacity style={[styles.withdraw, !payoutsEnabled && styles.disabled]} onPress={() => payoutsEnabled && navigation.navigate('WithdrawScreen')} disabled={!payoutsEnabled}><Ionicons name="arrow-up-outline" size={20} color="#fff" /><Text style={styles.buttonText}>Withdraw</Text></TouchableOpacity><TouchableOpacity style={styles.bankButton} onPress={() => navigation.navigate('AddBankScreen')}><Ionicons name="business-outline" size={20} color="#fff" /><Text style={styles.buttonText}>{payoutsEnabled ? 'Bank' : 'Add Bank'}</Text></TouchableOpacity></View>
    {!payoutsEnabled ? <TouchableOpacity style={styles.setupNotice} onPress={() => navigation.navigate('AddBankScreen')}><Ionicons name="information-circle-outline" size={17} color="#fbbf24" /><Text style={styles.setupText}>Complete bank setup to enable withdrawals.</Text></TouchableOpacity> : null}

    <View style={styles.historyHeader}><Text style={styles.sectionTitle}>Withdrawal history</Text><TouchableOpacity onPress={loadWallet}><Ionicons name="refresh" size={19} color="#60a5fa" /></TouchableOpacity></View>
    {loading ? <ActivityIndicator style={styles.loader} color="#60a5fa" size="large" /> : null}
    {!loading && error ? <View style={styles.empty}><Text style={styles.emptyText}>{error}</Text><TouchableOpacity onPress={loadWallet}><Text style={styles.retry}>Try again</Text></TouchableOpacity></View> : null}
    {!loading && !error ? <FlatList data={withdrawals} keyExtractor={(item, index) => String(item.id || item._id || index)} renderItem={withdrawalItem} refreshControl={<RefreshControl refreshing={false} onRefresh={loadWallet} tintColor="#60a5fa" />} ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>No withdrawal requests yet.</Text></View>} contentContainerStyle={styles.list} /> : null}
  </SafeAreaView>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B121C', paddingHorizontal: 15 }, balanceCard: { backgroundColor: '#1e293b', borderRadius: 22, padding: 22, marginTop: 20, marginBottom: 22 }, balanceHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, balanceLabel: { color: '#94a3b8', fontSize: 15 }, balance: { color: '#fff', fontSize: 38, fontWeight: '800', marginTop: 8 }, pending: { color: '#fbbf24', fontSize: 13, fontWeight: '600', marginTop: 11 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between' }, withdraw: { height: 55, borderRadius: 12, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: .48 }, bankButton: { height: 55, borderRadius: 12, backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: .48 }, disabled: { opacity: .45 }, buttonText: { color: '#fff', fontWeight: '700', fontSize: 15, marginLeft: 7 },
  setupNotice: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2d2108', padding: 11, borderRadius: 10, marginTop: 12 }, setupText: { color: '#fde68a', fontSize: 12, marginLeft: 7 }, historyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 25, marginBottom: 8 }, sectionTitle: { color: '#fff', fontSize: 19, fontWeight: '700' }, loader: { marginTop: 42 }, list: { flexGrow: 1, paddingBottom: 24 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1e293b' }, itemIcon: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2d2108', marginRight: 12 }, itemCopy: { flex: 1 }, itemTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '600' }, itemSub: { color: '#94a3b8', fontSize: 12, marginTop: 3 }, itemRight: { alignItems: 'flex-end' }, itemAmount: { color: '#f8fafc', fontWeight: '700', fontSize: 14 }, itemStatus: { color: '#fbbf24', textTransform: 'uppercase', fontSize: 10, fontWeight: '700', marginTop: 3 },
  empty: { alignItems: 'center', paddingTop: 45 }, emptyText: { color: '#94a3b8', fontSize: 14, textAlign: 'center' }, retry: { color: '#60a5fa', fontWeight: '700', marginTop: 10 },
});

export default WalletScreen;
