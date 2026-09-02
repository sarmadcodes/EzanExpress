import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {BASE_API_URI} from '../../../constant/API';

/* =========================================================
   HELPERS
========================================================= */

const formatDate = value => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatEventDateTime = value => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const getEventTitle = item => {
  const event = String(item?.event || '').toLowerCase();

  switch (event) {
    case 'flight_created':
      return 'Flight Registered';

    case 'ticket_uploaded':
      return 'Ticket Submitted';

    case 'resubmitted':
      return 'Ticket Resubmitted';

    case 'approved':
      return 'Flight Approved';

    case 'rejected':
      return 'Verification Rejected';

    case 'cancelled':
      return 'Trip Cancelled';

    case 'completed':
      return 'Trip Completed';

    case 'expired':
      return 'Trip Expired';

    default:
      return item?.title || 'Flight Updated';
  }
};

const getTimelineColor = item => {
  const event = String(item?.event || '').toLowerCase();

  if (
    event === 'rejected' ||
    event === 'cancelled'
  ) {
    return '#FF747D';
  }

  if (
    event === 'approved' ||
    event === 'completed'
  ) {
    return '#4AD69A';
  }

  if (event === 'expired') {
    return '#91A3B6';
  }

  return '#55A9FF';
};

const getTimelineActor = item => {
  const role = String(item?.actor_role || '').toLowerCase();

  if (
    role === 'admin' ||
    role === 'administrator'
  ) {
    return 'Ezan Express';
  }

  return 'You';
};

const getStatus = flight => {
  if (flight?.trip_status === 'completed') {
    return {
      label: 'Completed',
      color: '#4AD69A',
      background: 'rgba(74, 214, 154, 0.09)',
      border: 'rgba(74, 214, 154, 0.18)',
      icon: 'checkmark-circle',
    };
  }

  if (flight?.trip_status === 'cancelled') {
    return {
      label: 'Cancelled',
      color: '#A0AEC0',
      background: 'rgba(160, 174, 192, 0.08)',
      border: 'rgba(160, 174, 192, 0.16)',
      icon: 'close-circle',
    };
  }

  if (flight?.trip_status === 'expired') {
    return {
      label: 'Expired',
      color: '#94A5B8',
      background: 'rgba(148, 165, 184, 0.08)',
      border: 'rgba(148, 165, 184, 0.16)',
      icon: 'time',
    };
  }

  if (flight?.verification_status === 'rejected') {
    return {
      label: 'Rejected',
      color: '#FF747D',
      background: 'rgba(255, 116, 125, 0.08)',
      border: 'rgba(255, 116, 125, 0.18)',
      icon: 'alert-circle',
    };
  }

  if (
    flight?.verification_status === 'approved' &&
    flight?.trip_status === 'active'
  ) {
    return {
      label: 'Active',
      color: '#4AD69A',
      background: 'rgba(74, 214, 154, 0.09)',
      border: 'rgba(74, 214, 154, 0.18)',
      icon: 'checkmark-circle',
    };
  }

  if (flight?.verification_status === 'approved') {
    return {
      label: 'Approved',
      color: '#4AD69A',
      background: 'rgba(74, 214, 154, 0.09)',
      border: 'rgba(74, 214, 154, 0.18)',
      icon: 'checkmark-circle',
    };
  }

  return {
    label: 'Pending',
    color: '#F3BD58',
    background: 'rgba(243, 189, 88, 0.08)',
    border: 'rgba(243, 189, 88, 0.18)',
    icon: 'time-outline',
  };
};

const getRoute = flight => {
  return {
    fromCode:
      flight?.departure_airport_code ||
      flight?.departure_airport_city ||
      flight?.departure ||
      '—',

    fromCity:
      flight?.departure_airport_city ||
      flight?.departure ||
      'Departure',

    toCode:
      flight?.destination_airport_code ||
      flight?.destination_airport_city ||
      flight?.destination ||
      '—',

    toCity:
      flight?.destination_airport_city ||
      flight?.destination ||
      'Destination',
  };
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const InfoItem = ({ icon, label, value }) => {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={15}
          color="#55A9FF"
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text
          numberOfLines={2}
          style={styles.infoValue}
        >
          {value || '—'}
        </Text>
      </View>
    </View>
  );
};

/* =========================================================
   SCREEN
========================================================= */

