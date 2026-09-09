import Ionicons from '@react-native-vector-icons/ionicons';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import api, {clearToken} from '../services/api';

const AccountPendingScreen = ({navigation, route}) => {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');
  const [rejected, setRejected] = useState(
    Boolean(route?.params?.rejection_reason),
  );
  const [reason, setReason] = useState(route?.params?.rejection_reason || '');

  const goToDashboard = useCallback(user => {
    if (!user?.user_type) {
      navigation.reset({index: 0, routes: [{name: 'RoleScreen'}]});
      return;
    }

    if (user.user_type === 'traveler') {
      navigation.reset({
        index: 0,
        routes: [
          {
            name:
              user.is_traveler_verify === true
                ? 'TravelerDashboard'
                : 'FlightDetails',
          },
        ],
      });
      return;
    }

    navigation.reset({index: 0, routes: [{name: 'SenderDashboard'}]});
  }, [navigation]);

  const recheck = useCallback(async () => {
    setChecking(true);
    setMessage('');

    try {
      const {data} = await api.get('/login');
      const user = data?.user;

      if (user?.is_account_approved === true) {
        goToDashboard(user);
        return;
      }

      if (user?.account_rejection_reason) {
        setRejected(true);
        setReason(user.account_rejection_reason);
      } else {
        setMessage('Still waiting for review. Please check back later.');
      }
    } catch (err) {
      setMessage(err?.message || 'Unable to check your status right now.');
    } finally {
      setChecking(false);
    }
  }, [goToDashboard]);

  const signOut = async () => {
    await clearToken();
    navigation.reset({index: 0, routes: [{name: 'WelcomeScreen'}]});
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={checking}
            onRefresh={recheck}
            tintColor="#1363C8"
            colors={['#1363C8']}
          />
        }>
        <View
          style={[styles.iconCircle, rejected && styles.iconCircleRejected]}>
          <Ionicons
            name={rejected ? 'close-circle-outline' : 'time-outline'}
            size={40}
            color={rejected ? '#EF4444' : '#F5B301'}
          />
        </View>

        <Text style={styles.title}>
          {rejected ? 'Account not approved' : 'Account under review'}
        </Text>

        <Text style={styles.body}>
          {rejected
            ? reason ||
              'Your account did not meet our verification requirements.'
            : 'Thanks for signing up. Our team reviews every new account before it can be used. This usually takes a short while.'}
        </Text>

        {!rejected ? (
          <View style={styles.steps}>
            <View style={styles.step}>
              <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
              <Text style={styles.stepText}>Email verified</Text>
            </View>

            <View style={styles.step}>
              <ActivityIndicator size="small" color="#F5B301" />
              <Text style={styles.stepText}>Waiting for admin approval</Text>
            </View>

            <View style={styles.step}>
              <Ionicons name="ellipse-outline" size={18} color="#ffffff45" />
              <Text style={[styles.stepText, styles.stepPending]}>
                Full access unlocked
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.help}>
            If you believe this is a mistake, please contact support.
          </Text>
        )}

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity
          onPress={recheck}
          disabled={checking}
          style={[styles.primaryBtn, checking && styles.btnDisabled]}>
          {checking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Check again</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={signOut} style={styles.secondaryBtn}>
          <Text style={styles.secondaryBtnText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountPendingScreen;

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#0B121C'},
  content: {flexGrow: 1, justifyContent: 'center', padding: 24},
  iconCircle: {
    alignSelf: 'center',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#F5B3011A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleRejected: {backgroundColor: '#EF44441A'},
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
  },
  body: {
    color: '#ffffffb0',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 12,
  },
  steps: {
    marginTop: 28,
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  step: {flexDirection: 'row', alignItems: 'center', gap: 10},
  stepText: {color: '#ffffffd0', fontSize: 14},
  stepPending: {color: '#ffffff60'},
  help: {
    color: '#ffffff90',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
  message: {
    color: '#F5B301',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 18,
  },
  primaryBtn: {
    backgroundColor: '#1363C8',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 28,
  },
  btnDisabled: {opacity: 0.6},
  primaryBtnText: {color: '#fff', fontSize: 15, fontWeight: '700'},
  secondaryBtn: {paddingVertical: 14, alignItems: 'center'},
  secondaryBtnText: {color: '#ffffff90', fontSize: 14, fontWeight: '600'},
});
