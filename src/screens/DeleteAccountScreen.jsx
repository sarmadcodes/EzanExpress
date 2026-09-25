import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackBar from '../components/BackBar';
import api, { clearToken } from '../services/api';
import { USER } from '../context/User';

const DeleteAccountScreen = ({ navigation }) => {
  const { setUserData } = useContext(USER);

  const [checking, setChecking] = useState(true);
  const [canDelete, setCanDelete] = useState(false);
  const [blockers, setBlockers] = useState([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const loadStatus = useCallback(async () => {
    setChecking(true);
    setError('');

    try {
      const { data } = await api.get('/account/deletion-status');

      setCanDelete(data?.can_delete === true);
      setBlockers(Array.isArray(data?.blockers) ? data.blockers : []);
    } catch (err) {
      setError(err?.message || 'Unable to check your account right now.');
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const performDelete = async () => {
    setDeleting(true);
    setError('');

    try {
      await api.delete('/account', { data: { password } });

      await clearToken();
      setUserData({});

      navigation.reset({ index: 0, routes: [{ name: 'WelcomeScreen' }] });
    } catch (err) {
      setError(err?.message || 'Unable to delete your account.');
      setDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (!password) {
      setError('Please enter your password to confirm.');
      return;
    }

    Alert.alert(
      'Delete account',
      'This permanently deletes your account and personal data. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete my account',
          style: 'destructive',
          onPress: performDelete,
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />

      <BackBar title="Delete Account" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.iconCircle}>
            <Ionicons name="trash-outline" size={30} color="#FF6B6B" />
          </View>

          <Text style={styles.title}>Delete your account</Text>

          <Text style={styles.body}>
            This permanently removes your profile, your trips and your
            documents. It cannot be undone.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What happens</Text>

            <View style={styles.point}>
              <Ionicons name="close-circle" size={16} color="#FF6B6B" />
              <Text style={styles.pointText}>
                Your profile, trips, uploaded documents and notifications are
                deleted
              </Text>
            </View>

            <View style={styles.point}>
              <Ionicons name="information-circle" size={16} color="#55A9FF" />
              <Text style={styles.pointText}>
                Completed delivery and payment records are kept without your
                personal details, because we are required to keep financial
                history
              </Text>
            </View>

            <View style={styles.point}>
              <Ionicons name="log-out-outline" size={16} color="#93A6BD" />
              <Text style={styles.pointText}>
                You will be signed out straight away and cannot sign in again
              </Text>
            </View>
          </View>

          {checking ? (
            <View style={styles.checking}>
              <ActivityIndicator size="small" color="#1363C8" />
              <Text style={styles.checkingText}>Checking your account…</Text>
            </View>
          ) : blockers.length > 0 ? (
            <View style={styles.blockerBox}>
              <Text style={styles.blockerTitle}>
                Finish these before deleting
              </Text>

              {blockers.map(item => (
                <View key={item} style={styles.point}>
                  <Ionicons name="alert-circle" size={16} color="#F5B301" />
                  <Text style={styles.pointText}>{item}</Text>
                </View>
              ))}

              <TouchableOpacity onPress={loadStatus} style={styles.refreshBtn}>
                <Text style={styles.refreshText}>Check again</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.label}>Confirm your password</Text>

              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={19} color="#718399" />

                <TextInput
                  value={password}
                  onChangeText={value => {
                    setPassword(value);
                    setError('');
                  }}
                  placeholder="Your password"
                  placeholderTextColor="#55657A"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={styles.input}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword(previous => !previous)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={19}
                    color="#718399"
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {!checking && canDelete ? (
            <TouchableOpacity
              onPress={confirmDelete}
              disabled={deleting || !password}
              style={[
                styles.deleteBtn,
                (deleting || !password) && styles.deleteBtnDisabled,
              ]}
            >
              {deleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.deleteBtnText}>Delete my account</Text>
              )}
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelBtn}
            disabled={deleting}
          >
            <Text style={styles.cancelText}>Keep my account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B121C' },
  flex: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  iconCircle: {
    alignSelf: 'center',
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#2A1418',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  title: {
    color: '#F5F8FC',
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
  },
  body: {
    color: '#93A6BD',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
  },

  card: {
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    gap: 12,
  },
  cardTitle: { color: '#F5F8FC', fontSize: 15, fontWeight: '700' },
  point: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  pointText: { flex: 1, color: '#B7C4D4', fontSize: 13, lineHeight: 19 },

  checking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
  },
  checkingText: { color: '#93A6BD', fontSize: 13 },

  blockerBox: {
    backgroundColor: '#241D0E',
    borderWidth: 1,
    borderColor: '#4A3A14',
    borderRadius: 14,
    padding: 16,
    marginTop: 22,
    gap: 12,
  },
  blockerTitle: { color: '#F5B301', fontSize: 14, fontWeight: '700' },
  refreshBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  refreshText: { color: '#55A9FF', fontSize: 13, fontWeight: '600' },

  label: {
    color: '#B7C4D4',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  input: { flex: 1, color: '#F5F8FC', fontSize: 15 },

  error: { color: '#FF9B9B', fontSize: 13, marginTop: 14 },

  deleteBtn: {
    backgroundColor: '#C0392B',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  deleteBtnDisabled: { opacity: 0.5 },
  deleteBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  cancelBtn: { paddingVertical: 16, alignItems: 'center' },
  cancelText: { color: '#93A6BD', fontSize: 14, fontWeight: '600' },
});
