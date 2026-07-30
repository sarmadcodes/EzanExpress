import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BackBar from './BackBar';
import { BASE_API_URI } from '../constant/API';

const value = item => Number(item || 0);

const WithdrawScreen = () => {
  const navigation = useNavigation();
  const [wallet, setWallet] = useState({ availableBalance: 0, pendingBalance: 0, currency: 'gbp' });
  const [bankStatus, setBankStatus] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const headers = async () => {
    const token = await AsyncStorage.getItem('usertoken');
    if (!token) throw new Error('Please log in again.');
    return { Authorization: `Bearer ${token}` };
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const auth = { headers: await headers() };
      const [walletResponse, statusResponse, historyResponse] = await Promise.all([
        axios.get(`${BASE_API_URI}/wallet`, auth),
        axios.get(`${BASE_API_URI}/withdrawals/connect/status`, auth),
        axios.get(`${BASE_API_URI}/withdrawals`, auth),
      ]);
      const summary = walletResponse.data?.wallet || walletResponse.data;
      const history = historyResponse.data?.withdrawals || historyResponse.data?.data || historyResponse.data || [];
      setWallet({
        availableBalance: value(summary?.availableBalance),
        pendingBalance: value(summary?.pendingBalance),
        currency: String(summary?.currency || 'gbp').toLowerCase(),
      });
      setBankStatus(statusResponse.data?.status || statusResponse.data);
      setWithdrawals(Array.isArray(history) ? history : []);
    } catch (error) {
      setFeedback({
        type: 'error',
        title: 'Unable to load withdrawal details',
        message: error?.response?.data?.error || error?.response?.data?.message || error.message || 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => navigation.addListener('focus', loadData), [navigation, loadData]);

  const money = amountValue => `${wallet.currency === 'gbp' ? '£' : wallet.currency === 'usd' ? '$' : `${wallet.currency.toUpperCase()} `}${value(amountValue).toFixed(2)}`;
  const payoutsEnabled = Boolean(bankStatus?.payoutsEnabled);
  const requestedAmount = value(amount);

  const submit = async () => {
    if (!payoutsEnabled) {
      setFeedback({ type: 'error', title: 'Bank setup required', message: 'Complete your bank setup before requesting a withdrawal.' });
      return;
    }
    if (!requestedAmount || requestedAmount <= 0) {
      setFeedback({ type: 'error', title: 'Enter a valid amount', message: 'Use an amount greater than zero.' });
      return;
    }
    if (requestedAmount > wallet.availableBalance) {
      setFeedback({ type: 'error', title: 'Insufficient balance', message: `You can withdraw up to ${money(wallet.availableBalance)}.` });
      return;
    }
    try {
      setSubmitting(true);
      await axios.post(`${BASE_API_URI}/withdrawals`, { amount: requestedAmount }, { headers: await headers() });
      setAmount('');
      setFeedback({ type: 'success', title: 'Request submitted', message: 'Your withdrawal is pending admin approval.' });
      loadData();
    } catch (error) {
      setFeedback({
        type: 'error',
        title: 'Unable to request withdrawal',
        message: error?.response?.data?.error || error?.response?.data?.message || error.message || 'Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#0B121C" />
    <BackBar title="Withdraw" />
    {loading ? <ActivityIndicator style={styles.loader} size="large" color="#60a5fa" /> : <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.balanceCard}><Text style={styles.balanceLabel}>Available to withdraw</Text><Text style={styles.balance}>{money(wallet.availableBalance)}</Text>{wallet.pendingBalance > 0 ? <Text style={styles.pending}>Pending requests: {money(wallet.pendingBalance)}</Text> : null}</View>

      <View style={styles.bankCard}><Ionicons name={payoutsEnabled ? 'checkmark-circle' : 'alert-circle-outline'} size={24} color={payoutsEnabled ? '#34d399' : '#fbbf24'} /><View style={styles.bankCopy}><Text style={styles.bankTitle}>{payoutsEnabled ? (bankStatus?.bank?.name || 'Verified bank account') : 'Bank account required'}</Text><Text style={styles.bankText}>{payoutsEnabled ? `Payouts enabled${bankStatus?.bank?.last4 ? ` •••• ${bankStatus.bank.last4}` : ''}` : 'Complete Stripe setup to enable withdrawals.'}</Text></View>{!payoutsEnabled ? <TouchableOpacity onPress={() => navigation.navigate('AddBankScreen')}><Text style={styles.setup}>Set up</Text></TouchableOpacity> : null}</View>
      {feedback ? <View style={[styles.feedback, feedback.type === 'error' ? styles.errorFeedback : styles.successFeedback]}><Ionicons name={feedback.type === 'error' ? 'alert-circle-outline' : 'checkmark-circle-outline'} size={20} color={feedback.type === 'error' ? '#fca5a5' : '#6ee7b7'} /><View style={styles.feedbackCopy}><Text style={styles.feedbackTitle}>{feedback.title}</Text><Text style={styles.feedbackMessage}>{feedback.message}</Text></View><TouchableOpacity onPress={() => setFeedback(null)}><Ionicons name="close" size={18} color="#94a3b8" /></TouchableOpacity></View> : null}

      <Text style={styles.label}>Withdrawal amount</Text>
      <View style={[styles.inputBox, !payoutsEnabled && styles.inputDisabled]}><Text style={styles.currency}>{wallet.currency.toUpperCase()}</Text><TextInput value={amount} onChangeText={setAmount} editable={payoutsEnabled} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor="#64748b" style={styles.input} /></View>
      <TouchableOpacity style={[styles.requestButton, (!payoutsEnabled || submitting) && styles.disabled]} onPress={submit} disabled={!payoutsEnabled || submitting}>{submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.requestText}>Request withdrawal</Text>}</TouchableOpacity>
      <View style={styles.infoNote}><Ionicons name="information-circle-outline" size={17} color="#93c5fd" /><Text style={styles.infoText}>Requests are reviewed by admin before the money is sent to your bank.</Text></View>

      <View style={styles.historyHeader}><Text style={styles.historyTitle}>Withdrawal history</Text><TouchableOpacity onPress={loadData}><Ionicons name="refresh" size={19} color="#60a5fa" /></TouchableOpacity></View>
      {withdrawals.length === 0 ? <Text style={styles.empty}>No withdrawal requests yet.</Text> : withdrawals.map((item, index) => <View key={String(item.id || item._id || index)} style={styles.historyRow}><View><Text style={styles.historyAmount}>{money(item.amount)}</Text><Text style={styles.historyDate}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB') : 'Withdrawal request'}</Text></View><Text style={styles.requested}>{String(item.status || 'requested').replaceAll('_', ' ')}</Text></View>)}
    </ScrollView>}
  </SafeAreaView>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B121C', paddingHorizontal: 15 }, loader: { marginTop: 60 }, content: { paddingTop: 20, paddingBottom: 35 },
  balanceCard: { backgroundColor: '#1e293b', borderRadius: 18, padding: 20 }, balanceLabel: { color: '#94a3b8', fontSize: 14 }, balance: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 7 }, pending: { color: '#fbbf24', marginTop: 10, fontSize: 13, fontWeight: '600' },
  bankCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderRadius: 14, padding: 14, marginTop: 18, borderWidth: 1, borderColor: '#1e293b' }, bankCopy: { flex: 1, marginLeft: 10 }, bankTitle: { color: '#f8fafc', fontSize: 14, fontWeight: '700' }, bankText: { color: '#94a3b8', fontSize: 12, marginTop: 3 }, setup: { color: '#60a5fa', fontWeight: '700', fontSize: 13 },
  label: { color: '#e2e8f0', fontSize: 14, fontWeight: '700', marginTop: 24, marginBottom: 8 }, inputBox: { height: 56, borderRadius: 12, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }, inputDisabled: { opacity: .55 }, currency: { color: '#94a3b8', fontSize: 12, fontWeight: '700', marginRight: 10 }, input: { color: '#fff', fontSize: 18, flex: 1 },
  requestButton: { height: 55, borderRadius: 12, backgroundColor: '#2563eb', marginTop: 16, justifyContent: 'center', alignItems: 'center' }, disabled: { opacity: .5 }, requestText: { color: '#fff', fontSize: 16, fontWeight: '700' }, infoNote: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, padding: 11, borderRadius: 10, backgroundColor: '#172554' }, infoText: { color: '#dbeafe', fontSize: 12, lineHeight: 17, flex: 1, marginLeft: 7 },
  feedback: { borderRadius: 10, padding: 11, flexDirection: 'row', alignItems: 'flex-start', marginTop: 12, borderWidth: 1 }, errorFeedback: { backgroundColor: '#3f151a', borderColor: '#7f1d1d' }, successFeedback: { backgroundColor: '#0d2d22', borderColor: '#166534' }, feedbackCopy: { flex: 1, marginHorizontal: 8 }, feedbackTitle: { color: '#fff', fontSize: 13, fontWeight: '700' }, feedbackMessage: { color: '#cbd5e1', fontSize: 12, lineHeight: 17, marginTop: 2 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 8 }, historyTitle: { color: '#fff', fontSize: 18, fontWeight: '700' }, empty: { color: '#94a3b8', textAlign: 'center', marginTop: 24 }, historyRow: { backgroundColor: '#111827', padding: 14, marginTop: 9, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, historyAmount: { color: '#fff', fontSize: 15, fontWeight: '700' }, historyDate: { color: '#94a3b8', fontSize: 12, marginTop: 4 }, requested: { color: '#fbbf24', textTransform: 'uppercase', fontSize: 10, fontWeight: '700' },
});

export default WithdrawScreen;
