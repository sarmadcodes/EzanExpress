import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';

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

import BackBar from '../../../components/BackBar';
import {BASE_API_URI} from '../../../constant/API';

const Activityscreen = ({navigation}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');


  const formatDate = value => {
    if (!value) {
      return '--';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '--';
    }

    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatWeight = grams => {
    const value = Number(grams || 0);

    if (value >= 1000) {
      const kg = value / 1000;

      return `${Number.isInteger(kg) ? kg : kg.toFixed(2)} kg`;
    }

    return `${value} g`;
  };


  const getStatus = request => {
    const requestStatus = String(
      request?.status || 'pending',
    ).toLowerCase();

    const paymentStatus = String(
      request?.payment_status || 'pending',
    ).toLowerCase();

    if (request?.delivered === true) {
      return {
        title: 'Delivered',
        icon: 'checkmark-circle',
        color: '#22C55E',
        background: 'rgba(34,197,94,0.08)',
        border: 'rgba(34,197,94,0.25)',
      };
    }

    if (
      requestStatus === 'approved' &&
      paymentStatus === 'paid'
    ) {
      return {
        title: 'Paid',
        icon: 'card-outline',
        color: '#55A9FF',
        background: 'rgba(39,142,245,0.08)',
        border: 'rgba(85,169,255,0.25)',
      };
    }

    if (requestStatus === 'approved') {
      return {
        title: 'Accepted',
        icon: 'checkmark-circle-outline',
        color: '#22C55E',
        background: 'rgba(34,197,94,0.08)',
        border: 'rgba(34,197,94,0.25)',
      };
    }

    if (requestStatus === 'rejected') {
      return {
        title: 'Rejected',
        icon: 'close-circle-outline',
        color: '#E87982',
        background: 'rgba(232,121,130,0.08)',
        border: 'rgba(232,121,130,0.25)',
      };
    }

    return {
      title: 'Pending',
      icon: 'time-outline',
      color: '#F59E0B',
      background: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.25)',
    };
  };


  const getRequests = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError('');

        const token =
          await AsyncStorage.getItem('usertoken');

        if (!token) {
          setRequests([]);
          setError(
            'Your session has expired. Please login again.',
          );
          return;
        }

        const response = await axios.get(
          `${BASE_API_URI}/request`,
          {
            params: {
              type: 'sent',
              limit: 100,
            },

            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const list =
          response?.data?.requests ||
          response?.data?.data?.requests ||
          [];

        setRequests(
          Array.isArray(list) ? list : [],
        );
      } catch (err) {
        console.log(
          'ACTIVITY REQUEST ERROR:',
          err?.response?.data ||
            err?.message ||
            err,
        );

        setRequests([]);

        setError(
          err?.response?.data?.msg ||
            err?.response?.data?.message ||
            'Unable to load your parcels.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );


  useEffect(() => {
    getRequests();
  }, [getRequests]);

  useEffect(() => {
    const unsubscribe =
      navigation.addListener('focus', () => {
        getRequests(true);
      });

    return unsubscribe;
  }, [navigation, getRequests]);


  const openRequestDetails = request => {
    navigation.navigate('RequestDetails', {
      request,
    });
  };


  const renderRequest = request => {
    const status = getStatus(request);

    return (
      <TouchableOpacity
        key={request?._id}
        activeOpacity={0.85}
        style={styles.card}
        onPress={() =>
          openRequestDetails(request)
        }>
        <View style={styles.cardTop}>
          <View style={styles.iconBox}>
            <Ionicons
              name={
                request?.item_type === 'document'
                  ? 'document-text-outline'
                  : 'cube-outline'
              }
              size={22}
              color="#55A9FF"
            />
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.itemTitle}>
              {request?.item_type === 'document'
                ? 'Document'
                : 'Parcel'}
            </Text>

            <Text style={styles.requestId}>
              Request #
              {String(request?._id || '')
                .slice(-6)
                .toUpperCase()}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  status.background,
                borderColor: status.border,
              },
            ]}>
            <Ionicons
              name={status.icon}
              size={13}
              color={status.color}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color: status.color,
                },
              ]}>
              {status.title}
            </Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.metaItem}>
            <Ionicons
              name="scale-outline"
              size={14}
              color="#718399"
            />

            <Text style={styles.metaText}>
              {formatWeight(
                request?.weight_in_grams,
              )}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color="#718399"
            />

            <Text style={styles.metaText}>
              {formatDate(request?.createdAt)}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#52677F"
          />
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B121C"
      />

      <BackBar title="Activity" />

      <View style={styles.sectionRow}>
        <View>
          <Text style={styles.sectionTitle}>
            My Parcels
          </Text>

          {!loading && requests.length > 0 ? (
            <Text style={styles.sectionSubtitle}>
              {requests.length}{' '}
              {requests.length === 1
                ? 'request'
                : 'requests'}
            </Text>
          ) : null}
        </View>
      </View>

      {loading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator
            size="large"
            color="#55A9FF"
          />

          <Text style={styles.stateText}>
            Loading activity...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color="#E87982"
          />

          <Text style={styles.stateTitle}>
            Unable to load activity
          </Text>

          <Text style={styles.stateText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => getRequests()}>
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.stateContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="cube-outline"
              size={30}
              color="#55A9FF"
            />
          </View>

          <Text style={styles.stateTitle}>
            No Parcels Yet
          </Text>

          <Text style={styles.stateText}>
            Your sent requests will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() =>
                getRequests(true)
              }
              tintColor="#55A9FF"
            />
          }
          contentContainerStyle={
            styles.scrollContent
          }>
          {requests.map(renderRequest)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Activityscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
    paddingHorizontal: 15,
  },

  sectionRow: {
    marginTop: 10,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  sectionSubtitle: {
    color: '#667A91',
    fontSize: 10,
    marginTop: 3,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#101B2A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1D3046',
    padding: 14,
    marginBottom: 12,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor:
      'rgba(39,142,245,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardInfo: {
    flex: 1,
    marginLeft: 11,
  },

  itemTitle: {
    color: '#F1F6FC',
    fontSize: 14,
    fontWeight: '800',
  },

  requestId: {
    color: '#667A91',
    fontSize: 9,
    marginTop: 3,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  statusText: {
    fontSize: 8,
    fontWeight: '800',
    marginLeft: 4,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 13,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: '#1B2C40',
  },

  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaText: {
    color: '#8497AD',
    fontSize: 10,
    marginLeft: 5,
  },

  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: 18,
    backgroundColor:
      'rgba(39,142,245,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  stateTitle: {
    color: '#DCE6F1',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
  },

  stateText: {
    color: '#718399',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 7,
  },

  retryButton: {
    backgroundColor: '#17283C',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 15,
  },

  retryText: {
    color: '#55A9FF',
    fontSize: 11,
    fontWeight: '700',
  },
});
