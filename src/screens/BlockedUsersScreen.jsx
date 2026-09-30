import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackBar from '../components/BackBar';
import api from '../services/api';

const BlockedUsersScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [blocked, setBlocked] = useState([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const load = useCallback(async isRefresh => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError('');

    try {
      const { data } = await api.get('/moderation/blocked');

      setBlocked(Array.isArray(data?.blocked) ? data.blocked : []);
    } catch (err) {
      setError(err?.message || 'Unable to load your blocked list.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load(false);
  }, [load]);

  const unblock = async user => {
    setBusyId(user._id);

    try {
      await api.delete(`/moderation/users/${user._id}/block`);

      setBlocked(rows => rows.filter(row => row._id !== user._id));
    } catch (err) {
      Alert.alert('Could not unblock', err?.message || 'Please try again.');
    } finally {
      setBusyId('');
    }
  };

  const confirmUnblock = user => {
    Alert.alert(
      'Unblock user',
      `${user.name} will be able to see your trips and contact you again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unblock', onPress: () => unblock(user) },
      ],
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={20} color="#55A9FF" />
      </View>

      <View style={styles.rowBody}>
        <Text style={styles.rowName}>{item.name}</Text>

        <Text style={styles.rowMeta}>
          {item.user_type === 'traveler' ? 'Traveller' : 'Sender'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => confirmUnblock(item)}
        disabled={busyId === item._id}
        style={styles.unblockBtn}
      >
        {busyId === item._id ? (
          <ActivityIndicator size="small" color="#55A9FF" />
        ) : (
          <Text style={styles.unblockText}>Unblock</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />

      <View style={styles.headerPadding}>
        <BackBar title="Blocked Users" />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#55A9FF" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={30} color="#FF9B9B" />

          <Text style={styles.errorText}>{error}</Text>

          <TouchableOpacity onPress={() => load(false)}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : blocked.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="shield-outline" size={34} color="#3C4C60" />

          <Text style={styles.emptyTitle}>No blocked users</Text>

          <Text style={styles.emptyBody}>
            When you block someone, you stop seeing each other in search and
            neither of you can send requests.
          </Text>
        </View>
      ) : (
        <FlatList
          data={blocked}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={() => load(true)}
        />
      )}
    </SafeAreaView>
  );
};

export default BlockedUsersScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B121C' },
  headerPadding: { paddingHorizontal: 16 },
  list: { padding: 16, paddingBottom: 40 },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  errorText: { color: '#FF9B9B', fontSize: 14, textAlign: 'center' },
  retryText: { color: '#55A9FF', fontSize: 14, fontWeight: '600' },
  emptyTitle: { color: '#F5F8FC', fontSize: 16, fontWeight: '700' },
  emptyBody: {
    color: '#93A6BD',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#152234',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1 },
  rowName: { color: '#F5F8FC', fontSize: 15, fontWeight: '600' },
  rowMeta: { color: '#93A6BD', fontSize: 12, marginTop: 2 },

  unblockBtn: {
    borderWidth: 1,
    borderColor: '#2C3E55',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 82,
    alignItems: 'center',
  },
  unblockText: { color: '#55A9FF', fontSize: 13, fontWeight: '600' },
});
