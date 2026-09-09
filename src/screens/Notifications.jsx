import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import moment from 'moment';

import BackBar from '../components/BackBar';
import api from '../services/api';

const ICONS = {
  flight_approved: {name: 'checkmark-circle', color: '#22C55E'},
  flight_rejected: {name: 'close-circle', color: '#EF4444'},
  request_approved: {name: 'checkmark-circle', color: '#22C55E'},
  request_rejected: {name: 'close-circle', color: '#EF4444'},
  payment_completed: {name: 'card', color: '#1363C8'},
  parcel_paid: {name: 'cash', color: '#1363C8'},
  parcel_delivered: {name: 'cube', color: '#22C55E'},
  withdrawal_approved: {name: 'wallet', color: '#22C55E'},
  withdrawal_rejected: {name: 'wallet', color: '#EF4444'},
};

const getIcon = type => ICONS[type] || {name: 'notifications', color: '#94A3B8'};

const Notifications = ({navigation}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async ({silent} = {}) => {
    if (!silent) {
      setLoading(true);
    }

    setError('');

    try {
      const {data} = await api.get('/notification/get', {
        params: {get: 'all'},
      });

      setItems(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setError(err?.message || 'Unable to load notifications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load({silent: true});
  };

  const markSeen = async notification => {
    if (notification.is_seen) return;

    setItems(current =>
      current.map(item =>
        item._id === notification._id ? {...item, is_seen: true} : item,
      ),
    );

    try {
      await api.patch('/notification/seen', null, {
        params: {id: notification._id},
      });
    } catch (err) {
      setItems(current =>
        current.map(item =>
          item._id === notification._id ? {...item, is_seen: false} : item,
        ),
      );
    }
  };

  const markAllSeen = async () => {
    const previous = items;

    setItems(current => current.map(item => ({...item, is_seen: true})));

    try {
      await api.patch('/notification/seen-all');
    } catch (err) {
      setItems(previous);
    }
  };

  const unseenCount = items.filter(item => !item.is_seen).length;

  const renderItem = ({item}) => {
    const icon = getIcon(item?.custom_data?.type);

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => markSeen(item)}
        style={[styles.card, !item.is_seen && styles.cardUnread]}>
        <View style={[styles.iconWrap, {backgroundColor: `${icon.color}1A`}]}>
          <Ionicons name={icon.name} size={20} color={icon.color} />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>

            {!item.is_seen ? <View style={styles.dot} /> : null}
          </View>

          <Text style={styles.description}>{item.description}</Text>

          <Text style={styles.time}>
            {item.date_time ? moment(item.date_time).fromNow() : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />

      <BackBar title="Notifications" />

      {unseenCount > 0 ? (
        <TouchableOpacity onPress={markAllSeen} style={styles.markAll}>
          <Text style={styles.markAllText}>
            Mark all as read ({unseenCount})
          </Text>
        </TouchableOpacity>
      ) : null}

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1363C8" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline" size={40} color="#ffffff5e" />
          <Text style={styles.emptyText}>{error}</Text>

          <TouchableOpacity onPress={() => load()} style={styles.retry}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => String(item._id)}
          renderItem={renderItem}
          contentContainerStyle={
            items.length ? styles.list : styles.listEmptyContainer
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1363C8"
              colors={['#1363C8']}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons
                name="notifications-off-outline"
                size={40}
                color="#ffffff5e"
              />
              <Text style={styles.emptyText}>No Notifications!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#0B121C', paddingHorizontal: 15},
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {fontSize: 16, color: '#ffffffbe', marginTop: 12},
  list: {paddingVertical: 12, gap: 10},
  listEmptyContainer: {flexGrow: 1},
  markAll: {alignSelf: 'flex-end', paddingVertical: 8},
  markAllText: {color: '#1363C8', fontSize: 13, fontWeight: '600'},
  card: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#121A26',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  cardUnread: {borderColor: '#1363C855', backgroundColor: '#131F2F'},
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {flex: 1},
  cardHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  title: {color: '#fff', fontSize: 15, fontWeight: '700', flex: 1},
  dot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#1363C8'},
  description: {color: '#ffffffb0', fontSize: 13, marginTop: 4, lineHeight: 18},
  time: {color: '#ffffff6e', fontSize: 11, marginTop: 6},
  retry: {
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#1363C8',
  },
  retryText: {color: '#fff', fontWeight: '600', fontSize: 13},
});
