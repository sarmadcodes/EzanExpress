import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useCallback, useMemo, useState } from 'react';

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

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { BASE_API_URI } from '../../../constant/API';

const PAGE_SIZE = 20;

/* =========================================================
   HELPERS
========================================================= */

const normalizeFlights = payload => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.flights)) return payload.flights;
  if (Array.isArray(payload?.data?.flights)) return payload.data.flights;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
};

const normalizePagination = (payload, fallbackPage = 1, rows = []) => {
  const raw =
    payload?.pagination ||
    payload?.data?.pagination ||
    payload?.meta?.pagination ||
    {};

  const total =
    Number(
      raw?.total ??
        raw?.totalRecords ??
        raw?.totalItems ??
        payload?.total ??
        payload?.data?.total,
    ) || rows.length;

  const limit =
    Number(raw?.limit ?? raw?.pageSize ?? raw?.perPage) || PAGE_SIZE;

  const page = Number(raw?.page ?? raw?.currentPage) || fallbackPage;

  const totalPages =
    Number(raw?.totalPages ?? raw?.pages) ||
    Math.max(1, Math.ceil(total / limit));

  return {
    page,
    limit,
    total,
    totalPages,
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

const getFlightTimestamp = flight => {
  const value = flight?.travel_date || flight?.createdAt;

  if (!value) return 0;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 0;
  }

  return date.getTime();
};

const getStatusConfig = flight => {
  if (flight?.trip_status === 'completed') {
    return {
      label: 'Completed',
      icon: 'checkmark-circle',
      color: '#49D596',
      background: 'rgba(73, 213, 150, 0.09)',
      border: 'rgba(73, 213, 150, 0.18)',
    };
  }

  if (flight?.trip_status === 'cancelled') {
    return {
      label: 'Cancelled',
      icon: 'close-circle',
      color: '#A1AFC0',
      background: 'rgba(161, 175, 192, 0.08)',
      border: 'rgba(161, 175, 192, 0.16)',
    };
  }

  if (flight?.trip_status === 'expired') {
    return {
      label: 'Expired',
      icon: 'time',
      color: '#93A4B7',
      background: 'rgba(147, 164, 183, 0.08)',
      border: 'rgba(147, 164, 183, 0.16)',
    };
  }

  if (flight?.verification_status === 'rejected') {
    return {
      label: 'Rejected',
      icon: 'alert-circle',
      color: '#FF747D',
      background: 'rgba(255, 116, 125, 0.08)',
      border: 'rgba(255, 116, 125, 0.18)',
    };
  }

  if (
    flight?.verification_status === 'approved' &&
    flight?.trip_status === 'active'
  ) {
    return {
      label: 'Active',
      icon: 'checkmark-circle',
      color: '#49D596',
      background: 'rgba(73, 213, 150, 0.09)',
      border: 'rgba(73, 213, 150, 0.18)',
    };
  }

  if (flight?.verification_status === 'approved') {
    return {
      label: 'Approved',
      icon: 'checkmark-circle',
      color: '#49D596',
      background: 'rgba(73, 213, 150, 0.09)',
      border: 'rgba(73, 213, 150, 0.18)',
    };
  }

  return {
    label: 'Pending',
    icon: 'time-outline',
    color: '#F3BD58',
    background: 'rgba(243, 189, 88, 0.08)',
    border: 'rgba(243, 189, 88, 0.18)',
  };
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({
  title,
  subtitle,
  count,
  icon,
  iconColor = '#55A9FF',
}) => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderLeft}>
        <View style={styles.sectionIcon}>
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>

        <View style={styles.sectionText}>
          <Text style={styles.sectionTitle}>{title}</Text>

          {subtitle ? (
            <Text style={styles.sectionSubtitle}>{subtitle}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.countBadge}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </View>
  );
};

/* =========================================================
   MINIMAL FLIGHT CARD

   ONLY:
   FROM -> TO
   STATUS
========================================================= */