const TravelerFlightDetailsScreen = ({
  navigation,
  route,
}) => {
  const flight = route?.params?.flight || null;

  const [flightRequests, setFlightRequests] = useState([]);
const [parcelLoading, setParcelLoading] = useState(false);

const loadFlightParcels = useCallback(async () => {
  if (!flight?._id) {
    setFlightRequests([]);
    return;
  }

  try {
    setParcelLoading(true);

    const token = await AsyncStorage.getItem('usertoken');

    if (!token) {
      return;
    }

    const response = await axios.get(
      `${BASE_API_URI}/request`,
      {
        params: {
          type: 'received',
          status: 'approved',
          flight_id: flight._id,
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

    setFlightRequests(
      Array.isArray(list) ? list : [],
    );
  } catch (err) {
    console.log(
      'FLIGHT PARCELS ERROR:',
      err?.response?.data ||
        err?.message ||
        err,
    );

    setFlightRequests([]);
  } finally {
    setParcelLoading(false);
  }
}, [flight?._id]);

useEffect(() => {
  loadFlightParcels();

  const unsubscribe =
    navigation.addListener('focus', loadFlightParcels);

  return unsubscribe;
}, [navigation, loadFlightParcels]);

const formatParcelWeight = grams => {
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

const getParcelState = request => {
  if (request?.delivered === true) {
    return {
      text: 'DELIVERED',
      color: '#4AD69A',
      background: 'rgba(74,214,154,0.08)',
    };
  }

  if (
    String(request?.payment_status).toLowerCase() ===
    'paid'
  ) {
    return {
      text: 'PAID',
      color: '#55A9FF',
      background: 'rgba(39,142,245,0.08)',
    };
  }

  return {
    text: 'AWAITING PAYMENT',
    color: '#F3BD58',
    background: 'rgba(243,189,88,0.08)',
  };
};

  /* =======================================================
     HISTORY
  ======================================================= */

  const history = useMemo(() => {
    if (!Array.isArray(flight?.history)) {
      return [];
    }

    return [...flight.history].sort((a, b) => {
      const aDate = new Date(
        a?.event_at || a?.createdAt || 0,
      ).getTime();

      const bDate = new Date(
        b?.event_at || b?.createdAt || 0,
      ).getTime();

      return aDate - bDate;
    });
  }, [flight]);

  /* =======================================================
     MISSING FLIGHT
  ======================================================= */

  if (!flight) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'left', 'right']}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0B121C"
        />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={21}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Flight Details
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.missingContainer}>
          <View style={styles.missingIcon}>
            <Ionicons
              name="airplane-outline"
              size={30}
              color="#55A9FF"
            />
          </View>

          <Text style={styles.missingTitle}>
            Flight not available
          </Text>

          <Text style={styles.missingText}>
            We couldn't find the selected flight.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const status = getStatus(flight);
  const routeInfo = getRoute(flight);

  const isRejected =
    flight?.verification_status === 'rejected';

  const isPending =
    flight?.verification_status === 'pending';

  const isApproved =
    flight?.verification_status === 'approved';

  const isCancelled =
    flight?.trip_status === 'cancelled';

  const hasTravelCode =
    isApproved && Boolean(flight?.travel_code);

  /* =======================================================
     RESUBMIT

     Actual resubmit form/API will be handled separately.
     For now this keeps the current navigation contract.
  ======================================================= */

  const handleResubmit = () => {
    navigation.navigate('FlightDetails', {
      from: 'my-trips',
      mode: 'resubmit-ticket',
      flight,
    });
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right']}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B121C"
      />

      {/* ===================================================
          HEADER
      =================================================== */}

      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="chevron-back"
            size={21}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Flight Details
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =================================================
            STATUS
        ================================================= */}

        <View
          style={[
            styles.statusBanner,
            {
              backgroundColor:
                status.background,
              borderColor: status.border,
            },
          ]}
        >
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor:
                  status.background,
              },
            ]}
          >
            <Ionicons
              name={status.icon}
              size={19}
              color={status.color}
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusLabel}>
              Current Status
            </Text>

            <Text
              style={[
                styles.statusValue,
                {
                  color: status.color,
                },
              ]}
            >
              {status.label}
            </Text>
          </View>

          <View
            style={[
              styles.statusPill,
              {
                borderColor: status.border,
              },
            ]}
          >
            <View
              style={[
                styles.statusSmallDot,
                {
                  backgroundColor:
                    status.color,
                },
              ]}
            />

            <Text
              style={[
                styles.statusPillText,
                {
                  color: status.color,
                },
              ]}
            >
              {status.label}
            </Text>
          </View>
        </View>

        {/* =================================================
            ROUTE HERO
        ================================================= */}

        <View style={styles.routeCard}>
          <View style={styles.routeCardTop}>
            <View>
              <Text style={styles.routeEyebrow}>
                FLIGHT ROUTE
              </Text>

              <Text style={styles.airlineName}>
                {flight?.airline_name ||
                  'Airline'}
              </Text>
            </View>

            <View style={styles.dateBadge}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color="#55A9FF"
              />

              <Text style={styles.dateBadgeText}>
                {formatDate(
                  flight?.travel_date,
                )}
              </Text>
            </View>
          </View>

          <View style={styles.routeMain}>
            {/* FROM */}

            <View style={styles.routeLocation}>
              <Text style={styles.routeCode}>
                {routeInfo.fromCode}
              </Text>

              <Text
                numberOfLines={1}
                style={styles.routeCity}
              >
                {routeInfo.fromCity}
              </Text>

              {flight?.departure_time ? (
                <Text style={styles.routeTime}>
                  {flight.departure_time}
                </Text>
              ) : null}
            </View>

            {/* ROUTE LINE */}

            <View style={styles.routeCenter}>
              <View style={styles.routeLine} />

              <View style={styles.routePlane}>
                <Ionicons
                  name="airplane"
                  size={18}
                  color="#55A9FF"
                />
              </View>

              <View style={styles.routeLine} />
            </View>

            {/* TO */}

            <View
              style={[
                styles.routeLocation,
                styles.routeLocationRight,
              ]}
            >
              <Text style={styles.routeCode}>
                {routeInfo.toCode}
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  styles.routeCity,
                  styles.textRight,
                ]}
              >
                {routeInfo.toCity}
              </Text>

              {flight?.arrival_time ? (
                <Text
                  style={[
                    styles.routeTime,
                    styles.textRight,
                  ]}
                >
                  {flight.arrival_time}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* =================================================
            TRIP INFORMATION
        ================================================= */}

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Trip Information
            </Text>

            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#506A85"
            />
          </View>

          <View style={styles.infoGrid}>
            <InfoItem
              icon="location-outline"
              label="Departure"
              value={
                flight?.departure_airport_country ||
                routeInfo.fromCity
              }
            />

            <InfoItem
              icon="navigate-outline"
              label="Destination"
              value={
                flight?.destination_airport_country ||
                routeInfo.toCity
              }
            />

            <InfoItem
              icon="cube-outline"
              label="Total Space"
              value={
                flight?.capicity_in_kg !==
                  undefined &&
                flight?.capicity_in_kg !== null
                  ? `${flight.capicity_in_kg} kg`
                  : '—'
              }
            />

            <InfoItem
              icon="file-tray-outline"
              label="Available Space"
              value={
                flight?.available_space_in_kg !==
                  undefined &&
                flight?.available_space_in_kg !==
                  null
                  ? `${flight.available_space_in_kg} kg`
                  : '—'
              }
            />

            <InfoItem
              icon="shield-checkmark-outline"
              label="Verification"
              value={
                flight?.verification_status
                  ? String(
                      flight.verification_status,
                    )
                      .charAt(0)
                      .toUpperCase() +
                    String(
                      flight.verification_status,
                    ).slice(1)
                  : 'Pending'
              }
            />

            <InfoItem
              icon="airplane-outline"
              label="Trip Status"
              value={
                flight?.trip_status
                  ? String(
                      flight.trip_status,
                    )
                      .charAt(0)
                      .toUpperCase() +
                    String(
                      flight.trip_status,
                    ).slice(1)
                  : 'Pending'
              }
            />
          </View>
        </View>

        {/* =================================================
            TRAVEL CODE
        ================================================= */}

        {hasTravelCode ? (
          <View style={styles.travelCodeCard}>
            <View style={styles.travelCodeTop}>
              <View style={styles.travelCodeIcon}>
                <Ionicons
                  name="key-outline"
                  size={20}
                  color="#55A9FF"
                />
              </View>

              <View style={styles.travelCodeHeading}>
                <Text
                  style={
                    styles.travelCodeLabel
                  }
                >
                  TRAVEL CODE
                </Text>

                <Text
                  style={
                    styles.travelCodeSubtitle
                  }
                >
                  Your active trip access code
                </Text>
              </View>

              <View style={styles.secureBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={12}
                  color="#4AD69A"
                />

                <Text
                  style={styles.secureText}
                >
                  ACTIVE
                </Text>
              </View>
            </View>

            <View style={styles.codeBox}>
              <Text style={styles.travelCode}>
                {flight.travel_code}
              </Text>
            </View>

            <Text style={styles.travelCodeHint}>
              Keep this code private. It is used
              to access your active trip.
            </Text>
          </View>
        ) : null}

        {/* =================================================
    ACCEPTED PARCELS
================================================= */}

{isApproved ? (
  <View style={styles.parcelsCard}>
    <View style={styles.parcelsHeader}>
      <View>
        <Text style={styles.sectionTitle}>
          Parcels on this Trip
        </Text>

        <Text style={styles.parcelsSubtitle}>
          Accepted requests for this flight
        </Text>
      </View>

      <View style={styles.parcelCount}>
        <Text style={styles.parcelCountText}>
          {flightRequests.length}
        </Text>
      </View>
    </View>

    {parcelLoading ? (
      <View style={styles.parcelLoading}>
        <ActivityIndicator
          size="small"
          color="#55A9FF"
        />

        <Text style={styles.parcelLoadingText}>
          Loading parcels...
        </Text>
      </View>
    ) : flightRequests.length === 0 ? (
      <View style={styles.noParcels}>
        <View style={styles.noParcelIcon}>
          <Ionicons
            name="cube-outline"
            size={22}
            color="#506A85"
          />
        </View>

        <Text style={styles.noParcelTitle}>
          No accepted parcels
        </Text>

        <Text style={styles.noParcelText}>
          Accepted requests for this flight will appear here.
        </Text>
      </View>
    ) : (
      <View style={styles.parcelList}>
        {flightRequests.map(request => {
          const parcelState =
            getParcelState(request);

          return (
            <TouchableOpacity
              key={request._id}
              activeOpacity={0.84}
              style={styles.parcelItem}
              onPress={() =>
                navigation.navigate(
                  'TravelerRequestDetails',
                  {
                    request,
                    flight,
                  },
                )
              }>
              <View style={styles.parcelIcon}>
                <Ionicons
                  name={
                    request?.item_type ===
                    'document'
                      ? 'document-text-outline'
                      : 'cube-outline'
                  }
                  size={20}
                  color="#55A9FF"
                />
              </View>

              <View style={styles.parcelContent}>
                <View style={styles.parcelTitleRow}>
                  <Text style={styles.parcelTitle}>
                    {request?.item_type ===
                    'document'
                      ? 'Document'
                      : 'Parcel'}
                  </Text>

                  <View
                    style={[
                      styles.parcelStatus,
                      {
                        backgroundColor:
                          parcelState.background,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.parcelStatusText,
                        {
                          color:
                            parcelState.color,
                        },
                      ]}>
                      {parcelState.text}
                    </Text>
                  </View>
                </View>

                <Text style={styles.parcelRequestId}>
                  Request #
                  {String(request?._id || '')
                    .slice(-6)
                    .toUpperCase()}
                </Text>

                <View style={styles.parcelMeta}>
                  <View style={styles.parcelMetaItem}>
                    <Ionicons
                      name="scale-outline"
                      size={12}
                      color="#71859A"
                    />

                    <Text style={styles.parcelMetaText}>
                      {formatParcelWeight(
                        request?.weight_in_grams,
                      )}
                    </Text>
                  </View>

                  {request?.receiver?.name ? (
                    <View style={styles.parcelMetaItem}>
                      <Ionicons
                        name="person-outline"
                        size={12}
                        color="#71859A"
                      />

                      <Text
                        numberOfLines={1}
                        style={styles.parcelMetaText}>
                        {request.receiver.name}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {request?.parcel_code ? (
                  <View style={styles.parcelCodeRow}>
                    <Ionicons
                      name="key-outline"
                      size={12}
                      color="#55A9FF"
                    />

                    <Text style={styles.parcelCodeLabel}>
                      Parcel Code
                    </Text>

                    <Text style={styles.parcelCodeValue}>
                      {request.parcel_code}
                    </Text>
                  </View>
                ) : null}
              </View>

              <Ionicons
                name="chevron-forward"
                size={17}
                color="#50657D"
              />
            </TouchableOpacity>
          );
        })}
      </View>
    )}
  </View>
        ) : null}
        
        {/* =================================================
            PENDING
        ================================================= */}

        {isPending ? (
          <View style={styles.pendingCard}>
            <View style={styles.noticeIcon}>
              <Ionicons
                name="time-outline"
                size={21}
                color="#F3BD58"
              />
            </View>

            <View style={styles.noticeContent}>
              <Text style={styles.pendingTitle}>
                Verification in progress
              </Text>

              <Text style={styles.pendingText}>
                Your flight is currently
                waiting for verification.
              </Text>
            </View>
          </View>
        ) : null}

        {/* =================================================
            REJECTED
        ================================================= */}

        {isRejected ? (
          <View style={styles.rejectedCard}>
            <View style={styles.rejectedTop}>
              <View style={styles.rejectedIcon}>
                <Ionicons
                  name="alert-circle-outline"
                  size={21}
                  color="#FF747D"
                />
              </View>

              <View style={styles.rejectedHeading}>
                <Text style={styles.rejectedTitle}>
                  Verification Rejected
                </Text>

                <Text
                  style={styles.rejectedSubtitle}
                >
                  Review the issue before
                  submitting again
                </Text>
              </View>
            </View>

            {flight?.verification_reason ? (
              <View style={styles.reasonBox}>
                <Text style={styles.reasonLabel}>
                  REASON
                </Text>

                <Text style={styles.reasonText}>
                  {
                    flight.verification_reason
                  }
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.84}
              style={styles.resubmitButton}
              onPress={handleResubmit}
            >
              <Ionicons
                name="document-attach-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text
                style={
                  styles.resubmitButtonText
                }
              >
                Correct Ticket & Resubmit
              </Text>

              <Ionicons
                name="chevron-forward"
                size={17}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* =================================================
            CANCELLED
        ================================================= */}

        {isCancelled ? (
          <View style={styles.cancelledCard}>
            <View style={styles.noticeIcon}>
              <Ionicons
                name="close-circle-outline"
                size={21}
                color="#A0AEC0"
              />
            </View>

            <View style={styles.noticeContent}>
              <Text
                style={styles.cancelledTitle}
              >
                Trip Cancelled
              </Text>

              <Text style={styles.cancelledText}>
                {flight?.cancel_reason ||
                  'This trip has been cancelled.'}
              </Text>
            </View>
          </View>
        ) : null}

        {/* =================================================
            TIMELINE — ALWAYS LAST
        ================================================= */}

        <View style={styles.timelineCard}>
          <View style={styles.timelineHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Flight Timeline
              </Text>

              <Text
                style={
                  styles.timelineSubtitle
                }
              >
                Activity history
              </Text>
            </View>

            <Ionicons
              name="git-branch-outline"
              size={20}
              color="#506A85"
            />
          </View>

          {history.length === 0 ? (
            <View style={styles.timelineEmpty}>
              <Ionicons
                name="time-outline"
                size={22}
                color="#50657D"
              />

              <Text
                style={
                  styles.timelineEmptyText
                }
              >
                No activity available yet.
              </Text>
            </View>
          ) : (
            <View style={styles.timelineList}>
              {history.map(
                (item, index) => {
                  const eventAt =
                    item?.event_at ||
                    item?.createdAt;

                  const color =
                    getTimelineColor(item);

                  const nextItem =
                    history[index + 1];

                  const nextColor =
                    nextItem
                      ? getTimelineColor(
                          nextItem,
                        )
                      : color;

                  const isLast =
                    index ===
                    history.length - 1;

                  return (
                    <View
                      key={
                        item?._id ||
                        `${
                          item?.event ||
                          'event'
                        }-${
                          eventAt ||
                          index
                        }`
                      }
                      style={
                        styles.timelineRow
                      }
                    >
                      {/* =====================
                          CONTINUOUS RAIL
                      ===================== */}

                      <View
                        style={
                          styles.timelineRail
                        }
                      >
                        <View
                          style={[
                            styles.timelineDotOuter,
                            {
                              borderColor:
                                color,
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.timelineDot,
                              {
                                backgroundColor:
                                  color,
                              },
                            ]}
                          />
                        </View>

                        {!isLast ? (
                          <View
                            style={[
                              styles.timelineLine,
                              {
                                backgroundColor:
                                  nextColor,
                              },
                            ]}
                          />
                        ) : null}
                      </View>

                      {/* =====================
                          EVENT
                      ===================== */}

                      <View
                        style={[
                          styles.timelineContent,
                          !isLast &&
                            styles.timelineContentSpacing,
                        ]}
                      >
                        <View
                          style={
                            styles.timelineTopRow
                          }
                        >
                          <Text
                            numberOfLines={1}
                            style={
                              styles.timelineTitle
                            }
                          >
                            {getEventTitle(
                              item,
                            )}
                          </Text>

                          <Text
                            style={
                              styles.timelineTime
                            }
                          >
                            {formatEventDateTime(
                              eventAt,
                            )}
                          </Text>
                        </View>

                        {item?.description ? (
                          <Text
                            style={
                              styles.timelineDescription
                            }
                          >
                            {
                              item.description
                            }
                          </Text>
                        ) : null}

                        {item?.reason ? (
                          <View
                            style={
                              styles.timelineReason
                            }
                          >
                            <Text
                              style={
                                styles.timelineReasonLabel
                              }
                            >
                              REASON
                            </Text>

                            <Text
                              style={
                                styles.timelineReasonText
                              }
                            >
                              {item.reason}
                            </Text>
                          </View>
                        ) : null}

                        {item?.travel_code ? (
                          <View
                            style={
                              styles.timelineCode
                            }
                          >
                            <Ionicons
                              name="key-outline"
                              size={11}
                              color="#55A9FF"
                            />

                            <Text
                              style={
                                styles.timelineCodeText
                              }
                            >
                              {
                                item.travel_code
                              }
                            </Text>
                          </View>
                        ) : null}

                        <Text
                          style={
                            styles.timelineActor
                          }
                        >
                          By{' '}
                          {getTimelineActor(
                            item,
                          )}
                        </Text>
                      </View>
                    </View>
                  );
                },
              )}
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TravelerFlightDetailsScreen;

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B121C',
  },

  /* HEADER */

  header: {
    height: 62,

    paddingHorizontal: 16,

    borderBottomWidth: 1,
    borderBottomColor: '#172230',

    backgroundColor: '#0B121C',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 38,
    height: 38,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: '#1D3044',

    backgroundColor: '#101C2A',

    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#F5F8FC',

    fontSize: 15,
    fontWeight: '900',
  },

  headerPlaceholder: {
    width: 38,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  /* STATUS */

  statusBanner: {
    padding: 13,

    borderRadius: 16,

    borderWidth: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIcon: {
    width: 39,
    height: 39,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',
  },

  statusContent: {
    flex: 1,
    marginLeft: 10,
  },

  statusLabel: {
    color: '#71849A',

    fontSize: 8.5,
    fontWeight: '700',
  },

  statusValue: {
    fontSize: 12,
    fontWeight: '900',

    marginTop: 2,
  },

  statusPill: {
    height: 27,

    paddingHorizontal: 9,

    borderRadius: 9,
    borderWidth: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  statusSmallDot: {
    width: 5,
    height: 5,

    borderRadius: 3,

    marginRight: 5,
  },

  statusPillText: {
    fontSize: 8.5,
    fontWeight: '900',
  },

  /* ROUTE */

  routeCard: {
    marginTop: 13,
    padding: 16,

    borderRadius: 18,

    borderWidth: 1,
    borderColor: '#1B2B3E',

    backgroundColor: '#0E1825',
  },

  routeCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  routeEyebrow: {
    color: '#438DD7',

    fontSize: 9,
    fontWeight: '900',

    letterSpacing: 1.2,
  },

  airlineName: {
    color: '#EEF4FB',

    fontSize: 15,
    fontWeight: '900',

    marginTop: 3,
  },

  dateBadge: {
    height: 29,

    paddingHorizontal: 9,

    borderRadius: 9,

    borderWidth: 1,
    borderColor: '#1F3850',

    backgroundColor: '#102033',

    flexDirection: 'row',
    alignItems: 'center',
  },

  dateBadgeText: {
    color: '#91A4B8',

    fontSize: 9,

    marginLeft: 5,
  },

  routeMain: {
    marginTop: 23,

    flexDirection: 'row',
    alignItems: 'center',
  },

  routeLocation: {
    width: 110,
  },

  routeLocationRight: {
    alignItems: 'flex-end',
  },

  routeCode: {
    color: '#F6F9FC',

    fontSize: 26,
    fontWeight: '900',
  },

  routeCity: {
    color: '#74889E',

    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },

  routeTime: {
    color: '#55A9FF',

    fontSize: 10,
    fontWeight: '800',

    marginTop: 6,
  },

  textRight: {
    textAlign: 'right',
  },

  routeCenter: {
    flex: 1,

    paddingHorizontal: 7,

    flexDirection: 'row',
    alignItems: 'center',
  },

  routeLine: {
    flex: 1,

    height: 1,

    backgroundColor: '#2A3C50',
  },

  routePlane: {
    width: 34,
    height: 34,

    marginHorizontal: 5,

    borderRadius: 17,

    borderWidth: 1,
    borderColor: '#24445F',

    backgroundColor: '#122439',

    alignItems: 'center',
    justifyContent: 'center',
  },

  /* SECTION CARD */

  sectionCard: {
    marginTop: 13,
    padding: 16,

    borderRadius: 17,

    borderWidth: 1,
    borderColor: '#1B2A3D',

    backgroundColor: '#0E1825',
  },

  sectionHeader: {
    paddingBottom: 13,

    borderBottomWidth: 1,
    borderBottomColor: '#192A3C',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    color: '#EEF4FB',

    fontSize: 15,
    fontWeight: '900',
  },

  infoGrid: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  infoItem: {
    width: '48%',
    minHeight: 66,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#162638',
    backgroundColor: '#0F1C2B',
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    width: 34,
    height: 34,

    borderRadius: 10,

    backgroundColor:
      'rgba(39, 142, 245, 0.07)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  infoContent: {
    flex: 1,
    marginLeft: 10,
  },

  infoLabel: {
    color: '#64788E',

    fontSize: 10,
    fontWeight: '700',
  },

  infoValue: {
    color: '#DCE6F1',

    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginTop: 3,
  },

  /* TRAVEL CODE */

  travelCodeCard: {
    marginTop: 13,
    padding: 16,

    borderRadius: 17,

    borderWidth: 1,
    borderColor:
      'rgba(39, 142, 245, 0.25)',

    backgroundColor: '#0E1B2A',
  },

  travelCodeTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  travelCodeIcon: {
    width: 40,
    height: 40,

    borderRadius: 12,

    backgroundColor:
      'rgba(39, 142, 245, 0.09)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  travelCodeHeading: {
    flex: 1,

    marginLeft: 10,
  },

  travelCodeLabel: {
    color: '#55A9FF',

    fontSize: 8,
    fontWeight: '900',

    letterSpacing: 1,
  },

  travelCodeSubtitle: {
    color: '#70849A',

    fontSize: 9,

    marginTop: 3,
  },

  secureBadge: {
    height: 25,

    paddingHorizontal: 8,

    borderRadius: 8,

    backgroundColor:
      'rgba(74, 214, 154, 0.08)',

    flexDirection: 'row',
    alignItems: 'center',
  },

  secureText: {
    color: '#4AD69A',

    fontSize: 7.5,
    fontWeight: '900',

    marginLeft: 4,
  },

  codeBox: {
    marginTop: 14,

    paddingVertical: 13,

    borderRadius: 11,

    borderWidth: 1,
    borderColor: '#213C57',

    backgroundColor: '#0A1623',

    alignItems: 'center',
  },

  travelCode: {
    color: '#F4F8FC',

    fontSize: 18,
    fontWeight: '900',

    letterSpacing: 2.2,
  },

  travelCodeHint: {
    color: '#61758B',

    fontSize: 8.5,
    lineHeight: 13,

    marginTop: 9,
  },

  /* NOTICES */

  pendingCard: {
    marginTop: 13,
    padding: 14,

    borderRadius: 15,

    borderWidth: 1,
    borderColor:
      'rgba(243, 189, 88, 0.16)',

    backgroundColor:
      'rgba(243, 189, 88, 0.05)',

    flexDirection: 'row',
    alignItems: 'center',
  },

  noticeIcon: {
    width: 39,
    height: 39,

    borderRadius: 12,

    backgroundColor:
      'rgba(243, 189, 88, 0.07)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  noticeContent: {
    flex: 1,

    marginLeft: 11,
  },

  pendingTitle: {
    color: '#E4C37D',

    fontSize: 11,
    fontWeight: '800',
  },

  pendingText: {
    color: '#9B8C6B',

    fontSize: 9.5,
    lineHeight: 14,

    marginTop: 3,
  },

  /* REJECTED */

  rejectedCard: {
    marginTop: 13,
    padding: 15,

    borderRadius: 17,

    borderWidth: 1,
    borderColor:
      'rgba(255, 116, 125, 0.18)',

    backgroundColor:
      'rgba(255, 116, 125, 0.045)',
  },

  rejectedTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rejectedIcon: {
    width: 40,
    height: 40,

    borderRadius: 12,

    backgroundColor:
      'rgba(255, 116, 125, 0.08)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  rejectedHeading: {
    flex: 1,

    marginLeft: 10,
  },

  rejectedTitle: {
    color: '#FF969D',

    fontSize: 11.5,
    fontWeight: '900',
  },

  rejectedSubtitle: {
    color: '#9F7479',

    fontSize: 9,

    marginTop: 3,
  },

  reasonBox: {
    marginTop: 13,

    padding: 11,

    borderRadius: 10,

    borderWidth: 1,
    borderColor:
      'rgba(255, 116, 125, 0.12)',

    backgroundColor:
      'rgba(255, 116, 125, 0.04)',
  },

  reasonLabel: {
    color: '#FF747D',

    fontSize: 7.5,
    fontWeight: '900',

    letterSpacing: 0.8,
  },

  reasonText: {
    color: '#C49A9E',

    fontSize: 10,
    lineHeight: 15,

    marginTop: 4,
  },

  resubmitButton: {
    height: 45,

    marginTop: 13,
    paddingHorizontal: 14,

    borderRadius: 12,

    backgroundColor: '#1687F8',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resubmitButtonText: {
    flex: 1,

    color: '#FFFFFF',

    fontSize: 10.5,
    fontWeight: '900',

    textAlign: 'center',
  },

  /* CANCELLED */

  cancelledCard: {
    marginTop: 13,
    padding: 14,

    borderRadius: 15,

    borderWidth: 1,
    borderColor:
      'rgba(160, 174, 192, 0.15)',

    backgroundColor:
      'rgba(160, 174, 192, 0.04)',

    flexDirection: 'row',
    alignItems: 'center',
  },

  cancelledTitle: {
    color: '#BCC6D1',

    fontSize: 11,
    fontWeight: '800',
  },

  cancelledText: {
    color: '#77889B',

    fontSize: 9.5,
    lineHeight: 14,

    marginTop: 3,
  },

  /* =====================================================
     PREMIUM TIMELINE
  ===================================================== */

  timelineCard: {
    marginTop: 13,

    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 17,

    borderRadius: 17,

    borderWidth: 1,
    borderColor: '#1B2A3D',

    backgroundColor: '#0E1825',
  },

  timelineHeader: {
    paddingBottom: 14,

    borderBottomWidth: 1,
    borderBottomColor: '#192A3C',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  timelineSubtitle: {
    color: '#687B92',

    fontSize: 9,

    marginTop: 3,
  },

  timelineList: {
    marginTop: 18,
  },

  timelineRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  /* RAIL */

  timelineRail: {
    width: 20,

    alignItems: 'center',
  },

  timelineDotOuter: {
    width: 14,
    height: 14,

    borderRadius: 7,

    borderWidth: 1.5,

    backgroundColor: '#0E1825',

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 2,
  },

  timelineDot: {
    width: 6,
    height: 6,

    borderRadius: 3,
  },

  timelineLine: {
    width: 2,

    flex: 1,

    minHeight: 34,

    opacity: 0.7,
  },

  /* EVENT CONTENT */

  timelineContent: {
    flex: 1,

    paddingLeft: 10,
    paddingBottom: 1,
  },

  timelineContentSpacing: {
    paddingBottom: 18,
  },

  timelineTopRow: {
    minHeight: 16,

    flexDirection: 'row',
    alignItems: 'center',
  },

  timelineTitle: {
    flex: 1,

    color: '#EEF4FB',

    fontSize: 11,
    fontWeight: '800',

    paddingRight: 7,
  },

  timelineTime: {
    color: '#657A91',

    fontSize: 8,
    fontWeight: '600',

    textAlign: 'right',
  },

  timelineDescription: {
    color: '#7B8EA3',

    fontSize: 9.5,
    lineHeight: 14,

    marginTop: 4,
    paddingRight: 3,
  },

  timelineActor: {
    color: '#526B84',

    fontSize: 8,
    fontWeight: '700',

    marginTop: 5,
  },

  /* TIMELINE REASON */

  timelineReason: {
    alignSelf: 'flex-start',

    maxWidth: '95%',

    marginTop: 7,

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 8,

    borderWidth: 1,
    borderColor:
      'rgba(255, 116, 125, 0.13)',

    backgroundColor:
      'rgba(255, 116, 125, 0.05)',
  },

  timelineReasonLabel: {
    color: '#FF747D',

    fontSize: 7.5,
    fontWeight: '900',
  },

  timelineReasonText: {
    color: '#BF969A',

    fontSize: 9,
    lineHeight: 13,

    marginTop: 2,
  },

  /* TIMELINE TRAVEL CODE */

  timelineCode: {
    alignSelf: 'flex-start',

    marginTop: 7,

    paddingHorizontal: 7,
    paddingVertical: 4,

    borderRadius: 7,

    backgroundColor:
      'rgba(39, 142, 245, 0.08)',

    flexDirection: 'row',
    alignItems: 'center',
  },

  timelineCodeText: {
    color: '#55A9FF',

    fontSize: 8.5,
    fontWeight: '800',

    marginLeft: 4,
  },

  /* EMPTY TIMELINE */

  timelineEmpty: {
    marginTop: 15,

    paddingVertical: 20,

    borderRadius: 12,

    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2B3B4C',

    alignItems: 'center',
  },

  timelineEmptyText: {
    color: '#667A91',

    fontSize: 9.5,

    marginTop: 6,
  },

  /* MISSING */

  missingContainer: {
    flex: 1,

    paddingHorizontal: 30,

    alignItems: 'center',
    justifyContent: 'center',
  },

  missingIcon: {
    width: 65,
    height: 65,

    borderRadius: 21,

    backgroundColor:
      'rgba(39, 142, 245, 0.07)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  missingTitle: {
    color: '#EEF4FB',

    fontSize: 16,
    fontWeight: '900',

    marginTop: 16,
  },

  missingText: {
    color: '#71849A',

    fontSize: 10,

    marginTop: 6,
  },

  bottomSpace: {
    height: 30,
  },
  parcelsCard: {
  marginTop: 13,
  padding: 16,
  borderRadius: 17,
  borderWidth: 1,
  borderColor: '#1B2A3D',
  backgroundColor: '#0E1825',
},

parcelsHeader: {
  paddingBottom: 13,
  borderBottomWidth: 1,
  borderBottomColor: '#192A3C',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

parcelsSubtitle: {
  color: '#64788E',
  fontSize: 9,
  marginTop: 4,
},

parcelCount: {
  minWidth: 29,
  height: 29,
  paddingHorizontal: 8,
  borderRadius: 9,
  backgroundColor: 'rgba(39,142,245,0.09)',
  borderWidth: 1,
  borderColor: 'rgba(85,169,255,0.20)',
  justifyContent: 'center',
  alignItems: 'center',
},

parcelCountText: {
  color: '#55A9FF',
  fontSize: 11,
  fontWeight: '900',
},

parcelLoading: {
  minHeight: 100,
  alignItems: 'center',
  justifyContent: 'center',
},

parcelLoadingText: {
  color: '#667A91',
  fontSize: 9,
  marginTop: 7,
},

noParcels: {
  minHeight: 125,
  alignItems: 'center',
  justifyContent: 'center',
},

noParcelIcon: {
  width: 43,
  height: 43,
  borderRadius: 13,
  backgroundColor: '#101E2D',
  alignItems: 'center',
  justifyContent: 'center',
},

noParcelTitle: {
  color: '#AAB8C8',
  fontSize: 11,
  fontWeight: '800',
  marginTop: 8,
},

noParcelText: {
  color: '#586D83',
  fontSize: 8.5,
  marginTop: 4,
  textAlign: 'center',
},

parcelList: {
  paddingTop: 5,
},

parcelItem: {
  minHeight: 88,
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#182A3C',
  flexDirection: 'row',
  alignItems: 'center',
},

parcelIcon: {
  width: 40,
  height: 40,
  borderRadius: 12,
  backgroundColor: 'rgba(39,142,245,0.08)',
  alignItems: 'center',
  justifyContent: 'center',
},

parcelContent: {
  flex: 1,
  marginLeft: 10,
  marginRight: 6,
},

parcelTitleRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

parcelTitle: {
  color: '#E4EDF7',
  fontSize: 11,
  fontWeight: '800',
},

parcelStatus: {
  marginLeft: 7,
  paddingHorizontal: 6,
  paddingVertical: 3,
  borderRadius: 6,
},

parcelStatusText: {
  fontSize: 6.5,
  fontWeight: '900',
},

parcelRequestId: {
  color: '#536A82',
  fontSize: 8,
  marginTop: 3,
},

parcelMeta: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 6,
  gap: 14,
},

parcelMetaItem: {
  flexDirection: 'row',
  alignItems: 'center',
},

parcelMetaText: {
  color: '#8193A7',
  fontSize: 8.5,
  marginLeft: 4,
  maxWidth: 100,
},

parcelCodeRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 7,
},

parcelCodeLabel: {
  color: '#63788F',
  fontSize: 7.5,
  marginLeft: 4,
},

parcelCodeValue: {
  color: '#55A9FF',
  fontSize: 8.5,
  fontWeight: '900',
  marginLeft: 5,
},
});