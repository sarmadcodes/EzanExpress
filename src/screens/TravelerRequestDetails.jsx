import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState} from 'react';

import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import BackBar from '../components/BackBar';
import {BASE_API_URI} from '../constant/API';

const TravelerRequestDetails = ({navigation, route}) => {
  const initialRequest = route?.params?.request || {};

  const [request, setRequest] = useState(initialRequest);
  const [actionLoading, setActionLoading] = useState('');

  const status = String(request?.status || 'pending').toLowerCase();

  const formatWeight = grams => {
    const value = Number(grams || 0);

    if (value >= 1000) {
      const kg = value / 1000;

      return `${Number.isInteger(kg) ? kg : kg.toFixed(2)} kg`;
    }

    return `${value} g`;
  };

  const formatMoney = value => {
    const currency = String(request?.currency || 'usd').toUpperCase();

    return `${currency} ${Number(value || 0).toFixed(2)}`;
  };

  const formatDate = value => {
    if (!value) {
      return '--';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '--';
    }

    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const capitalize = value => {
    const text = String(value || '');

    if (!text) {
      return '--';
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const respondToRequest = async responseStatus => {
    try {
      setActionLoading(responseStatus);

      const token = await AsyncStorage.getItem('usertoken');

      if (!token) {
        Alert.alert('Session Expired', 'Please login again.');
        return;
      }

      const response = await axios.put(
        `${BASE_API_URI}/request`,
        {
          id: request._id,
          status: responseStatus,
          reason: '',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updated =
        response?.data?.request ||
        response?.data?.data?.request ||
        response?.data?.data ||
        null;

      if (updated?._id) {
        setRequest(updated);
      } else {
        setRequest(previous => ({
          ...previous,
          status: responseStatus,
          responded_at: new Date().toISOString(),
        }));
      }

      if (responseStatus === 'approved') {
        Alert.alert(
          'Request Accepted',
          'Parcel space has been reserved for this request.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert(
          'Request Rejected',
          'The sender request has been rejected.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    } catch (err) {
      console.log(
        'RESPOND REQUEST ERROR:',
        err?.response?.data || err?.message || err,
      );

      Alert.alert(
        'Unable to continue',
        err?.response?.data?.error ||
          err?.response?.data?.msg ||
          err?.response?.data?.message ||
          'Something went wrong.',
      );
    } finally {
      setActionLoading('');
    }
  };

  const handleAccept = () => {
    Alert.alert(
      'Accept Request?',
      `This request requires ${formatWeight(
        request?.weight_in_grams,
      )} of your available parcel space.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () => respondToRequest('approved'),
        },
      ],
    );
  };

  const handleReject = () => {
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
          onPress: () => respondToRequest('rejected'),
        },
      ],
    );
  };

  const getStatusData = () => {
    if (request?.delivered === true) {
      return {
        text: 'Delivered',
        icon: 'checkmark-circle',
        color: '#4AD69A',
        background: 'rgba(74,214,154,0.08)',
        border: 'rgba(74,214,154,0.20)',
      };
    }

    if (
      status === 'approved' &&
      String(request?.payment_status).toLowerCase() === 'paid'
    ) {
      return {
        text: 'Paid',
        icon: 'card-outline',
        color: '#55A9FF',
        background: 'rgba(39,142,245,0.08)',
        border: 'rgba(85,169,255,0.20)',
      };
    }

    if (status === 'approved') {
      return {
        text: 'Accepted • Awaiting Payment',
        icon: 'checkmark-circle-outline',
        color: '#4AD69A',
        background: 'rgba(74,214,154,0.08)',
        border: 'rgba(74,214,154,0.20)',
      };
    }

    if (status === 'rejected') {
      return {
        text: 'Rejected',
        icon: 'close-circle-outline',
        color: '#E87982',
        background: 'rgba(232,121,130,0.08)',
        border: 'rgba(232,121,130,0.20)',
      };
    }

    return {
      text: 'Pending Response',
      icon: 'time-outline',
      color: '#F3BD58',
      background: 'rgba(243,189,88,0.08)',
      border: 'rgba(243,189,88,0.20)',
    };
  };

  const statusData = getStatusData();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B121C"
      />

      <View style={styles.header}>
        <BackBar title="Request Details" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* STATUS */}

        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: statusData.background,
              borderColor: statusData.border,
            },
          ]}>
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor: statusData.background,
              },
            ]}>
            <Ionicons
              name={statusData.icon}
              size={23}
              color={statusData.color}
            />
          </View>

          <View style={styles.statusContent}>
            <Text
              style={[
                styles.statusTitle,
                {
                  color: statusData.color,
                },
              ]}>
              {statusData.text}
            </Text>

            <Text style={styles.statusSubtitle}>
              Request #
              {String(request?._id || '')
                .slice(-8)
                .toUpperCase()}
            </Text>
          </View>
        </View>

        {/* REQUEST SUMMARY */}

        <Text style={styles.sectionTitle}>Request</Text>

        <View style={styles.mainCard}>
          <View style={styles.requestTop}>
            <View style={styles.bigIcon}>
              <Ionicons
                name={
                  request?.item_type === 'document'
                    ? 'document-text-outline'
                    : 'cube-outline'
                }
                size={27}
                color="#55A9FF"
              />
            </View>

            <View style={styles.requestTopContent}>
              <Text style={styles.requestType}>
                {request?.item_type === 'document'
                  ? 'Document Request'
                  : 'Parcel Request'}
              </Text>

              <Text style={styles.requestDate}>
                Requested {formatDate(request?.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>WEIGHT</Text>

              <Text style={styles.summaryValue}>
                {formatWeight(request?.weight_in_grams)}
              </Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>TOTAL</Text>

              <Text style={styles.summaryPrice}>
                {formatMoney(request?.total_amount)}
              </Text>
            </View>
          </View>
        </View>

        {/* WHAT SENDER IS SENDING */}

        <Text style={styles.sectionTitle}>
          What Sender is Sending
        </Text>

        <View style={styles.card}>
          <DetailRow
            icon={
              request?.item_type === 'document'
                ? 'document-text-outline'
                : 'cube-outline'
            }
            label="Item Type"
            value={capitalize(request?.item_type)}
          />

          <Divider />

          <DetailRow
            icon="scale-outline"
            label="Weight"
            value={formatWeight(request?.weight_in_grams)}
          />

          {request?.item_type === 'parcel' &&
          Array.isArray(request?.parcel_types) &&
          request.parcel_types.length > 0 ? (
            <>
              <Divider />

              <DetailRow
                icon="grid-outline"
                label="Parcel Categories"
                value={request.parcel_types
                  .map(capitalize)
                  .join(', ')}
              />
            </>
          ) : null}

          {request?.other_parcel_type ? (
            <>
              <Divider />

              <DetailRow
                icon="create-outline"
                label="Other Category"
                value={request.other_parcel_type}
              />
            </>
          ) : null}
        </View>

        {/* MESSAGE */}

        {request?.message ? (
          <>
            <Text style={styles.sectionTitle}>Sender Message</Text>

            <View style={styles.messageCard}>
              <View style={styles.messageIcon}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color="#55A9FF"
                />
              </View>

              <Text style={styles.messageText}>
                {request.message}
              </Text>
            </View>
          </>
        ) : null}

        {/* RECEIVER */}

        <Text style={styles.sectionTitle}>Receiver</Text>

        <View style={styles.card}>
          <DetailRow
            icon="person-outline"
            label="Receiver Name"
            value={request?.receiver?.name || '--'}
          />

          <Divider />

          <DetailRow
            icon="call-outline"
            label="Phone Number"
            value={request?.receiver?.phone_number || '--'}
          />
        </View>

        {/* PRICE */}

        <Text style={styles.sectionTitle}>Pricing</Text>

        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Request Price</Text>

            <Text style={styles.priceValue}>
              {formatMoney(request?.amount)}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Platform Fee</Text>

            <Text style={styles.priceValue}>
              {formatMoney(request?.platform_fee)}
            </Text>
          </View>

          <View style={styles.priceDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>

            <Text style={styles.totalValue}>
              {formatMoney(request?.total_amount)}
            </Text>
          </View>
        </View>

        {/* ACCEPTED STATUS */}

        {status === 'approved' ? (
          <View style={styles.acceptedInfo}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#4AD69A"
            />

            <View style={styles.acceptedContent}>
              <Text style={styles.acceptedTitle}>
                Request Accepted
              </Text>

              <Text style={styles.acceptedText}>
                {String(request?.payment_status).toLowerCase() ===
                'paid'
                  ? 'Sender payment has been completed.'
                  : 'Waiting for sender to complete payment.'}
              </Text>
            </View>
          </View>
        ) : null}

        {/* PARCEL CODE AFTER PAYMENT */}

        {String(request?.payment_status).toLowerCase() === 'paid' &&
        request?.parcel_code ? (
          <>
            <Text style={styles.sectionTitle}>Parcel Code</Text>

            <View style={styles.codeCard}>
              <View>
                <Text style={styles.codeLabel}>PARCEL CODE</Text>

                <Text style={styles.codeValue}>
                  {request.parcel_code}
                </Text>
              </View>

              <View style={styles.codeIcon}>
                <Ionicons
                  name="key-outline"
                  size={24}
                  color="#55A9FF"
                />
              </View>
            </View>
          </>
        ) : null}

        {/* REJECTED */}

        {status === 'rejected' ? (
          <View style={styles.rejectedInfo}>
            <Ionicons
              name="close-circle-outline"
              size={20}
              color="#E87982"
            />

            <View style={styles.acceptedContent}>
              <Text style={styles.rejectedTitle}>
                Request Rejected
              </Text>

              <Text style={styles.rejectedText}>
                {request?.rejection_reason ||
                  'You rejected this request.'}
              </Text>
            </View>
          </View>
        ) : null}

        {/* ACTIONS */}

        {status === 'pending' ? (
          <View style={styles.actions}>
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!!actionLoading}
              onPress={handleReject}
              style={styles.rejectButton}>
              {actionLoading === 'rejected' ? (
                <ActivityIndicator size="small" color="#E87982" />
              ) : (
                <>
                  <Ionicons
                    name="close-outline"
                    size={20}
                    color="#E87982"
                  />

                  <Text style={styles.rejectText}>Reject</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!!actionLoading}
              onPress={handleAccept}
              style={styles.acceptButton}>
              {actionLoading === 'approved' ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-outline"
                    size={20}
                    color="#FFFFFF"
                  />

                  <Text style={styles.acceptText}>Accept Request</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({icon, label, value}) => {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={18} color="#55A9FF" />
      </View>

      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>

        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
};

const Divider = () => <View style={styles.divider} />;

export default TravelerRequestDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
  },

  header: {
    paddingHorizontal: 15,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 45,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 9,
  },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    padding: 13,
    marginBottom: 16,
  },

  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusContent: {
    flex: 1,
    marginLeft: 10,
  },

  statusTitle: {
    fontSize: 12,
    fontWeight: '800',
  },

  statusSubtitle: {
    color: '#6E8298',
    fontSize: 8.5,
    marginTop: 4,
  },

  mainCard: {
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },

  requestTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bigIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(39,142,245,0.09)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  requestTopContent: {
    flex: 1,
    marginLeft: 11,
  },

  requestType: {
    color: '#EDF4FB',
    fontSize: 14,
    fontWeight: '800',
  },

  requestDate: {
    color: '#657A91',
    fontSize: 8.5,
    marginTop: 4,
  },

  summaryGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1724',
    borderRadius: 11,
    paddingVertical: 11,
    marginTop: 14,
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryLabel: {
    color: '#536A82',
    fontSize: 7,
    fontWeight: '800',
  },

  summaryValue: {
    color: '#E0EAF4',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },

  summaryPrice: {
    color: '#55A9FF',
    fontSize: 12,
    fontWeight: '900',
    marginTop: 3,
  },

  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#223448',
  },

  card: {
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 15,
    padding: 14,
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(39,142,245,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  detailContent: {
    flex: 1,
    marginLeft: 10,
  },

  detailLabel: {
    color: '#657A91',
    fontSize: 8,
  },

  detailValue: {
    color: '#E2EBF5',
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: 3,
    lineHeight: 15,
  },

  divider: {
    height: 1,
    backgroundColor: '#1C2D40',
    marginVertical: 12,
  },

  messageCard: {
    flexDirection: 'row',
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 15,
    padding: 14,
    marginBottom: 16,
  },

  messageIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: 'rgba(39,142,245,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  messageText: {
    flex: 1,
    color: '#AAB9C9',
    fontSize: 10,
    lineHeight: 16,
    marginLeft: 10,
  },

  priceCard: {
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 15,
    padding: 14,
    marginBottom: 16,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  priceLabel: {
    color: '#718399',
    fontSize: 9.5,
  },

  priceValue: {
    color: '#C9D5E1',
    fontSize: 10,
    fontWeight: '700',
  },

  priceDivider: {
    height: 1,
    backgroundColor: '#223448',
    marginVertical: 3,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 11,
  },

  totalLabel: {
    color: '#F0F5FB',
    fontSize: 12,
    fontWeight: '800',
  },

  totalValue: {
    color: '#55A9FF',
    fontSize: 16,
    fontWeight: '900',
  },

  acceptedInfo: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(74,214,154,0.20)',
    backgroundColor: 'rgba(74,214,154,0.06)',
    borderRadius: 14,
    padding: 13,
    marginTop: 5,
    marginBottom: 16,
  },

  acceptedContent: {
    flex: 1,
    marginLeft: 9,
  },

  acceptedTitle: {
    color: '#4AD69A',
    fontSize: 11,
    fontWeight: '800',
  },

  acceptedText: {
    color: '#789487',
    fontSize: 8.5,
    marginTop: 4,
  },

  codeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0D1927',
    borderWidth: 1,
    borderColor: '#23415F',
    borderRadius: 15,
    padding: 15,
    marginBottom: 16,
  },

  codeLabel: {
    color: '#60758E',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
  },

  codeValue: {
    color: '#55A9FF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 5,
  },

  codeIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(39,142,245,0.09)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rejectedInfo: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(232,121,130,0.20)',
    backgroundColor: 'rgba(232,121,130,0.06)',
    borderRadius: 14,
    padding: 13,
    marginTop: 5,
    marginBottom: 16,
  },

  rejectedTitle: {
    color: '#E87982',
    fontSize: 11,
    fontWeight: '800',
  },

  rejectedText: {
    color: '#99767C',
    fontSize: 8.5,
    marginTop: 4,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },

  rejectButton: {
    flex: 0.8,
    height: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(232,121,130,0.30)',
    backgroundColor: 'rgba(232,121,130,0.05)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rejectText: {
    color: '#E87982',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 5,
  },

  acceptButton: {
    flex: 1.4,
    height: 50,
    borderRadius: 13,
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  acceptText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 6,
  },
});