const FlightCard = ({ flight, onPress }) => {
  const route = getRoute(flight);
  const status = getStatusConfig(flight);

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      style={styles.flightCard}
      onPress={onPress}
    >
      <View style={styles.routeRow}>
        {/* FROM */}

        <View style={styles.routeSide}>
          <Text numberOfLines={1} style={styles.airportCode}>
            {route.fromCode}
          </Text>

          <Text numberOfLines={1} style={styles.cityName}>
            {route.fromCity}
          </Text>
        </View>

        {/* CENTER */}

        <View style={styles.routeCenter}>
          <View style={styles.routeLine} />

          <View style={styles.planeCircle}>
            <Ionicons
              name="airplane"
              size={15}
              color="#62B2FF"
            />
          </View>

          <View style={styles.routeLine} />
        </View>

        {/* TO */}

        <View style={[styles.routeSide, styles.routeSideRight]}>
          <Text
            numberOfLines={1}
            style={[styles.airportCode, styles.rightText]}
          >
            {route.toCode}
          </Text>

          <Text
            numberOfLines={1}
            style={[styles.cityName, styles.rightText]}
          >
            {route.toCity}
          </Text>
        </View>
      </View>

      <View style={styles.cardBottom}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: status.background,
              borderColor: status.border,
            },
          ]}
        >
          <Ionicons
            name={status.icon}
            size={11}
            color={status.color}
          />

          <Text
            style={[
              styles.statusText,
              {
                color: status.color,
              },
            ]}
          >
            {status.label}
          </Text>
        </View>

        <View style={styles.chevron}>
          <Ionicons
            name="chevron-forward"
            size={16}
            color="#667D94"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

/* =========================================================
   LIST LOADER
========================================================= */

const FlightsLoader = () => {
  return (
    <View style={styles.loaderBox}>
      <ActivityIndicator size="small" color="#55A9FF" />

      <Text style={styles.loaderText}>
        Loading your flights...
      </Text>
    </View>
  );
};

/* =========================================================
   SCREEN
========================================================= */

