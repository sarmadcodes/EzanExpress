import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useCallback, useEffect, useState} from 'react';

import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import {BASE_API_URI} from '../constant/API';

const IncomingRequestBlock = () => {
  const navigation = useNavigation();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');

  const formatWeight = grams => {
    const value = Number(grams || 0);

    if (value >= 1000) {
      const kg = value / 1000;

      return `${Number.isInteger(kg) ? kg : kg.toFixed(2)} kg`;
    }

    return `${value} g`;
  };

  const formatAmount = request => {
    const currency = String(
      request?.currency || 'usd',
    ).toUpperCase();

    return `${currency} ${Number(
      request?.total_amount || 0,
    ).toFixed(2)}`;
  };

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

  const getRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const token =
        await AsyncStorage.getItem('usertoken');

      if (!token) {
        setRequests([]);
        setError('Your session has expired.');
        return;
      }

      const response = await axios.get(
        `${BASE_API_URI}/request`,
        {
          params: {
            type: 'received',
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

      const activeRequests = (
        Array.isArray(list) ? list : []
      ).filter(request => {
        const status = String(
          request?.status || '',
        ).toLowerCase();

        const isDelivered =
          request?.delivered === true;

        const isRejected =
          status === 'rejected';

        const isCancelled =
          status === 'cancelled' ||
          request?.cancelled === true;

        return (
          !isDelivered &&
          !isRejected &&
          !isCancelled
        );
      });

      setRequests(activeRequests);
    } catch (err) {
      console.log(
        'INCOMING REQUEST ERROR:',
        err?.response?.data ||
          err?.message ||
          err,
      );

      setRequests([]);

      setError(
        err?.response?.data?.msg ||
          err?.response?.data?.message ||
          'Unable to load requests.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getRequests();

    const unsubscribe =
      navigation.addListener(
        'focus',
        getRequests,
      );

    return unsubscribe;
  }, [navigation, getRequests]);

  const respondToRequest = async (
    request,
    status,
  ) => {
    try {
      setActionLoading(
        `${request._id}-${status}`,
      );

      const token =
        await AsyncStorage.getItem('usertoken');

      if (!token) {
        return;
      }

      await axios.put(
        `${BASE_API_URI}/request`,
        {
          id: request._id,
          status,
          reason: '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await getRequests();
    } catch (err) {
      console.log(
        'REQUEST RESPONSE ERROR:',
        err?.response?.data ||
          err?.message ||
          err,
      );

      Alert.alert(
        'Unable to continue',
        err?.response?.data?.msg ||
          err?.response?.data?.message ||
          'Something went wrong.',
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleAccept = request => {
    const weight = formatWeight(
      request?.weight_in_grams,
    );

    Alert.alert(
      'Accept Request?',
      `This request requires ${weight} of your available parcel space.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () =>
            respondToRequest(
              request,
              'approved',
            ),
        },
      ],
    );
  };

  const handleReject = request => {
    Alert.alert(
      'Reject Request?',
      'Are you sure you want to reject this request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () =>
            respondToRequest(
              request,
              'rejected',
            ),
        },
      ],
    );
  };

  const openRequest = request => {
    navigation.navigate(
      'TravelerRequestDetails',
      {
        request,
      },
    );
  };

  const getRequestStatus = request => {
    const status = String(
      request?.status || 'pending',
    ).toLowerCase();

    const paymentStatus = String(
      request?.payment_status || 'pending',
    ).toLowerCase();

    if (
      status === 'approved' &&
      paymentStatus === 'paid'
    ) {
      return {
        text: 'PAID',
        message:
          'Payment completed • Ready for delivery',
        icon: 'card-outline',
        color: '#4AD69A',
        background:
          'rgba(74,214,154,0.08)',
        border:
          'rgba(74,214,154,0.18)',
      };
    }

    if (status === 'approved') {
      return {
        text: 'ACCEPTED',
        message:
          'Request accepted • Waiting for sender payment',
        icon: 'checkmark-circle-outline',
        color: '#4AD69A',
        background:
          'rgba(74,214,154,0.08)',
        border:
          'rgba(74,214,154,0.18)',
      };
    }

    return {
      text: 'PENDING',
      message: 'Waiting for your response',
      icon: 'time-outline',
      color: '#F3BD58',
      background:
        'rgba(243,189,88,0.08)',
      border:
        'rgba(243,189,88,0.18)',
    };
  };

  const renderRequest = request => {
    const status = String(
      request?.status || 'pending',
    ).toLowerCase();

    const isPending =
      status === 'pending';

    const accepting =
      actionLoading ===
      `${request._id}-approved`;

    const rejecting =
      actionLoading ===
      `${request._id}-rejected`;

    const requestStatus =
      getRequestStatus(request);

    return (
      <TouchableOpacity
        key={request._id}
        activeOpacity={0.86}
        style={styles.card}
        onPress={() =>
          openRequest(request)
        }>

        <View style={styles.cardHeader}>
          <View style={styles.itemIcon}>
            <Ionicons
              name={
                request?.item_type ===
                'document'
                  ? 'document-text-outline'
                  : 'cube-outline'
              }
              size={23}
              color="#55A9FF"
            />
          </View>

          <View style={styles.headerInfo}>
            <View style={styles.titleRow}>
              <Text
                style={styles.itemTitle}>
                {request?.item_type ===
                'document'
                  ? 'Document Request'
                  : 'Parcel Request'}
              </Text>

              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      requestStatus.background,
                    borderColor:
                      requestStatus.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.badgeText,
                    {
                      color:
                        requestStatus.color,
                    },
                  ]}>
                  {requestStatus.text}
                </Text>
              </View>
            </View>

            <Text
              style={
                styles.requestNumber
              }>
              Request #
              {String(
                request?._id || '',
              )
                .slice(-6)
                .toUpperCase()}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#60758C"
          />
        </View>


        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons
              name="scale-outline"
              size={15}
              color="#71869D"
            />

            <View
              style={styles.infoText}>
              <Text
                style={
                  styles.infoLabel
                }>
                SPACE NEEDED
              </Text>

              <Text
                style={
                  styles.infoValue
                }>
                {formatWeight(
                  request?.weight_in_grams,
                )}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons
              name="cash-outline"
              size={15}
              color="#71869D"
            />

            <View
              style={styles.infoText}>
              <Text
                style={
                  styles.infoLabel
                }>
                AMOUNT
              </Text>

              <Text
                style={
                  styles.infoValue
                }>
                {formatAmount(request)}
              </Text>
            </View>
          </View>
        </View>


        <View
          style={styles.requestedRow}>
          <Ionicons
            name="time-outline"
            size={13}
            color="#667B92"
          />

          <Text
            style={
              styles.requestedText
            }>
            Requested{' '}
            {formatDate(
              request?.createdAt,
            )}
          </Text>
        </View>


        {isPending ? (
          <View
            style={styles.buttonRow}>
            <TouchableOpacity
              disabled={
                accepting ||
                rejecting
              }
              onPress={event => {
                event.stopPropagation();
                handleReject(
                  request,
                );
              }}
              style={
                styles.rejectButton
              }>
              {rejecting ? (
                <ActivityIndicator
                  size="small"
                  color="#E87982"
                />
              ) : (
                <>
                  <Ionicons
                    name="close-outline"
                    size={18}
                    color="#E87982"
                  />

                  <Text
                    style={
                      styles.rejectText
                    }>
                    Reject
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              disabled={
                accepting ||
                rejecting
              }
              onPress={event => {
                event.stopPropagation();
                handleAccept(
                  request,
                );
              }}
              style={
                styles.acceptButton
              }>
              {accepting ? (
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-outline"
                    size={18}
                    color="#FFFFFF"
                  />

                  <Text
                    style={
                      styles.acceptText
                    }>
                    Accept
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : (

          <View
            style={[
              styles.statusInfoRow,
              {
                backgroundColor:
                  requestStatus.background,
                borderColor:
                  requestStatus.border,
              },
            ]}>
            <Ionicons
              name={
                requestStatus.icon
              }
              size={16}
              color={
                requestStatus.color
              }
            />

            <Text
              style={[
                styles.statusInfoText,
                {
                  color:
                    requestStatus.color,
                },
              ]}>
              {requestStatus.message}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View>

      <View
        style={styles.screenHeader}>
        <View>
          <Text
            style={styles.screenTitle}>
            Incoming Requests
          </Text>

          {!loading &&
          requests.length > 0 ? (
            <Text
              style={
                styles.screenSubtitle
              }>
              {requests.length}{' '}
              active{' '}
              {requests.length === 1
                ? 'request'
                : 'requests'}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={getRequests}
          style={
            styles.refreshButton
          }>
          <Ionicons
            name="refresh-outline"
            size={17}
            color="#55A9FF"
          />
        </TouchableOpacity>
      </View>


      {loading ? (
        <View style={styles.stateBox}>
          <ActivityIndicator
            color="#55A9FF"
          />

          <Text
            style={styles.stateText}>
            Loading requests...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.stateBox}>
          <Ionicons
            name="alert-circle-outline"
            size={28}
            color="#E87982"
          />

          <Text
            style={styles.stateText}>
            {error}
          </Text>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.stateBox}>
          <View
            style={styles.emptyIcon}>
            <Ionicons
              name="mail-open-outline"
              size={25}
              color="#55A9FF"
            />
          </View>

          <Text
            style={styles.emptyTitle}>
            No Active Requests
          </Text>

          <Text
            style={styles.stateText}>
            New parcel requests will
            appear here.
          </Text>
        </View>
      ) : (
        requests.map(renderRequest)
      )}
    </View>
  );
};

export default IncomingRequestBlock;

const styles = StyleSheet.create({
  screenHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 13,
  },

  screenTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  screenSubtitle: {
    color: '#657A91',
    fontSize: 10,
    marginTop: 3,
  },

  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#1D3046',
    backgroundColor: '#101C2A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#101B2A',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1D3046',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor:
      'rgba(39,142,245,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerInfo: {
    flex: 1,
    marginLeft: 11,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  itemTitle: {
    color: '#F1F6FC',
    fontSize: 13,
    fontWeight: '800',
  },

  badge: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 7,
  },

  badgeText: {
    fontSize: 7,
    fontWeight: '900',
  },

  requestNumber: {
    color: '#64788E',
    fontSize: 9,
    marginTop: 4,
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 15,
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 11,
    backgroundColor: '#0D1724',
    borderWidth: 1,
    borderColor: '#182A3C',
  },

  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoText: {
    marginLeft: 7,
  },

  infoLabel: {
    color: '#536A82',
    fontSize: 7,
    fontWeight: '800',
  },

  infoValue: {
    color: '#DCE6F1',
    fontSize: 11,
    fontWeight: '800',
    marginTop: 2,
  },

  requestedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  requestedText: {
    color: '#657A91',
    fontSize: 9,
    marginLeft: 5,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  rejectButton: {
    flex: 1,
    height: 43,
    borderRadius: 11,
    borderWidth: 1,
    borderColor:
      'rgba(232,121,130,0.30)',
    backgroundColor:
      'rgba(232,121,130,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  rejectText: {
    color: '#E87982',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 5,
  },

  acceptButton: {
    flex: 1,
    height: 43,
    borderRadius: 11,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  acceptText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 5,
  },

  statusInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },

  statusInfoText: {
    flex: 1,
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 7,
  },

  stateBox: {
    minHeight: 155,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },

  emptyIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor:
      'rgba(39,142,245,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    color: '#DCE6F1',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },

  stateText: {
    color: '#718399',
    fontSize: 10,
    marginTop: 6,
    textAlign: 'center',
  },
});
