import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect, useState} from 'react';

import {
  ActivityIndicator,
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

const PassengerSearch = ({navigation, route}) => {
  const selectedFrom = route?.params?.from || null;
  const selectedTo = route?.params?.to || null;

  const [flights, setFlights] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const getAirportCode = airport => {
    return airport?.iata || airport?.code || airport?.icao || '';
  };

  const getLocation = airport => {
    return [airport?.city, airport?.country]
      .filter(Boolean)
      .join(', ');
  };

  const formatTravelDate = value => {
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

  const getRequestForFlight = flightId => {
    if (!flightId) {
      return null;
    }

    return (
      sentRequests.find(
        request =>
          String(request?.flight_id) === String(flightId) &&
          ['pending', 'approved'].includes(
            String(request?.status || '').toLowerCase(),
          ),
      ) ||
      sentRequests.find(
        request =>
          String(request?.flight_id) === String(flightId),
      ) ||
      null
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Sent Requests
  |--------------------------------------------------------------------------
  */

  const getSentRequests = async token => {
    try {
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

      const requests =
        response?.data?.requests ||
        response?.data?.data?.requests ||
        [];

      setSentRequests(
        Array.isArray(requests) ? requests : [],
      );
    } catch (err) {
      console.log(
        'SENT REQUESTS ERROR:',
        err?.response?.data ||
          err?.message ||
          err,
      );

      setSentRequests([]);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Search Flights
  |--------------------------------------------------------------------------
  */

  const getFlights = async () => {
    if (!selectedFrom || !selectedTo) {
      setError(
        'Please select departure and destination.',
      );

      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const token =
        await AsyncStorage.getItem('usertoken');

      if (!token) {
        setError(
          'Your session has expired. Please login again.',
        );

        return;
      }

      const [flightResponse] =
        await Promise.all([
          axios.get(
            `${BASE_API_URI}/flight/search`,
            {
              params: {
                from:
                  selectedFrom?.city || '',

                from_code:
                  getAirportCode(selectedFrom),

                to:
                  selectedTo?.city || '',

                to_code:
                  getAirportCode(selectedTo),
              },

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          ),

          getSentRequests(token),
        ]);

      const results =
        flightResponse?.data?.flights ||
        flightResponse?.data?.data
          ?.flights ||
        [];

      setFlights(
        Array.isArray(results) ? results : [],
      );
    } catch (err) {
      console.log(
        'PASSENGER SEARCH ERROR:',
        err?.response?.data ||
          err?.message ||
          err,
      );

      setFlights([]);

      setError(
        err?.response?.data?.msg ||
          err?.response?.data?.message ||
          'Unable to search travelers right now.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFlights();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Refresh Request Status When Coming Back
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const unsubscribe =
      navigation.addListener(
        'focus',
        async () => {
          try {
            const token =
              await AsyncStorage.getItem(
                'usertoken',
              );

            if (token) {
              await getSentRequests(token);
            }
          } catch (err) {
            console.log(
              'REQUEST STATUS REFRESH ERROR:',
              err,
            );
          }
        },
      );

    return unsubscribe;
  }, [navigation]);

  /*
  |--------------------------------------------------------------------------
  | Open Traveler Profile
  |--------------------------------------------------------------------------
  */

  const openTravelerProfile = item => {
    const existingRequest =
      getRequestForFlight(item?._id);

    navigation.navigate(
      'CarrierProfile',
      {
        userId:
          item?.passenger?._id ||
          item?.user_id,

        data: item,

        existingRequest:
          existingRequest || null,
      },
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Send Request
  |--------------------------------------------------------------------------
  */

  const sendRequest = item => {
    navigation.navigate(
      'NewParcelRequest',
      {
        traveler: item,
        flight: item,
      },
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Request Status UI
  |--------------------------------------------------------------------------
  */

  const getRequestStatusData = request => {
    const status = String(
      request?.status || '',
    ).toLowerCase();

    if (status === 'approved') {
      return {
        text: 'Request Accepted',
        icon: 'checkmark-circle',
        color: '#22C55E',
        background:
          'rgba(34,197,94,0.08)',
        border:
          'rgba(34,197,94,0.28)',
      };
    }

    if (status === 'rejected') {
      return {
        text: 'Request Rejected',
        icon: 'close-circle',
        color: '#E87982',
        background:
          'rgba(232,121,130,0.08)',
        border:
          'rgba(232,121,130,0.28)',
      };
    }

    return {
      text: 'Request Sent • Pending',
      icon: 'time-outline',
      color: '#F59E0B',
      background:
        'rgba(245,158,11,0.08)',
      border:
        'rgba(245,158,11,0.28)',
    };
  };

  /*
  |--------------------------------------------------------------------------
  | Traveler Card
  |--------------------------------------------------------------------------
  */

  const renderTravelerCard = item => {
    const availableSpace = Math.max(
      0,
      Number(
        item?.available_space_in_kg,
      ) || 0,
    );

    const isAvailable =
      item?.accepting_requests === true &&
      availableSpace > 0;

    const travelerName =
      item?.passenger?.name ||
      'Traveler';

    const existingRequest =
      getRequestForFlight(item?._id);

    const requestStatus =
      existingRequest
        ? getRequestStatusData(
            existingRequest,
          )
        : null;

    return (
      <TouchableOpacity
        key={item?._id}
        activeOpacity={0.88}
        style={styles.card}
        onPress={() =>
          openTravelerProfile(item)
        }
      >
        {/* Traveler */}

        <View style={styles.cardHeader}>
          <View
            style={styles.travelerAvatar}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color="#55A9FF"
            />
          </View>

          <View
            style={styles.travelerInfo}
          >
            <Text
              numberOfLines={1}
              style={styles.cardName}
            >
              {travelerName}
            </Text>

            <Text
              style={styles.cardSubText}
            >
              Tap to view traveler
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,

              isAvailable
                ? styles.availableBadge
                : styles.fullBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,

                isAvailable
                  ? styles.availableText
                  : styles.fullText,
              ]}
            >
              {isAvailable
                ? 'AVAILABLE'
                : 'FULL'}
            </Text>
          </View>
        </View>

        {/* Route */}

        <View style={styles.routeRow}>
          <View style={styles.routeSide}>
            <Text
              numberOfLines={1}
              style={styles.routeCity}
            >
              {item
                ?.departure_airport_city ||
                item?.departure ||
                '-'}
            </Text>

            <Text
              numberOfLines={1}
              style={styles.routeCountry}
            >
              {item
                ?.departure_airport_country ||
                ''}
            </Text>

            <Text
              style={styles.routeTime}
            >
              {item?.departure_time ||
                '--'}
            </Text>
          </View>

          <View
            style={styles.routeMiddle}
          >
            <View
              style={styles.routeLine}
            />

            <View
              style={
                styles.airplaneCircle
              }
            >
              <Ionicons
                name="airplane"
                size={16}
                color="#55A9FF"
              />
            </View>

            <View
              style={styles.routeLine}
            />
          </View>

          <View
            style={[
              styles.routeSide,
              styles.routeRight,
            ]}
          >
            <Text
              numberOfLines={1}
              style={styles.routeCity}
            >
              {item
                ?.destination_airport_city ||
                item?.destination ||
                '-'}
            </Text>

            <Text
              numberOfLines={1}
              style={styles.routeCountry}
            >
              {item
                ?.destination_airport_country ||
                ''}
            </Text>

            <Text
              style={styles.routeTime}
            >
              {item?.arrival_time ||
                '--'}
            </Text>
          </View>
        </View>

        {/* Flight Information */}

        <View style={styles.flightInfo}>
          <View
            style={
              styles.flightInfoItem
            }
          >
            <Ionicons
              name="calendar-outline"
              size={15}
              color="#718399"
            />

            <Text
              style={
                styles.flightInfoText
              }
            >
              {formatTravelDate(
                item?.travel_date,
              )}
            </Text>
          </View>

          {item?.airline_name ? (
            <View
              style={[
                styles.flightInfoItem,
                styles.flightInfoRight,
              ]}
            >
              <Ionicons
                name="airplane-outline"
                size={15}
                color="#718399"
              />

              <Text
                numberOfLines={1}
                style={
                  styles.flightInfoText
                }
              >
                {item.airline_name}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Space */}

        <View style={styles.infoBox}>
          <View>
            <Text
              style={styles.infoLabel}
            >
              Available Space
            </Text>

            <Text
              style={styles.infoValue}
            >
              {availableSpace} kg
            </Text>
          </View>

          <View
            style={
              styles.tapProfileBox
            }
          >
            <Ionicons
              name="person-outline"
              size={14}
              color="#55A9FF"
            />

            <Text
              style={
                styles.tapProfileText
              }
            >
              Traveler Profile
            </Text>

            <Ionicons
              name="chevron-forward"
              size={13}
              color="#55A9FF"
            />
          </View>
        </View>

        {/* Request Status / Action */}

        {existingRequest ? (
          <View
            style={[
              styles.requestStatusButton,
              {
                backgroundColor:
                  requestStatus.background,

                borderColor:
                  requestStatus.border,
              },
            ]}
          >
            <Ionicons
              name={requestStatus.icon}
              size={18}
              color={
                requestStatus.color
              }
            />

            <Text
              style={[
                styles.requestStatusText,
                {
                  color:
                    requestStatus.color,
                },
              ]}
            >
              {requestStatus.text}
            </Text>
          </View>
        ) : isAvailable ? (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.requestButton}
            onPress={event => {
              event?.stopPropagation?.();
              sendRequest(item);
            }}
          >
            <Text
              style={
                styles.requestButtonText
              }
            >
              Send Request
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        ) : (
          <View
            style={styles.fullButton}
          >
            <Text
              style={
                styles.fullButtonText
              }
            >
              Not Accepting Requests
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B121C"
      />

      <BackBar title="Available Travelers" />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollPadding
        }
      >
        {/* Selected Route */}

        <View
          style={styles.searchSummary}
        >
          <View
            style={styles.summaryLocation}
          >
            <Text
              style={styles.summaryLabel}
            >
              FROM
            </Text>

            <Text
              numberOfLines={1}
              style={styles.summaryCity}
            >
              {getLocation(selectedFrom)}
            </Text>
          </View>

          <View
            style={styles.summaryArrow}
          >
            <Ionicons
              name="airplane"
              size={16}
              color="#55A9FF"
            />
          </View>

          <View
            style={[
              styles.summaryLocation,
              styles.summaryRight,
            ]}
          >
            <Text
              style={styles.summaryLabel}
            >
              TO
            </Text>

            <Text
              numberOfLines={1}
              style={styles.summaryCity}
            >
              {getLocation(selectedTo)}
            </Text>
          </View>
        </View>

        <View
          style={styles.sectionHeader}
        >
          <Text
            style={styles.sectionTitle}
          >
            Available Travelers
          </Text>

          {!loading &&
          !error &&
          flights.length > 0 ? (
            <Text
              style={styles.resultCount}
            >
              {flights.length}{' '}
              {flights.length === 1
                ? 'result'
                : 'results'}
            </Text>
          ) : null}
        </View>

        {loading ? (
          <View
            style={styles.stateContainer}
          >
            <ActivityIndicator
              size="large"
              color="#55A9FF"
            />

            <Text
              style={styles.stateText}
            >
              Searching available
              travelers...
            </Text>
          </View>
        ) : error ? (
          <View
            style={styles.stateContainer}
          >
            <Ionicons
              name="alert-circle-outline"
              size={35}
              color="#E87982"
            />

            <Text
              style={styles.stateText}
            >
              {error}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={getFlights}
              style={styles.retryButton}
            >
              <Text
                style={
                  styles.retryButtonText
                }
              >
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : flights.length === 0 ? (
          <View
            style={styles.stateContainer}
          >
            <Ionicons
              name="airplane-outline"
              size={40}
              color="#56677D"
            />

            <Text
              style={styles.emptyTitle}
            >
              No travelers found
            </Text>

            <Text
              style={styles.stateText}
            >
              No traveler is currently
              available on this route.
            </Text>
          </View>
        ) : (
          flights.map(
            renderTravelerCard,
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PassengerSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
  },

  scrollPadding: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 35,
  },

  searchSummary: {
    minHeight: 88,
    backgroundColor: '#101B2A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1D3046',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    elevation: 2,
  },

  summaryLocation: {
    flex: 1,
  },

  summaryRight: {
    alignItems: 'flex-end',
  },

  summaryLabel: {
    color: '#60738B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 5,
  },

  summaryCity: {
    color: '#EAF1F9',
    fontSize: 14,
    fontWeight: '700',
  },

  summaryArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor:
      'rgba(39,142,245,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(85,169,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 13,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  resultCount: {
    color: '#667A91',
    fontSize: 10,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#101B2A',
    borderRadius: 17,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1D3046',
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  travelerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor:
      'rgba(39,142,245,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  travelerInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 8,
  },

  cardName: {
    flexShrink: 1,
    color: '#F0F5FB',
    fontSize: 16,
    fontWeight: '700',
  },

  cardSubText: {
    color: '#718399',
    fontSize: 11,
    marginTop: 3,
  },

  statusBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  availableBadge: {
    borderColor:
      'rgba(34,197,94,0.35)',
    backgroundColor:
      'rgba(34,197,94,0.08)',
  },

  fullBadge: {
    borderColor:
      'rgba(232,121,130,0.35)',
    backgroundColor:
      'rgba(232,121,130,0.08)',
  },

  statusText: {
    fontSize: 8,
    fontWeight: '800',
  },

  availableText: {
    color: '#22C55E',
  },

  fullText: {
    color: '#E87982',
  },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1B2C40',
  },

  routeSide: {
    width: '31%',
  },

  routeRight: {
    alignItems: 'flex-end',
  },

  routeCity: {
    color: '#F1F6FC',
    fontWeight: '700',
    fontSize: 14,
  },

  routeCountry: {
    color: '#667A91',
    fontSize: 10,
    marginTop: 2,
  },

  routeTime: {
    color: '#55A9FF',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 5,
  },

  routeMiddle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  routeLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#29415C',
  },

  airplaneCircle: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: '#0C1725',
    borderWidth: 1,
    borderColor: '#23405F',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },

  flightInfo: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  flightInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  flightInfoRight: {
    justifyContent: 'flex-end',
  },

  flightInfoText: {
    flexShrink: 1,
    color: '#8497AD',
    fontSize: 11,
    marginLeft: 5,
  },

  infoBox: {
    marginTop: 13,
    borderRadius: 12,
    backgroundColor: '#0C1725',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  infoLabel: {
    color: '#687C93',
    fontSize: 10,
  },

  infoValue: {
    color: '#EAF2FB',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },

  tapProfileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(39,142,245,0.08)',
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  tapProfileText: {
    color: '#55A9FF',
    fontSize: 10,
    fontWeight: '700',
    marginHorizontal: 5,
  },

  requestButton: {
    minHeight: 47,
    marginTop: 14,
    backgroundColor: '#1E90FF',
    borderRadius: 11,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  requestStatusButton: {
    minHeight: 47,
    marginTop: 14,
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  requestStatusText: {
    fontSize: 12,
    fontWeight: '800',
  },

  fullButton: {
    minHeight: 47,
    marginTop: 14,
    backgroundColor: '#182536',
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullButtonText: {
    color: '#6E8197',
    fontSize: 12,
    fontWeight: '600',
  },

  stateContainer: {
    minHeight: 280,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  stateText: {
    color: '#718399',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 10,
  },

  emptyTitle: {
    color: '#DCE6F1',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 13,
  },

  retryButton: {
    marginTop: 15,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#17283C',
  },

  retryButtonText: {
    color: '#55A9FF',
    fontSize: 12,
    fontWeight: '700',
  },
});