const MyTripsScreen = ({ navigation }) => {
  const [flights, setFlights] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState('');

  /* =======================================================
     FETCH FLIGHTS
  ======================================================= */

  const getFlights = async ({
    page = 1,
    append = false,
    refresh = false,
  } = {}) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      setError('');

      const token = await AsyncStorage.getItem('usertoken');

      if (!token) {
        setError('Your session has expired.');
        return;
      }

      const response = await axios.get(
        `${BASE_API_URI}/flight/get`,
        {
          params: {
            page,
            limit: PAGE_SIZE,
          },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const rows = normalizeFlights(response?.data);

      const nextPagination = normalizePagination(
        response?.data,
        page,
        rows,
      );

      setPagination(nextPagination);

      if (append) {
        setFlights(previous => {
          const map = new Map();

          [...previous, ...rows].forEach(item => {
            const key = item?._id || item?.id;

            if (key) {
              map.set(key, item);
            }
          });

          return Array.from(map.values());
        });
      } else {
        setFlights(rows);
      }
    } catch (err) {
      console.log(
        'MY TRIPS ERROR:',
        err?.response?.data || err?.message || err,
      );

      if (!append) {
        setFlights([]);
      }

      setError(
        err?.response?.data?.msg ||
          err?.response?.data?.message ||
          'Unable to load your flights.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  /* =======================================================
     REFRESH ON SCREEN FOCUS
  ======================================================= */

  useFocusEffect(
    useCallback(() => {
      getFlights({
        page: 1,
      });
    }, []),
  );

  /* =======================================================
     GROUP FLIGHTS
  ======================================================= */

  const groups = useMemo(() => {
    const currentUpcoming = [];
    const pending = [];
    const rejected = [];
    const history = [];

    flights.forEach(flight => {
      const verificationStatus =
        flight?.verification_status;

      const tripStatus = flight?.trip_status;

      /*
       * COMPLETED / CANCELLED / EXPIRED
       */

      if (
        tripStatus === 'completed' ||
        tripStatus === 'cancelled' ||
        tripStatus === 'expired'
      ) {
        history.push(flight);
        return;
      }

      /*
       * REJECTED
       */

      if (verificationStatus === 'rejected') {
        rejected.push(flight);
        return;
      }

      /*
       * PENDING
       */

      if (
        verificationStatus === 'pending' ||
        !verificationStatus
      ) {
        pending.push(flight);
        return;
      }

      /*
       * APPROVED / ACTIVE
       */

      if (
        verificationStatus === 'approved' ||
        tripStatus === 'active'
      ) {
        currentUpcoming.push(flight);
        return;
      }

      history.push(flight);
    });

    currentUpcoming.sort(
      (a, b) =>
        getFlightTimestamp(a) -
        getFlightTimestamp(b),
    );

    pending.sort(
      (a, b) =>
        getFlightTimestamp(a) -
        getFlightTimestamp(b),
    );

    rejected.sort(
      (a, b) =>
        getFlightTimestamp(b) -
        getFlightTimestamp(a),
    );

    history.sort(
      (a, b) =>
        getFlightTimestamp(b) -
        getFlightTimestamp(a),
    );

    return {
      currentUpcoming,
      pending,
      rejected,
      history,
    };
  }, [flights]);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const openFlightDetails = flight => {
    navigation.navigate('TravelerFlightDetails', {
      flight,
    });
  };

  const registerFlight = () => {
    navigation.navigate('FlightDetails', {
      from: 'my-trips',
    });
  };

  /* =======================================================
     LOAD MORE
  ======================================================= */

  const loadMore = () => {
    if (
      loading ||
      loadingMore ||
      pagination.page >= pagination.totalPages
    ) {
      return;
    }

    getFlights({
      page: pagination.page + 1,
      append: true,
    });
  };

  /* =======================================================
     SECTION
  ======================================================= */

  const renderSection = ({
    title,
    subtitle,
    icon,
    iconColor,
    data,
  }) => {
    if (!data.length) {
      return null;
    }

    return (
      <View style={styles.section}>
        <SectionHeader
          title={title}
          subtitle={subtitle}
          count={data.length}
          icon={icon}
          iconColor={iconColor}
        />

        <View style={styles.cards}>
          {data.map((flight, index) => (
            <FlightCard
              key={flight?._id || flight?.id || index}
              flight={flight}
              onPress={() =>
                openFlightDetails(flight)
              }
            />
          ))}
        </View>
      </View>
    );
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
          ALWAYS VISIBLE
      =================================================== */}

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.headerEyebrow}>
            TRAVEL
          </Text>

          <Text style={styles.headerTitle}>
            My Trips
          </Text>

          <Text style={styles.headerSubtitle}>
            Your flights in one place
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.82}
          style={styles.addButton}
          onPress={registerFlight}
        >
          <Ionicons
            name="add"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() =>
              getFlights({
                page: 1,
                refresh: true,
              })
            }
            tintColor="#55A9FF"
            colors={['#55A9FF']}
          />
        }
      >
        {/* ONLY LIST LOADS */}

        {loading ? (
          <FlightsLoader />
        ) : null}

        {/* ERROR */}

        {!loading && error ? (
          <View style={styles.errorCard}>
            <View style={styles.errorIcon}>
              <Ionicons
                name="cloud-offline-outline"
                size={23}
                color="#FF747D"
              />
            </View>

            <View style={styles.errorTextWrap}>
              <Text style={styles.errorTitle}>
                Unable to load flights
              </Text>

              <Text style={styles.errorMessage}>
                {error}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.retryButton}
              onPress={() =>
                getFlights({
                  page: 1,
                })
              }
            >
              <Ionicons
                name="refresh"
                size={17}
                color="#62B2FF"
              />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* EMPTY */}

        {!loading &&
        !error &&
        flights.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="airplane-outline"
                size={31}
                color="#62B2FF"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No trips yet
            </Text>

            <Text style={styles.emptyText}>
              Register your first flight to start
              your travel journey.
            </Text>

            <TouchableOpacity
              activeOpacity={0.82}
              style={styles.registerButton}
              onPress={registerFlight}
            >
              <Ionicons
                name="add-circle-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.registerButtonText}>
                Register Flight
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* FLIGHTS */}

        {!loading &&
        !error &&
        flights.length > 0 ? (
          <>
            {/* CURRENT / UPCOMING */}

            {renderSection({
              title: 'Current & Upcoming',
              subtitle: 'Approved travel',
              icon: 'navigate-circle-outline',
              iconColor: '#49D596',
              data: groups.currentUpcoming,
            })}

            {/* PENDING */}

            {renderSection({
              title: 'Pending Verification',
              subtitle: 'Waiting for review',
              icon: 'time-outline',
              iconColor: '#F3BD58',
              data: groups.pending,
            })}

            {/* REJECTED */}

            {renderSection({
              title: 'Rejected',
              subtitle: 'Needs your attention',
              icon: 'alert-circle-outline',
              iconColor: '#FF747D',
              data: groups.rejected,
            })}

            {/* HISTORY */}

            {renderSection({
              title: 'Trip History',
              subtitle: 'Previous trips',
              icon: 'archive-outline',
              iconColor: '#91A3B6',
              data: groups.history,
            })}

            {/* LOAD MORE */}

            {pagination.page <
            pagination.totalPages ? (
              <TouchableOpacity
                activeOpacity={0.82}
                style={styles.loadMoreButton}
                onPress={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? (
                  <>
                    <ActivityIndicator
                      size="small"
                      color="#62B2FF"
                    />

                    <Text
                      style={
                        styles.loadMoreText
                      }
                    >
                      Loading...
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={
                        styles.loadMoreText
                      }
                    >
                      Load More Flights
                    </Text>

                    <Ionicons
                      name="chevron-down"
                      size={16}
                      color="#62B2FF"
                    />
                  </>
                )}
              </TouchableOpacity>
            ) : null}
          </>
        ) : null}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyTripsScreen;

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
    minHeight: 88,

    paddingHorizontal: 19,
    paddingVertical: 11,

    backgroundColor: '#0B121C',

    borderBottomWidth: 1,
    borderBottomColor: '#172230',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerText: {
    flex: 1,
  },

  headerEyebrow: {
    color: '#438DD7',

    fontSize: 8,
    fontWeight: '900',

    letterSpacing: 1.4,
  },

  headerTitle: {
    color: '#F5F8FC',

    fontSize: 22,
    fontWeight: '900',

    marginTop: 2,
  },

  headerSubtitle: {
    color: '#667A91',

    fontSize: 10,
    marginTop: 3,
  },

  addButton: {
    width: 43,
    height: 43,

    borderRadius: 14,

    backgroundColor: '#1687F8',

    borderWidth: 1,
    borderColor:
      'rgba(115, 190, 255, 0.24)',

    alignItems: 'center',
    justifyContent: 'center',

    elevation: 4,

    shadowColor: '#1687F8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },

  /* SCROLL */

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  /* SECTION */

  section: {
    marginBottom: 27,
  },

  sectionHeader: {
    marginBottom: 12,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionHeaderLeft: {
    flex: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionIcon: {
    width: 34,
    height: 34,

    borderRadius: 11,

    borderWidth: 1,
    borderColor: '#1B3045',

    backgroundColor: '#0F1D2B',

    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionText: {
    flex: 1,
    marginLeft: 10,
  },

  sectionTitle: {
    color: '#EDF3FA',

    fontSize: 14,
    fontWeight: '900',
  },

  sectionSubtitle: {
    color: '#61758C',

    fontSize: 9.5,

    marginTop: 3,
  },

  countBadge: {
    minWidth: 27,
    height: 24,

    paddingHorizontal: 8,

    borderRadius: 8,

    borderWidth: 1,
    borderColor: '#1E3247',

    backgroundColor: '#0F1C2A',

    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: '#8296AB',

    fontSize: 10,
    fontWeight: '800',
  },

  cards: {
    gap: 11,
  },

  /* MINIMAL FLIGHT CARD */

  flightCard: {
    minHeight: 108,

    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 11,

    borderRadius: 17,

    borderWidth: 1,
    borderColor: '#1B2B3E',

    backgroundColor: '#0E1825',

    elevation: 2,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,
  },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  routeSide: {
    width: 88,
  },

  routeSideRight: {
    alignItems: 'flex-end',
  },

  airportCode: {
    color: '#F5F8FC',

    fontSize: 18,
    fontWeight: '900',
  },

  cityName: {
    color: '#71849A',

    fontSize: 9.5,

    marginTop: 3,
  },

  rightText: {
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

    backgroundColor: '#293C50',
  },

  planeCircle: {
    width: 31,
    height: 31,

    marginHorizontal: 5,

    borderRadius: 16,

    borderWidth: 1,
    borderColor: '#24445F',

    backgroundColor: '#122439',

    alignItems: 'center',
    justifyContent: 'center',
  },

  cardBottom: {
    minHeight: 31,

    marginTop: 11,
    paddingTop: 9,

    borderTopWidth: 1,
    borderTopColor: '#18283A',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statusBadge: {
    height: 23,

    paddingHorizontal: 8,

    borderRadius: 8,

    borderWidth: 1,

    flexDirection: 'row',
    alignItems: 'center',
  },

  statusText: {
    marginLeft: 4,

    fontSize: 8.5,
    fontWeight: '900',
  },

  chevron: {
    width: 27,
    height: 27,

    borderRadius: 8,

    backgroundColor: '#101E2D',

    alignItems: 'center',
    justifyContent: 'center',
  },

  /* LOADER */

  loaderBox: {
    height: 105,

    marginBottom: 20,

    borderRadius: 17,

    borderWidth: 1,
    borderColor: '#1B2B3D',

    backgroundColor: '#0E1825',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loaderText: {
    color: '#74889E',

    fontSize: 10.5,

    marginLeft: 10,
  },

  /* ERROR */

  errorCard: {
    padding: 14,

    borderRadius: 16,

    borderWidth: 1,
    borderColor:
      'rgba(255, 116, 125, 0.17)',

    backgroundColor:
      'rgba(255, 116, 125, 0.05)',

    flexDirection: 'row',
    alignItems: 'center',
  },

  errorIcon: {
    width: 40,
    height: 40,

    borderRadius: 12,

    backgroundColor:
      'rgba(255, 116, 125, 0.07)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  errorTextWrap: {
    flex: 1,

    marginLeft: 10,
    marginRight: 10,
  },

  errorTitle: {
    color: '#E9B0B4',

    fontSize: 11,
    fontWeight: '800',
  },

  errorMessage: {
    color: '#A37E83',

    fontSize: 9.5,

    marginTop: 3,
  },

  retryButton: {
    width: 35,
    height: 35,

    borderRadius: 11,

    backgroundColor: '#12253A',

    alignItems: 'center',
    justifyContent: 'center',
  },

  /* EMPTY */

  emptyCard: {
    minHeight: 330,

    paddingHorizontal: 28,

    borderRadius: 19,

    borderWidth: 1,
    borderColor: '#1B2B3D',

    backgroundColor: '#0E1825',

    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyIcon: {
    width: 65,
    height: 65,

    borderRadius: 21,

    borderWidth: 1,
    borderColor:
      'rgba(85, 169, 255, 0.15)',

    backgroundColor:
      'rgba(39, 142, 245, 0.07)',

    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: '#EEF4FB',

    fontSize: 16,
    fontWeight: '900',

    marginTop: 17,
  },

  emptyText: {
    maxWidth: 270,

    color: '#6C8096',

    fontSize: 10.5,
    lineHeight: 17,

    textAlign: 'center',

    marginTop: 7,
  },

  registerButton: {
    height: 46,

    marginTop: 20,

    paddingHorizontal: 16,

    borderRadius: 13,

    backgroundColor: '#1687F8',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  registerButtonText: {
    color: '#FFFFFF',

    fontSize: 11,
    fontWeight: '900',

    marginLeft: 7,
  },

  /* LOAD MORE */

  loadMoreButton: {
    height: 47,

    marginTop: -5,
    marginBottom: 20,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: '#213A53',

    backgroundColor: '#0F1E2E',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 7,
  },

  loadMoreText: {
    color: '#62B2FF',

    fontSize: 10.5,
    fontWeight: '800',
  },

  bottomSpace: {
    height: 30,
  },
});