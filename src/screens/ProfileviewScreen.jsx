import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackBar from '../components/BackBar';
import api from '../services/api';

const initialsOf = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

const formatDate = value => {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
};

const Row = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>
      <Ionicons name={icon} size={18} color="#55A9FF" />
    </View>

    <View style={styles.rowBody}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || 'Not provided'}</Text>
    </View>
  </View>
);

const Badge = ({ active, label }) => (
  <View style={[styles.badge, active && styles.badgeActive]}>
    <Ionicons
      name={active ? 'checkmark-circle' : 'ellipse-outline'}
      size={15}
      color={active ? '#22C55E' : '#718399'}
    />
    <Text style={[styles.badgeText, active && styles.badgeTextActive]}>
      {label}
    </Text>
  </View>
);

const ProfileviewScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    setError('');

    try {
      const { data } = await api.get('/login');

      setUser(data?.user || null);
    } catch (err) {
      setError(err?.message || 'Unable to load your profile right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />

      <BackBar title="My Profile" />

      {loading ? (
        <View style={styles.centre}>
          <ActivityIndicator size="large" color="#1363C8" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={loadProfile}
              tintColor="#1363C8"
              colors={['#1363C8']}
            />
          }
        >
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={18} color="#FF7B7B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(user?.name)}</Text>
          </View>

          <Text style={styles.name}>{user?.name || 'Your profile'}</Text>

          {user?.user_type ? (
            <Text style={styles.role}>
              {user.user_type === 'traveler' ? 'Traveller' : 'Sender'}
            </Text>
          ) : null}

          <View style={styles.badges}>
            <Badge active={user?.is_email_verify === true} label="Email" />
            <Badge active={user?.is_phone_verify === true} label="Mobile" />
            <Badge
              active={user?.is_account_approved === true}
              label="Approved"
            />
          </View>

          <View style={styles.card}>
            <Row icon="mail-outline" label="Email address" value={user?.email} />
            <Row
              icon="call-outline"
              label="Mobile number"
              value={user?.phone_number}
            />
            <Row
              icon="location-outline"
              label="Address"
              value={user?.address}
            />
            <Row
              icon="calendar-outline"
              label="Member since"
              value={formatDate(user?.createdAt)}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfileviewScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B121C' },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20, paddingBottom: 40 },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#2A1418',
    borderWidth: 1,
    borderColor: '#4A2026',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  errorText: { flex: 1, color: '#FFB4B4', fontSize: 13 },

  avatar: {
    alignSelf: 'center',
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#132840',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#55A9FF', fontSize: 30, fontWeight: '700' },

  name: {
    color: '#F5F8FC',
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 14,
  },
  role: {
    color: '#718399',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },

  badges: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeActive: { borderColor: '#1B4332', backgroundColor: '#0F2118' },
  badgeText: { color: '#718399', fontSize: 12, fontWeight: '600' },
  badgeTextActive: { color: '#7BE0A5' },

  card: {
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#18222F',
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#132840',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1 },
  rowLabel: { color: '#718399', fontSize: 12 },
  rowValue: { color: '#F5F8FC', fontSize: 15, fontWeight: '600', marginTop: 3 },
});
