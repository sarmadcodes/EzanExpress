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

import BackBar from '../components/BackBar';
import Button from '../components/Button/Button';
import {BASE_API_URI} from '../constant/API';

const RequestDetails = ({navigation, route}) => {
  const initialRequest = route?.params?.request || {};

  const [request, setRequest] = useState(initialRequest);
  const [traveler, setTraveler] = useState(null);

  const [loading, setLoading] = useState(false);
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

  const formatDateTime = value => {
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

  const formatWeight = grams => {
    const value = Number(grams || 0);

    if (value >= 1000) {
      const kg = value / 1000;

      return `${
        Number.isInteger(kg)
          ? kg
          : kg.toFixed(2)
      } kg`;
    }

    return `${value} g`;
  };

  const getCurrency = () => {
    return String(
      request?.currency || 'usd',
    ).toUpperCase();
  };

  const formatMoney = value => {
    return `${getCurrency()} ${Number(
      value || 0,
    ).toFixed(2)}`;
  };

  const getStatus = () => {
    const status = String(
      request?.status || 'pending',
    ).toLowerCase();

    const paymentStatus = String(
      request?.payment_status || 'pending',
    ).toLowerCase();

    if (request?.delivered === true) {
      return {
        key: 'delivered',
        title: 'Delivered',
        subtitle:
          'Parcel delivered successfully.',
        icon: 'checkmark-circle',
        color: '#22C55E',
        background:
          'rgba(34,197,94,0.08)',
        border:
          'rgba(34,197,94,0.25)',
      };
    }

    if (
      status === 'approved' &&
      paymentStatus === 'paid'
    ) {
      return {
        key: 'paid',
        title: 'Payment Completed',
        subtitle:
          'Parcel Code has been generated.',
        icon: 'card-outline',
        color: '#55A9FF',
        background:
          'rgba(39,142,245,0.08)',
        border:
          'rgba(85,169,255,0.25)',
      };
    }

    if (status === 'approved') {
      return {
        key: 'approved',
        title: 'Request Accepted',
        subtitle:
          'Traveler accepted your request. Complete payment to continue.',
        icon: 'checkmark-circle-outline',
        color: '#22C55E',
        background:
          'rgba(34,197,94,0.08)',
        border:
          'rgba(34,197,94,0.25)',
      };
    }

    if (status === 'rejected') {
      return {
        key: 'rejected',
        title: 'Request Rejected',
        subtitle:
          request?.rejection_reason ||
          'Traveler declined your request.',
        icon: 'close-circle-outline',
        color: '#E87982',
        background:
          'rgba(232,121,130,0.08)',
        border:
          'rgba(232,121,130,0.25)',
      };
    }

    return {
      key: 'pending',
      title: 'Request Pending',
      subtitle:
        'Waiting for traveler response.',
      icon: 'time-outline',
      color: '#F59E0B',
      background:
        'rgba(245,158,11,0.08)',
      border:
        'rgba(245,158,11,0.25)',
    };
  };


  const loadRequest = useCallback(
    async (isRefresh = false) => {
      try {
        if (!request?._id) {
          return;
        }

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError('');

        const token =
          await AsyncStorage.getItem(
            'usertoken',
          );

        if (!token) {
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
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

        const requests =
          response?.data?.requests ||
          response?.data?.data?.requests ||
          [];

        const current =
          Array.isArray(requests)
            ? requests.find(
                item =>
                  String(item?._id) ===
                  String(request?._id),
              )
            : null;

        if (current) {
          setRequest(current);
        }
      } catch (err) {
        console.log(
          'REQUEST DETAILS ERROR:',
          err?.response?.data ||
            err?.message ||
            err,
        );

        setError(
          err?.response?.data?.msg ||
            err?.response?.data?.message ||
            'Unable to refresh request details.',
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [request?._id],
  );


  const loadTraveler = useCallback(
    async () => {
      try {
        const travelerId =
          request?.passenger_id;

        if (!travelerId) {
          return;
        }

        const token =
          await AsyncStorage.getItem(
            'usertoken',
          );

        if (!token) {
          return;
        }

        const response = await axios.get(
          `${BASE_API_URI}/passengers/${travelerId}/public-profile`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

        const profile =
          response?.data?.passenger ||
          response?.data?.data?.passenger ||
          null;

        setTraveler(profile);
      } catch (err) {
        console.log(
          'REQUEST TRAVELER ERROR:',
          err?.response?.data ||
            err?.message ||
            err,
        );
      }
    },
    [request?.passenger_id],
  );

  useEffect(() => {
    loadTraveler();
  }, [loadTraveler]);

  useEffect(() => {
    const unsubscribe =
      navigation.addListener(
        'focus',
        () => {
          loadRequest(true);
        },
      );

    return unsubscribe;
  }, [navigation, loadRequest]);


  const getTimeline = () => {
    const status = String(
      request?.status || 'pending',
    ).toLowerCase();

    const paymentStatus = String(
      request?.payment_status || 'pending',
    ).toLowerCase();

    const approved =
      status === 'approved';

    const rejected =
      status === 'rejected';

    const paid =
      paymentStatus === 'paid';

    const codeGenerated =
      !!request?.parcel_code;

    const delivered =
      request?.delivered === true;

    const rated =
      request?.rated === true;

    if (rejected) {
      return [
        {
          title: 'Request Sent',
          completed: true,
          date:
            request?.createdAt,
        },
        {
          title: 'Request Rejected',
          completed: true,
          rejected: true,
          date:
            request?.responded_at,
        },
      ];
    }

    return [
      {
        title: 'Request Sent',
        completed: true,
        date:
          request?.createdAt,
      },

      {
        title: 'Traveler Accepted',
        completed: approved,
        date:
          approved
            ? request?.responded_at
            : null,
      },

      {
        title: 'Payment Completed',
        completed: paid,
        date:
          request?.paid_at,
      },

      {
        title: 'Parcel Code Generated',
        completed:
          paid && codeGenerated,
        date:
          request?.paid_at,
      },

      {
        title: 'Delivered',
        completed: delivered,
        date:
          request?.delivered_at,
      },

      {
        title: 'Feedback Submitted',
        completed: rated,
        date:
          request?.rated_at,
      },
    ];
  };


 const handlePayment = () => {
  navigation.navigate('PaymentScreen', {
    request,
  });
};


  const canRate = () => {
    if (
      request?.delivered !== true ||
      request?.rated === true ||
      !request?.delivered_at
    ) {
      return false;
    }

    const deliveredAt =
      new Date(
        request.delivered_at,
      ).getTime();

    if (
      Number.isNaN(deliveredAt)
    ) {
      return false;
    }

    return (
      Date.now() - deliveredAt >=
      24 * 60 * 60 * 1000
    );
  };

  const handleRateTraveler = () => {
  };


  const state = getStatus();

  const timeline = getTimeline();

  const status = String(
    request?.status || '',
  ).toLowerCase();

  const paymentStatus = String(
    request?.payment_status || '',
  ).toLowerCase();

  const paymentRequired =
    status === 'approved' &&
    paymentStatus !== 'paid';


  if (
    loading &&
    !request?._id
  ) {
    return (
      <SafeAreaView
        style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0B121C"
        />

        <View style={styles.header}>
          <BackBar title="Parcel Details" />
        </View>

        <View
          style={styles.stateContainer}>
          <ActivityIndicator
            size="large"
            color="#55A9FF"
          />

          <Text
            style={styles.stateText}>
            Loading request...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView
      style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B121C"
      />

      <View style={styles.header}>
        <BackBar title="Parcel Details" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              loadRequest(true)
            }
            tintColor="#55A9FF"
          />
        }
        contentContainerStyle={
          styles.scrollContent
        }>

        <View
          style={[
            styles.statusCard,
            {
              backgroundColor:
                state.background,
              borderColor:
                state.border,
            },
          ]}>
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor:
                  state.background,
              },
            ]}>
            <Ionicons
              name={state.icon}
              size={25}
              color={state.color}
            />
          </View>

          <View
            style={
              styles.statusContent
            }>
            <Text
              style={[
                styles.statusTitle,
                {
                  color:
                    state.color,
                },
              ]}>
              {state.title}
            </Text>

            <Text
              style={styles.statusSubtitle}>
              {state.subtitle}
            </Text>
          </View>
        </View>

        {error ? (
          <View
            style={styles.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={17}
              color="#E87982"
            />

            <Text
              style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : null}


        <View style={styles.requestHeader}>
          <View>
            <Text
              style={
                styles.requestEyebrow
              }>
              REQUEST
            </Text>

            <Text
              style={styles.requestNumber}>
              #
              {String(
                request?._id || '',
              )
                .slice(-8)
                .toUpperCase()}
            </Text>
          </View>

          <Text
            style={styles.requestDate}>
            {formatDate(
              request?.createdAt,
            )}
          </Text>
        </View>


        <Text
          style={styles.sectionTitle}>
          Traveler
        </Text>

        <View
          style={styles.travelerCard}>
          <View
            style={styles.avatar}>
            <Ionicons
              name="person-outline"
              size={24}
              color="#55A9FF"
            />
          </View>

          <View
            style={
              styles.travelerContent
            }>
            <View
              style={styles.nameRow}>
              <Text
                style={
                  styles.travelerName
                }>
                {traveler?.name ||
                  'Traveler'}
              </Text>

              {traveler?.verified ===
              true ? (
                <Ionicons
                  name="checkmark-circle"
                  size={17}
                  color="#3B9EFF"
                  style={{
                    marginLeft: 4,
                  }}
                />
              ) : null}
            </View>

            <View
              style={
                styles.ratingRow
              }>
              <Ionicons
                name="star"
                size={12}
                color="#EAB308"
              />

              <Text
                style={
                  styles.ratingText
                }>
                {Number(
                  traveler?.rating || 0,
                ).toFixed(1)}
              </Text>

              <Text
                style={
                  styles.reviewText
                }>
                (
                {traveler?.rating_count ||
                  0}{' '}
                reviews)
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={
              styles.viewProfileButton
            }
            onPress={() =>
              navigation.navigate(
                'CarrierProfile',
                {
                  userId:
                    request?.passenger_id,
                },
              )
            }>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#55A9FF"
            />
          </TouchableOpacity>
        </View>


        <Text
          style={styles.sectionTitle}>
          Parcel Details
        </Text>

        <View
          style={styles.sectionCard}>
          <View style={styles.detailRow}>
            <View
              style={styles.detailIcon}>
              <Ionicons
                name={
                  request?.item_type ===
                  'document'
                    ? 'document-text-outline'
                    : 'cube-outline'
                }
                size={19}
                color="#55A9FF"
              />
            </View>

            <View
              style={
                styles.detailContent
              }>
              <Text
                style={styles.detailLabel}>
                Item Type
              </Text>

              <Text
                style={styles.detailValue}>
                {request?.item_type ===
                'document'
                  ? 'Document'
                  : 'Parcel'}
              </Text>
            </View>
          </View>

          <View
            style={styles.divider}
          />

          <View style={styles.detailRow}>
            <View
              style={styles.detailIcon}>
              <Ionicons
                name="scale-outline"
                size={19}
                color="#55A9FF"
              />
            </View>

            <View
              style={
                styles.detailContent
              }>
              <Text
                style={styles.detailLabel}>
                Weight
              </Text>

              <Text
                style={styles.detailValue}>
                {formatWeight(
                  request
                    ?.weight_in_grams,
                )}
              </Text>
            </View>
          </View>

          {request?.item_type ===
            'parcel' &&
          Array.isArray(
            request?.parcel_types,
          ) &&
          request.parcel_types
            .length > 0 ? (
            <>
              <View
                style={styles.divider}
              />

              <View
                style={styles.detailRow}>
                <View
                  style={
                    styles.detailIcon
                  }>
                  <Ionicons
                    name="grid-outline"
                    size={19}
                    color="#55A9FF"
                  />
                </View>

                <View
                  style={
                    styles.detailContent
                  }>
                  <Text
                    style={
                      styles.detailLabel
                    }>
                    Categories
                  </Text>

                  <Text
                    style={
                      styles.detailValue
                    }>
                    {request.parcel_types
                      .map(
                        item =>
                          item
                            .charAt(0)
                            .toUpperCase() +
                          item.slice(1),
                      )
                      .join(', ')}
                  </Text>
                </View>
              </View>
            </>
          ) : null}
        </View>


        <Text
          style={styles.sectionTitle}>
          Receiver
        </Text>

        <View
          style={styles.sectionCard}>
          <View style={styles.detailRow}>
            <View
              style={styles.detailIcon}>
              <Ionicons
                name="person-outline"
                size={19}
                color="#55A9FF"
              />
            </View>

            <View
              style={
                styles.detailContent
              }>
              <Text
                style={styles.detailLabel}>
                Full Name
              </Text>

              <Text
                style={styles.detailValue}>
                {request?.receiver?.name ||
                  '--'}
              </Text>
            </View>
          </View>

          <View
            style={styles.divider}
          />

          <View style={styles.detailRow}>
            <View
              style={styles.detailIcon}>
              <Ionicons
                name="call-outline"
                size={19}
                color="#55A9FF"
              />
            </View>

            <View
              style={
                styles.detailContent
              }>
              <Text
                style={styles.detailLabel}>
                Phone Number
              </Text>

              <Text
                style={styles.detailValue}>
                {request?.receiver
                  ?.phone_number || '--'}
              </Text>
            </View>
          </View>
        </View>


        <Text
          style={styles.sectionTitle}>
          Pricing
        </Text>

        <View
          style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text
              style={styles.priceLabel}>
              Parcel Price
            </Text>

            <Text
              style={styles.priceValue}>
              {formatMoney(
                request?.amount,
              )}
            </Text>
          </View>

          {Number(
            request?.platform_fee ||
              0,
          ) > 0 ? (
            <View
              style={styles.priceRow}>
              <Text
                style={
                  styles.priceLabel
                }>
                Platform Fee
              </Text>

              <Text
                style={
                  styles.priceValue
                }>
                {formatMoney(
                  request?.platform_fee,
                )}
              </Text>
            </View>
          ) : null}

          <View
            style={styles.priceDivider}
          />

          <View
            style={styles.totalRow}>
            <Text
              style={styles.totalLabel}>
              Total
            </Text>

            <Text
              style={styles.totalValue}>
              {formatMoney(
                request?.total_amount,
              )}
            </Text>
          </View>
        </View>


        {request?.message ? (
          <>
            <Text
              style={styles.sectionTitle}>
              Message
            </Text>

            <View
              style={
                styles.messageCard
              }>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color="#55A9FF"
              />

              <Text
                style={styles.messageText}>
                {request.message}
              </Text>
            </View>
          </>
        ) : null}


        {status === 'rejected' ? (
          <>
            <Text
              style={styles.sectionTitle}>
              Rejection
            </Text>

            <View
              style={
                styles.rejectionCard
              }>
              <Ionicons
                name="close-circle-outline"
                size={21}
                color="#E87982"
              />

              <View
                style={
                  styles.rejectionContent
                }>
                <Text
                  style={
                    styles.rejectionTitle
                  }>
                  Request Rejected
                </Text>

                <Text
                  style={
                    styles.rejectionText
                  }>
                  {request?.rejection_reason ||
                    'Traveler declined this request.'}
                </Text>
              </View>
            </View>
          </>
        ) : null}


        {paymentStatus === 'paid' &&
        request?.parcel_code ? (
          <>
            <Text
              style={styles.sectionTitle}>
              Parcel Code
            </Text>

            <View
              style={
                styles.parcelCodeCard
              }>
              <View>
                <Text
                  style={
                    styles.parcelCodeLabel
                  }>
                  YOUR PARCEL CODE
                </Text>

                <Text
                  style={
                    styles.parcelCode
                  }>
                  {request.parcel_code}
                </Text>
              </View>

              <View
                style={
                  styles.parcelCodeIcon
                }>
                <Ionicons
                  name="key-outline"
                  size={25}
                  color="#55A9FF"
                />
              </View>
            </View>

            <View
              style={styles.codeNote}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#718399"
              />

              <Text
                style={
                  styles.codeNoteText
                }>
                Keep this code safe. It will be used by the traveler during delivery.
              </Text>
            </View>
          </>
        ) : null}


        <Text
          style={styles.sectionTitle}>
          Timeline
        </Text>

        <View
          style={styles.timelineCard}>
          {timeline.map(
            (item, index) => {
              const isLast =
                index ===
                timeline.length - 1;

              return (
                <View
                  key={item.title}
                  style={
                    styles.timelineRow
                  }>
                  <View
                    style={
                      styles.timelineRail
                    }>
                    <View
                      style={[
                        styles.timelineDot,

                        item.completed
                          ? item.rejected
                            ? styles.timelineDotRejected
                            : styles.timelineDotCompleted
                          : styles.timelineDotPending,
                      ]}>
                      {item.completed ? (
                        <Ionicons
                          name={
                            item.rejected
                              ? 'close'
                              : 'checkmark'
                          }
                          size={10}
                          color="#FFFFFF"
                        />
                      ) : null}
                    </View>

                    {!isLast ? (
                      <View
                        style={[
                          styles.timelineLine,

                          item.completed &&
                          timeline[
                            index + 1
                          ]?.completed
                            ? item.rejected
                              ? styles.timelineLineRejected
                              : styles.timelineLineCompleted
                            : styles.timelineLinePending,
                        ]}
                      />
                    ) : null}
                  </View>

                  <View
                    style={
                      styles.timelineContent
                    }>
                    <Text
                      style={[
                        styles.timelineTitle,

                        item.completed
                          ? item.rejected
                            ? styles.timelineTitleRejected
                            : styles.timelineTitleCompleted
                          : styles.timelineTitlePending,
                      ]}>
                      {item.title}
                    </Text>

                    {item.completed &&
                    item.date ? (
                      <Text
                        style={
                          styles.timelineDate
                        }>
                        {formatDateTime(
                          item.date,
                        )}
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            },
          )}
        </View>


        {paymentRequired ? (
          <View
            style={
              styles.actionSection
            }>
            <Button
              text="Complete Payment"
              icon="card-outline"
              onPress={handlePayment}
            />
          </View>
        ) : null}


        {canRate() ? (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.rateButton}
            onPress={
              handleRateTraveler
            }>
            <Ionicons
              name="star-outline"
              size={18}
              color="#EAB308"
            />

            <Text
              style={
                styles.rateButtonText
              }>
              Rate Traveler
            </Text>
          </TouchableOpacity>
        ) : null}

        {request?.rated === true ? (
          <View
            style={styles.ratedBox}>
            <Ionicons
              name="star"
              size={16}
              color="#EAB308"
            />

            <Text
              style={styles.ratedText}>
              Feedback submitted
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestDetails;

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
    paddingTop: 12,
    paddingBottom: 48,
  },

  statusCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 2,
  },

  statusIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusContent: {
    flex: 1,
    marginLeft: 11,
  },

  statusTitle: {
    fontSize: 16,
    fontWeight: '800',
  },

  statusSubtitle: {
    color: '#8193A7',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 3,
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(232,121,130,0.06)',
    borderWidth: 1,
    borderColor:
      'rgba(232,121,130,0.20)',
    borderRadius: 11,
    padding: 10,
    marginBottom: 13,
  },

  errorText: {
    flex: 1,
    color: '#B9858C',
    fontSize: 9,
    marginLeft: 7,
  },

  requestHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 21,
  },

  requestEyebrow: {
    color: '#52677F',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  requestNumber: {
    color: '#EAF2FB',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 3,
  },

  requestDate: {
    color: '#718399',
    fontSize: 11,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 6,
  },

  travelerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 15,
    padding: 15,
    marginBottom: 18,
    elevation: 2,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor:
      'rgba(39,142,245,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  travelerContent: {
    flex: 1,
    marginLeft: 11,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  travelerName: {
    color: '#EEF4FB',
    fontSize: 16,
    fontWeight: '800',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  ratingText: {
    color: '#EAB308',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },

  reviewText: {
    color: '#6F8298',
    fontSize: 10,
    marginLeft: 4,
  },

  viewProfileButton: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor:
      'rgba(39,142,245,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionCard: {
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 15,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor:
      'rgba(39,142,245,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  detailContent: {
    flex: 1,
    marginLeft: 10,
  },

  detailLabel: {
    color: '#657A91',
    fontSize: 10,
  },

  detailValue: {
    color: '#E3ECF6',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: '#1B2C40',
    marginVertical: 12,
  },

  priceCard: {
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 15,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    marginBottom: 11,
  },

  priceLabel: {
    color: '#718399',
    fontSize: 12,
  },

  priceValue: {
    color: '#C7D3E0',
    fontSize: 12,
    fontWeight: '700',
  },

  priceDivider: {
    height: 1,
    backgroundColor: '#213347',
    marginVertical: 3,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginTop: 11,
  },

  totalLabel: {
    color: '#EEF4FB',
    fontSize: 12,
    fontWeight: '800',
  },

  totalValue: {
    color: '#55A9FF',
    fontSize: 16,
    fontWeight: '900',
  },

  messageCard: {
    flexDirection: 'row',
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 15,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
  },

  messageText: {
    flex: 1,
    color: '#A8B6C7',
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 9,
  },

  rejectionCard: {
    flexDirection: 'row',
    backgroundColor:
      'rgba(232,121,130,0.06)',
    borderWidth: 1,
    borderColor:
      'rgba(232,121,130,0.20)',
    borderRadius: 14,
    padding: 13,
    marginBottom: 18,
  },

  rejectionContent: {
    flex: 1,
    marginLeft: 9,
  },

  rejectionTitle: {
    color: '#E87982',
    fontSize: 11,
    fontWeight: '800',
  },

  rejectionText: {
    color: '#9A727A',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },

  parcelCodeCard: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    backgroundColor: '#0C1725',
    borderWidth: 1,
    borderColor: '#23405F',
    borderRadius: 15,
    padding: 15,
  },

  parcelCodeLabel: {
    color: '#60758E',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  parcelCode: {
    color: '#55A9FF',
    fontSize: 21,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 5,
  },

  parcelCodeIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor:
      'rgba(39,142,245,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  codeNote: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 18,
    paddingHorizontal: 4,
  },

  codeNoteText: {
    flex: 1,
    color: '#66798F',
    fontSize: 8,
    lineHeight: 13,
    marginLeft: 5,
  },

  timelineCard: {
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 15,
    padding: 15,
    marginBottom: 18,
  },

  timelineRow: {
    flexDirection: 'row',
    minHeight: 50,
  },

  timelineRail: {
    width: 23,
    alignItems: 'center',
  },

  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },

  timelineDotCompleted: {
    backgroundColor: '#1E90FF',
  },

  timelineDotRejected: {
    backgroundColor: '#E87982',
  },

  timelineDotPending: {
    backgroundColor: '#172639',
    borderWidth: 1,
    borderColor: '#31465D',
  },

  timelineLine: {
    width: 2,
    flex: 1,
  },

  timelineLineCompleted: {
    backgroundColor: '#1E90FF',
  },

  timelineLineRejected: {
    backgroundColor: '#E87982',
  },

  timelineLinePending: {
    backgroundColor: '#25374A',
  },

  timelineContent: {
    flex: 1,
    marginLeft: 9,
    paddingTop: 1,
  },

  timelineTitle: {
    fontSize: 10,
    fontWeight: '700',
  },

  timelineTitleCompleted: {
    color: '#DDE7F2',
  },

  timelineTitleRejected: {
    color: '#E87982',
  },

  timelineTitlePending: {
    color: '#576C83',
  },

  timelineDate: {
    color: '#63778E',
    fontSize: 8,
    marginTop: 4,
  },

  actionSection: {
    marginTop: 2,
    marginBottom: 18,
  },

  rateButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor:
      'rgba(234,179,8,0.30)',
    backgroundColor:
      'rgba(234,179,8,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  rateButtonText: {
    color: '#EAB308',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 7,
  },

  ratedBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  ratedText: {
    color: '#9A8A4A',
    fontSize: 9,
    marginLeft: 5,
  },

  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stateText: {
    color: '#718399',
    fontSize: 11,
    marginTop: 9,
  },
});
