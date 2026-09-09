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

const CarrierProfile = ({navigation, route}) => {
  const userId = route?.params?.userId;
  const flight = route?.params?.data || {};

  const [profile, setProfile] =
    useState(null);

  const [existingRequest, setExistingRequest] =
    useState(
      route?.params?.existingRequest ||
        null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');


  const formatDate = value => {
    if (!value) {
      return '--';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '--';
    }

    return date.toLocaleDateString(
      'en-US',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    );
  };

  const formatMemberSince = value => {
    if (!value) {
      return '--';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '--';
    }

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        year: 'numeric',
      },
    );
  };

  const getDepartureCity = () =>
    flight?.departure_airport_city ||
    flight?.departure ||
    '--';

  const getDestinationCity = () =>
    flight?.destination_airport_city ||
    flight?.destination ||
    '--';

  const getDepartureCountry = () =>
    flight?.departure_airport_country ||
    '';

  const getDestinationCountry = () =>
    flight?.destination_airport_country ||
    '';

  const getAllowedItemsLabel = () => {
    const value = String(
      flight?.allowed_items || 'both',
    )
      .trim()
      .toLowerCase();

    if (value === 'parcel') {
      return 'Parcel';
    }

    if (value === 'document') {
      return 'Document';
    }

    return 'Parcel & Document';
  };

  const availableSpace = Math.max(
    0,
    Number(
      flight?.available_space_in_kg,
    ) || 0,
  );

  const totalCapacity = Math.max(
    0,
    Number(
      flight?.capicity_in_kg,
    ) || 0,
  );

  const availablePercentage =
    totalCapacity > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (availableSpace /
              totalCapacity) *
              100,
          ),
        )
      : 0;

  const acceptingRequests =
    flight?.accepting_requests === true &&
    availableSpace > 0;


  const getExistingRequest =
    async token => {
      try {
        if (!flight?._id) {
          setExistingRequest(null);
          return;
        }

        const response =
          await axios.get(
            `${BASE_API_URI}/request`,
            {
              params: {
                type: 'sent',
                flight_id:
                  flight._id,
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
          response?.data?.data
            ?.requests ||
          [];

        const list =
          Array.isArray(requests)
            ? requests
            : [];

        const activeRequest =
          list.find(request =>
            [
              'pending',
              'approved',
            ].includes(
              String(
                request?.status || '',
              ).toLowerCase(),
            ),
          );

        setExistingRequest(
          activeRequest ||
            list[0] ||
            null,
        );
      } catch (err) {
        console.log(
          'EXISTING REQUEST ERROR:',
          err?.response?.data ||
            err?.message ||
            err,
        );
      }
    };


  const loadScreen = async () => {
    try {
      setLoading(true);
      setError('');

      if (!userId) {
        setError(
          'Traveler information is unavailable.',
        );
        return;
      }

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

      const [
        profileResponse,
      ] = await Promise.all([
        axios.get(
          `${BASE_API_URI}/passengers/${userId}/public-profile`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        ),

        getExistingRequest(token),
      ]);

      const passenger =
        profileResponse?.data
          ?.passenger ||
        profileResponse?.data?.data
          ?.passenger ||
        null;

      if (!passenger) {
        setError(
          'Traveler profile could not be loaded.',
        );
        return;
      }

      setProfile(passenger);
    } catch (err) {
      console.log(
        'TRAVELER PROFILE ERROR:',
        err?.response?.data ||
          err?.message ||
          err,
      );

      setError(
        err?.response?.data?.msg ||
          err?.response?.data?.message ||
          'Unable to load traveler profile.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScreen();
  }, [userId, flight?._id]);


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
              await getExistingRequest(
                token,
              );
            }
          } catch (err) {
            console.log(
              'PROFILE REQUEST REFRESH ERROR:',
              err,
            );
          }
        },
      );

    return unsubscribe;
  }, [navigation, flight?._id]);


  const handleSendRequest = () => {
    navigation.navigate(
      'NewParcelRequest',
      {
        traveler: flight,
        flight,
      },
    );
  };


  const requestStatus = String(
    existingRequest?.status || '',
  ).toLowerCase();

  const getRequestStatusData = () => {
    if (requestStatus === 'approved') {
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

    if (requestStatus === 'rejected') {
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

  const requestStatusData =
    existingRequest
      ? getRequestStatusData()
      : null;


  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0B121C"
        />

        <View
          style={styles.headerPadding}
        >
          <BackBar title="Traveler Profile" />
        </View>

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
            Loading traveler profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  if (error) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0B121C"
        />

        <View
          style={styles.headerPadding}
        >
          <BackBar title="Traveler Profile" />
        </View>

        <View
          style={styles.stateContainer}
        >
          <Ionicons
            name="alert-circle-outline"
            size={42}
            color="#E87982"
          />

          <Text
            style={styles.errorTitle}
          >
            Unable to load profile
          </Text>

          <Text
            style={styles.stateText}
          >
            {error}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.retryButton}
            onPress={loadScreen}
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
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B121C"
      />

      <View
        style={styles.headerPadding}
      >
        <BackBar title="Traveler Profile" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >

        <View
          style={styles.profileCard}
        >
          <View style={styles.avatar}>
            <Ionicons
              name="person-outline"
              size={36}
              color="#55A9FF"
            />

            {profile?.verified ===
            true ? (
              <View
                style={
                  styles.verifiedBadge
                }
              >
                <Ionicons
                  name="checkmark"
                  size={13}
                  color="#FFFFFF"
                />
              </View>
            ) : null}
          </View>

          <View style={styles.nameRow}>
            <Text
              style={styles.profileName}
            >
              {profile?.name ||
                'Traveler'}
            </Text>

            {profile?.verified ===
            true ? (
              <Ionicons
                name="checkmark-circle"
                size={19}
                color="#3B9EFF"
                style={
                  styles.nameVerifiedIcon
                }
              />
            ) : null}
          </View>

          <Text
            style={styles.memberText}
          >
            Member since{' '}
            {formatMemberSince(
              profile?.member_since,
            )}
          </Text>

          {profile?.verified ===
          true ? (
            <View
              style={styles.verifiedPill}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={15}
                color="#22C55E"
              />

              <Text
                style={
                  styles.verifiedPillText
                }
              >
                Verified Traveler
              </Text>
            </View>
          ) : null}
        </View>


        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View
              style={styles.statValueRow}
            >
              <Ionicons
                name="star"
                size={16}
                color="#EAB308"
              />

              <Text
                style={styles.statValue}
              >
                {Number(
                  profile?.rating || 0,
                ).toFixed(1)}
              </Text>
            </View>

            <Text
              style={styles.statLabel}
            >
              Rating
            </Text>
          </View>

          <View
            style={styles.statDivider}
          />

          <View style={styles.statItem}>
            <Text
              style={styles.statValue}
            >
              {profile?.rating_count ||
                0}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Reviews
            </Text>
          </View>

          <View
            style={styles.statDivider}
          />

          <View style={styles.statItem}>
            <Text
              style={styles.statValue}
            >
              {profile?.completed_trips ||
                0}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Trips
            </Text>
          </View>

          <View
            style={styles.statDivider}
          />

          <View style={styles.statItem}>
            <Text
              style={styles.statValue}
            >
              {profile
                ?.successful_deliveries ||
                0}
            </Text>

            <Text
              style={styles.statLabel}
            >
              Deliveries
            </Text>
          </View>
        </View>


        <View
          style={styles.sectionCard}
        >
          <View
            style={styles.sectionHeader}
          >
            <View>
              <Text
                style={
                  styles.sectionEyebrow
                }
              >
                SELECTED TRIP
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Flight Details
              </Text>
            </View>

            {flight?.airline_name ? (
              <View
                style={
                  styles.airlineBadge
                }
              >
                <Ionicons
                  name="airplane-outline"
                  size={13}
                  color="#55A9FF"
                />

                <Text
                  numberOfLines={1}
                  style={
                    styles.airlineText
                  }
                >
                  {flight.airline_name}
                </Text>
              </View>
            ) : null}
          </View>

          <View
            style={styles.routeContainer}
          >
            <View
              style={styles.routeSide}
            >
              <Text
                numberOfLines={1}
                style={styles.routeCity}
              >
                {getDepartureCity()}
              </Text>

              {getDepartureCountry() ? (
                <Text
                  numberOfLines={1}
                  style={
                    styles.routeCountry
                  }
                >
                  {getDepartureCountry()}
                </Text>
              ) : null}

              <Text
                style={styles.routeTime}
              >
                {flight?.departure_time ||
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
                  styles.planeCircle
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
                {getDestinationCity()}
              </Text>

              {getDestinationCountry() ? (
                <Text
                  numberOfLines={1}
                  style={
                    styles.routeCountry
                  }
                >
                  {getDestinationCountry()}
                </Text>
              ) : null}

              <Text
                style={styles.routeTime}
              >
                {flight?.arrival_time ||
                  '--'}
              </Text>
            </View>
          </View>

          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color="#718399"
            />

            <Text
              style={styles.dateText}
            >
              {formatDate(
                flight?.travel_date,
              )}
            </Text>
          </View>
        </View>


        <View
          style={styles.sectionCard}
        >
          <View
            style={styles.sectionHeader}
          >
            <View>
              <Text
                style={
                  styles.sectionEyebrow
                }
              >
                AVAILABILITY
              </Text>

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Parcel Space
              </Text>
            </View>

            <View
              style={[
                styles.availabilityBadge,

                acceptingRequests
                  ? styles.availableBadge
                  : styles.fullBadge,
              ]}
            >
              <Text
                style={[
                  styles.availabilityBadgeText,

                  acceptingRequests
                    ? styles.availableText
                    : styles.fullText,
                ]}
              >
                {acceptingRequests
                  ? 'AVAILABLE'
                  : 'FULL'}
              </Text>
            </View>
          </View>

          <View style={styles.spaceRow}>
            <View>
              <Text
                style={styles.spaceLabel}
              >
                Available Space
              </Text>

              <Text
                style={styles.spaceValue}
              >
                {availableSpace} kg
              </Text>
            </View>

            {totalCapacity > 0 ? (
              <View
                style={
                  styles.capacityRight
                }
              >
                <Text
                  style={
                    styles.capacityLabel
                  }
                >
                  Total Capacity
                </Text>

                <Text
                  style={
                    styles.capacityValue
                  }
                >
                  {totalCapacity} kg
                </Text>
              </View>
            ) : null}
          </View>

          {totalCapacity > 0 ? (
            <View
              style={
                styles.progressTrack
              }
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${availablePercentage}%`,
                  },
                ]}
              />
            </View>
          ) : null}

          <View
            style={styles.allowedBox}
          >
            <View
              style={styles.allowedIcon}
            >
              <Ionicons
                name="cube-outline"
                size={18}
                color="#55A9FF"
              />
            </View>

            <View
              style={
                styles.allowedContent
              }
            >
              <Text
                style={styles.allowedLabel}
              >
                Accepting
              </Text>

              <Text
                style={styles.allowedValue}
              >
                {getAllowedItemsLabel()}
              </Text>
            </View>
          </View>
        </View>


        {profile?.verified === true ? (
          <View
            style={styles.safetyCard}
          >
            <View
              style={styles.safetyIcon}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={21}
                color="#22C55E"
              />
            </View>

            <View
              style={
                styles.safetyContent
              }
            >
              <Text
                style={styles.safetyTitle}
              >
                Verified Traveler
              </Text>

              <Text
                style={styles.safetyText}
              >
                This traveler has been
                verified by Ezan Express.
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>


      <View
        style={styles.stickyFooter}
      >
        {existingRequest ? (
          <View
            style={[
              styles.requestStatusButton,

              {
                backgroundColor:
                  requestStatusData
                    .background,

                borderColor:
                  requestStatusData.border,
              },
            ]}
          >
            <Ionicons
              name={
                requestStatusData.icon
              }
              size={20}
              color={
                requestStatusData.color
              }
            />

            <Text
              style={[
                styles.requestStatusText,
                {
                  color:
                    requestStatusData.color,
                },
              ]}
            >
              {requestStatusData.text}
            </Text>
          </View>
        ) : acceptingRequests ? (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.requestButton}
            onPress={handleSendRequest}
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
              size={19}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        ) : (
          <View
            style={styles.disabledButton}
          >
            <Text
              style={
                styles.disabledButtonText
              }
            >
              Not Accepting Requests
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CarrierProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
  },

  headerPadding: {
    paddingHorizontal: 15,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 115,
  },

  profileCard: {
    backgroundColor: '#101B2A',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1D3046',
    paddingVertical: 26,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 3,
  },

  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#0C1725',
    borderWidth: 1,
    borderColor: '#23405F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 13,
  },

  verifiedBadge: {
    position: 'absolute',
    right: -1,
    bottom: 3,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: '#1E90FF',
    borderWidth: 3,
    borderColor: '#101B2A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileName: {
    color: '#F3F7FC',
    fontSize: 23,
    fontWeight: '800',
  },

  nameVerifiedIcon: {
    marginLeft: 5,
  },

  memberText: {
    color: '#718399',
    fontSize: 12,
    marginTop: 5,
  },

  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(34,197,94,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(34,197,94,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },

  verifiedPillText: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 5,
  },

  statsCard: {
    minHeight: 82,
    backgroundColor: '#101B2A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1D3046',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 5,
    elevation: 2,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statValue: {
    color: '#EDF4FB',
    fontSize: 17,
    fontWeight: '800',
  },

  statLabel: {
    color: '#667A91',
    fontSize: 10,
    marginTop: 5,
    textAlign: 'center',
  },

  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#1D3046',
  },

  sectionCard: {
    backgroundColor: '#101B2A',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#1D3046',
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  sectionEyebrow: {
    color: '#52677F',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 4,
  },

  sectionTitle: {
    color: '#F0F5FB',
    fontSize: 17,
    fontWeight: '800',
  },

  airlineBadge: {
    maxWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C1725',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#1D3046',
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  airlineText: {
    flexShrink: 1,
    color: '#91A5BB',
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 5,
  },

  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  routeSide: {
    width: '31%',
  },

  routeRight: {
    alignItems: 'flex-end',
  },

  routeCity: {
    color: '#F1F6FC',
    fontSize: 15,
    fontWeight: '800',
  },

  routeCountry: {
    color: '#667A91',
    fontSize: 10,
    marginTop: 3,
  },

  routeTime: {
    color: '#55A9FF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 7,
  },

  routeMiddle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  routeLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#29415C',
  },

  planeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0C1725',
    borderWidth: 1,
    borderColor: '#23405F',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: '#1B2C40',
  },

  dateText: {
    color: '#8497AD',
    fontSize: 10,
    marginLeft: 7,
  },

  availabilityBadge: {
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
  },

  availableBadge: {
    backgroundColor:
      'rgba(34,197,94,0.08)',
    borderColor:
      'rgba(34,197,94,0.28)',
  },

  fullBadge: {
    backgroundColor:
      'rgba(232,121,130,0.08)',
    borderColor:
      'rgba(232,121,130,0.28)',
  },

  availabilityBadgeText: {
    fontSize: 8,
    fontWeight: '800',
  },

  availableText: {
    color: '#22C55E',
  },

  fullText: {
    color: '#E87982',
  },

  spaceRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'flex-end',
  },

  spaceLabel: {
    color: '#687C93',
    fontSize: 11,
  },

  spaceValue: {
    color: '#F0F5FB',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 3,
  },

  capacityRight: {
    alignItems: 'flex-end',
  },

  capacityLabel: {
    color: '#687C93',
    fontSize: 11,
  },

  capacityValue: {
    color: '#91A5BB',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 3,
  },

  progressTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: '#1A2A3D',
    overflow: 'hidden',
    marginTop: 14,
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#1E90FF',
  },

  allowedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C1725',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },

  allowedIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor:
      'rgba(39,142,245,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  allowedContent: {
    marginLeft: 10,
  },

  allowedLabel: {
    color: '#687C93',
    fontSize: 11,
  },

  allowedValue: {
    color: '#DCE7F3',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },

  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(34,197,94,0.05)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor:
      'rgba(34,197,94,0.18)',
    padding: 14,
    marginBottom: 10,
  },

  safetyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor:
      'rgba(34,197,94,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  safetyContent: {
    flex: 1,
    marginLeft: 11,
  },

  safetyTitle: {
    color: '#DDF8E7',
    fontSize: 12,
    fontWeight: '700',
  },

  safetyText: {
    color: '#6F8E7B',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  stickyFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0B121C',
    borderTopWidth: 1,
    borderTopColor: '#18283A',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },

  requestButton: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: '#1E90FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  requestStatusButton: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  requestStatusText: {
    fontSize: 13,
    fontWeight: '800',
  },

  disabledButton: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: '#182536',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButtonText: {
    color: '#6E8197',
    fontSize: 12,
    fontWeight: '700',
  },

  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 35,
  },

  stateText: {
    color: '#718399',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 10,
  },

  errorTitle: {
    color: '#E4ECF5',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 13,
  },

  retryButton: {
    marginTop: 17,
    paddingHorizontal: 20,
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
