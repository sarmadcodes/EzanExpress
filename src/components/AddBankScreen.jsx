import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Linking, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import BackBar from './BackBar';
import { BASE_API_URI } from '../constant/API';

const AddBankScreen = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const appState = useRef(AppState.currentState);

  const getHeaders = async () => {
    const token = await AsyncStorage.getItem('usertoken');
    if (!token) throw new Error('Please log in again.');
    return { Authorization: `Bearer ${token}` };
  };

  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_API_URI}/withdrawals/connect/status`, { headers: await getHeaders() });
      setStatus(response.data?.status || response.data);
    } catch (error) {
      setStatus(null);
      setFeedback({
        type: 'error',
        title: 'Bank status unavailable',
        message: error?.response?.data?.error || error?.response?.data?.message || error.message || 'Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadStatus(); }, [loadStatus]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', nextState => {
      const returned = /inactive|background/.test(appState.current) && nextState === 'active';
      appState.current = nextState;
      if (returned) loadStatus();
    });
    return () => listener.remove();
  }, [loadStatus]);

  const addBankAccount = async () => {
    try {
      setOpening(true);
      const response = await axios.post(
        `${BASE_API_URI}/withdrawals/connect/onboarding-link`,
        { country: 'GB' },
        { headers: await getHeaders() },
      );
      const url = response.data.url;
      if (!url) throw new Error('Bank setup link was not returned.');
      await Linking.openURL(url);
    } catch (error) {
      console.log('Stripe onboarding error:', error.response?.data || error.message);
      setFeedback({ type: 'error', title: 'Unable to add bank', message: error.response?.data?.error || 'Unable to start Stripe onboarding' });
    } finally {
      setOpening(false);
    }
  };

  const payoutsEnabled = Boolean(status?.payoutsEnabled);
  const hasBank = Boolean(status?.bank?.name);

  return <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#0B121C" />
    <BackBar title="Add Bank" />
    {loading ? <ActivityIndicator style={styles.loader} size="large" color="#1E90FF" /> : <>
      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Add new bank account</Text>
        <Text style={styles.description}>Securely link the bank account you want to use for withdrawals.</Text>
        {feedback ? <View style={[styles.feedback, feedback.type === 'error' ? styles.errorFeedback : styles.successFeedback]}><Ionicons name={feedback.type === 'error' ? 'alert-circle-outline' : 'checkmark-circle-outline'} size={20} color={feedback.type === 'error' ? '#fca5a5' : '#6ee7b7'} /><View style={styles.feedbackCopy}><Text style={styles.feedbackTitle}>{feedback.title}</Text><Text style={styles.feedbackMessage}>{feedback.message}</Text></View><TouchableOpacity onPress={() => setFeedback(null)}><Ionicons name="close" size={18} color="#94a3b8" /></TouchableOpacity></View> : null}
        <View style={styles.secureField}><Ionicons name="shield-checkmark-outline" size={20} color="#60a5fa" /><View style={styles.fieldCopy}><Text style={styles.fieldTitle}>Bank details and verification</Text><Text style={styles.fieldSubtitle}>Completed securely in the next step</Text></View></View>
        <TouchableOpacity style={[styles.saveButton, opening && styles.disabled]} onPress={addBankAccount} disabled={opening}>{opening ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>{payoutsEnabled ? 'Manage bank account' : 'Add bank account'}</Text>}</TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        <View style={styles.listHeader}><Text style={styles.sectionTitle}>Saved account</Text><TouchableOpacity onPress={loadStatus}><Ionicons name="refresh" size={19} color="#60a5fa" /></TouchableOpacity></View>
        {!hasBank ? <Text style={styles.emptyText}>No bank account connected yet. Add one to enable withdrawals.</Text> : <View style={styles.accountCard}>
          <View style={styles.accountIcon}><Ionicons name="business-outline" size={22} color="#60a5fa" /></View>
          <View style={styles.accountDetails}><Text style={styles.accountBankName}>{status.bank.name}</Text><Text style={styles.accountSubtitle}>Account ending in {status.bank.last4 || '••••'}</Text><Text style={[styles.accountStatus, payoutsEnabled ? styles.enabled : styles.pending]}>{payoutsEnabled ? 'Payouts enabled' : 'Verification in progress'}</Text></View>
          <Ionicons name={payoutsEnabled ? 'checkmark-circle' : 'time-outline'} size={21} color={payoutsEnabled ? '#34d399' : '#fbbf24'} />
        </View>}
      </View>
    </>}
  </SafeAreaView>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B121C', paddingHorizontal: 15 }, loader: { marginTop: 65 },
  formCard: { backgroundColor: '#111827', borderRadius: 16, padding: 16, marginTop: 20 }, sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 10 }, description: { color: '#94a3b8', fontSize: 13, lineHeight: 19, marginBottom: 16 }, feedback: { borderRadius: 10, padding: 11, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, borderWidth: 1 }, errorFeedback: { backgroundColor: '#3f151a', borderColor: '#7f1d1d' }, successFeedback: { backgroundColor: '#0d2d22', borderColor: '#166534' }, feedbackCopy: { flex: 1, marginHorizontal: 8 }, feedbackTitle: { color: '#fff', fontSize: 13, fontWeight: '700' }, feedbackMessage: { color: '#cbd5e1', fontSize: 12, lineHeight: 17, marginTop: 2 },
  secureField: { minHeight: 65, borderRadius: 12, backgroundColor: '#1f2937', borderColor: '#334155', borderWidth: 1, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' }, fieldCopy: { marginLeft: 10, flex: 1 }, fieldTitle: { color: '#f8fafc', fontSize: 14, fontWeight: '600' }, fieldSubtitle: { color: '#94a3b8', fontSize: 12, marginTop: 3 },
  saveButton: { backgroundColor: '#1E90FF', borderRadius: 12, height: 54, marginTop: 16, justifyContent: 'center', alignItems: 'center' }, disabled: { opacity: .6 }, saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  listSection: { marginTop: 24 }, listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, emptyText: { color: '#94a3b8', fontSize: 14, textAlign: 'center', marginTop: 20 },
  accountCard: { backgroundColor: '#111827', borderRadius: 14, padding: 14, marginTop: 12, borderWidth: 1, borderColor: '#1e293b', flexDirection: 'row', alignItems: 'center' }, accountIcon: { width: 43, height: 43, borderRadius: 22, backgroundColor: '#172554', justifyContent: 'center', alignItems: 'center', marginRight: 12 }, accountDetails: { flex: 1 }, accountBankName: { color: '#fff', fontSize: 16, fontWeight: '700' }, accountSubtitle: { color: '#94a3b8', fontSize: 13, marginTop: 4 }, accountStatus: { fontSize: 12, fontWeight: '600', marginTop: 5 }, enabled: { color: '#34d399' }, pending: { color: '#fbbf24' },
});

export default AddBankScreen;
