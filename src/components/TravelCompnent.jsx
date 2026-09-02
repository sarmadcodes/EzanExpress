import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import moment from 'moment';

import { GEOAPIFY_API_KEY } from '../constant/API';

const TravelDashboard = ({ data, navigation }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [departureCoords, setDepartureCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState(false);

  const currentFlight = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const activeFlight = data.find(flight => {
      const verificationStatus = String(
        flight?.verification_status || '',
      )
        .trim()
        .toLowerCase();

      const tripStatus = String(
        flight?.trip_status || '',
      )
        .trim()
        .toLowerCase();

      return (
        verificationStatus === 'approved' &&
        tripStatus === 'active'
      );
    });

    if (activeFlight) {
      return activeFlight;
    }

    const upcomingFlights = data
      .filter(flight => {
        const verificationStatus = String(
          flight?.verification_status || '',
        )
          .trim()
          .toLowerCase();

        const tripStatus = String(
          flight?.trip_status || '',
        )
          .trim()
          .toLowerCase();

        const isUpcoming =
          flight?.travel_date &&
          moment(flight.travel_date).isSameOrAfter(
            moment(),
            'day',
          );

        const isFinished = [
          'completed',
          'cancelled',
          'expired',
        ].includes(tripStatus);

        return (
          verificationStatus === 'approved' &&
          !isFinished &&
          isUpcoming
        );
      })
      .sort(
        (a, b) =>
          moment(a.travel_date).valueOf() -
          moment(b.travel_date).valueOf(),
      );

    return upcomingFlights[0] || null;
  }, [data]);

  const departureCity =
    currentFlight?.departure_airport_city ||
    currentFlight?.departure ||
    '';

  const departureCountry =
    currentFlight?.departure_airport_country || '';

  const destinationCity =
    currentFlight?.destination_airport_city ||
    currentFlight?.destination ||
    '';

  const destinationCountry =
    currentFlight?.destination_airport_country || '';

  const departureSearch = useMemo(() => {
    if (!currentFlight) {
      return '';
    }

    return [
      currentFlight?.departure_airport_code,
      currentFlight?.departure,
      currentFlight?.departure_airport_city,
      currentFlight?.departure_airport_country,
    ]
      .filter(Boolean)
      .join(', ');
  }, [currentFlight]);

  const destinationSearch = useMemo(() => {
    if (!currentFlight) {
      return '';
    }

    return [
      currentFlight?.destination_airport_code,
      currentFlight?.destination,
      currentFlight?.destination_airport_city,
      currentFlight?.destination_airport_country,
    ]
      .filter(Boolean)
      .join(', ');
  }, [currentFlight]);

  const getCoordinates = async searchText => {
    if (!searchText || !GEOAPIFY_API_KEY) {
      return null;
    }

    const url =
      'https://api.geoapify.com/v1/geocode/search' +
      `?text=${encodeURIComponent(searchText)}` +
      '&limit=1' +
      `&apiKey=${encodeURIComponent(GEOAPIFY_API_KEY)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Geocoding failed: ${response.status}`,
      );
    }

    const result = await response.json();
    const location = result?.features?.[0]?.properties;

    if (
      location?.lat === undefined ||
      location?.lon === undefined
    ) {
      return null;
    }

    return {
      lat: Number(location.lat),
      lon: Number(location.lon),
    };
  };

  useEffect(() => {
    let mounted = true;

    const loadRoute = async () => {
      if (!currentFlight) {
        setDepartureCoords(null);
        setDestinationCoords(null);
        setMapLoading(false);
        return;
      }

      try {
        setMapLoading(true);
        setMapError(false);

        const [from, to] = await Promise.all([
          getCoordinates(departureSearch),
          getCoordinates(destinationSearch),
        ]);

        if (!mounted) {
          return;
        }

        if (!from || !to) {
          setMapError(true);
          return;
        }

        setDepartureCoords(from);
        setDestinationCoords(to);
      } catch (error) {
        console.log(
          'GEOAPIFY ERROR:',
          error?.message || error,
        );

        if (mounted) {
          setMapError(true);
          setDepartureCoords(null);
          setDestinationCoords(null);
        }
      } finally {
        if (mounted) {
          setMapLoading(false);
        }
      }
    };

    loadRoute();

    return () => {
      mounted = false;
    };
  }, [
    currentFlight?._id,
    departureSearch,
    destinationSearch,
  ]);

  const mapUrl = useMemo(() => {
    if (
      !departureCoords ||
      !destinationCoords ||
      !GEOAPIFY_API_KEY
    ) {
      return null;
    }

    const fromLon = departureCoords.lon;
    const fromLat = departureCoords.lat;

    const toLon = destinationCoords.lon;
    const toLat = destinationCoords.lat;

    let adjustedFromLon = fromLon;
    let adjustedToLon = toLon;

    if (
      Math.abs(adjustedToLon - adjustedFromLon) >
      180
    ) {
      if (adjustedFromLon < adjustedToLon) {
        adjustedFromLon += 360;
      } else {
        adjustedToLon += 360;
      }
    }

    let centerLon =
      (adjustedFromLon + adjustedToLon) / 2;

    if (centerLon > 180) {
      centerLon -= 360;
    }

    if (centerLon < -180) {
      centerLon += 360;
    }

    const centerLat = (fromLat + toLat) / 2;

    const lonDifference = Math.abs(
      adjustedToLon - adjustedFromLon,
    );

    const latDifference = Math.abs(
      toLat - fromLat,
    );

    const maxDifference = Math.max(
      lonDifference,
      latDifference,
    );

    let zoom = 2;

    if (maxDifference < 10) {
      zoom = 4.5;
    } else if (maxDifference < 20) {
      zoom = 3.8;
    } else if (maxDifference < 35) {
      zoom = 3.1;
    } else if (maxDifference < 55) {
      zoom = 2.6;
    } else if (maxDifference < 80) {
      zoom = 2.15;
    } else if (maxDifference < 110) {
      zoom = 1.7;
    } else {
      zoom = 1.25;
    }

    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            linecolor: '#1E88E5',
            linewidth: 4,
            lineopacity: 0.95,
            linestyle: 'dashed',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [fromLon, fromLat],
              [toLon, toLat],
            ],
          },
        },
        {
          type: 'Feature',
          properties: {
            linecolor: '#1E88E5',
            linewidth: 2,
            fillcolor: '#1E88E5',
            fillopacity: 1,
          },
          geometry: {
            type: 'Point',
            coordinates: [fromLon, fromLat],
          },
        },
        {
          type: 'Feature',
          properties: {
            linecolor: '#1E88E5',
            linewidth: 2,
            fillcolor: '#1E88E5',
            fillopacity: 1,
          },
          geometry: {
            type: 'Point',
            coordinates: [toLon, toLat],
          },
        },
      ],
    };

    const encodedGeoJson = encodeURIComponent(
      JSON.stringify(geojson),
    );

    return (
      'https://maps.geoapify.com/v1/staticmap' +
      '?style=osm-bright-grey' +
      '&width=900' +
      '&height=500' +
      '&format=png' +
      `&center=lonlat:${centerLon},${centerLat}` +
      `&zoom=${zoom}` +
      `&geojson=${encodedGeoJson}` +
      `&apiKey=${encodeURIComponent(
        GEOAPIFY_API_KEY,
      )}`
    );
  }, [
    departureCoords,
    destinationCoords,
  ]);

  const tripStatus = String(
    currentFlight?.trip_status || '',
  )
    .trim()
    .toLowerCase();

  const statusText =
    tripStatus === 'active'
      ? 'ACTIVE'
      : 'UPCOMING';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusCard}>
        <View>
          <Text style={styles.statusTitle}>
            Travel Status
          </Text>

          <Text style={styles.statusSubtitle}>
            {isEnabled
              ? 'You are visible to senders'
              : 'You are hidden from senders'}
          </Text>
        </View>

        <Switch
          trackColor={{
            false: '#2D3F50',
            true: '#1E88E5',
          }}
          thumbColor="#FFFFFF"
          onValueChange={() =>
            setIsEnabled(previous => !previous)
          }
          value={isEnabled}
        />
      </View>

      <View style={styles.infoGrid}>
  <View style={styles.infoBox}>
    <View style={styles.iconCircle}>
      <Ionicons
        name="scale-outline"
        size={20}
        color="#1E88E5"
      />
    </View>

    <Text style={styles.infoValue}>
      {currentFlight
        ? `${currentFlight.available_space_in_kg ?? 0} kg`
        : '--'}
    </Text>

    <Text style={styles.infoLabel}>
      Available Space
    </Text>
  </View>

  <View style={styles.infoBox}>
    <View style={styles.iconCircle}>
      <Ionicons
        name="cube-outline"
        size={20}
        color="#1E88E5"
      />
    </View>

    <Text style={styles.infoValue}>
      Space Open
    </Text>

    <Text style={styles.infoLabel}>
      Parcel / Document
    </Text>
  </View>
</View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          My Trip
        </Text>

        {currentFlight ? (
          <Pressable
            onPress={() =>
              navigation.navigate('TravelerFlightDetails', {
                flight: currentFlight,
              })
            }
          >
            <Text style={styles.viewDetails}>
              View Details
            </Text>
          </Pressable>
        ) : null}
      </View>

      {!currentFlight ? (
        <View style={styles.noFlightCard}>
          <Ionicons
            name="airplane-outline"
            size={27}
            color="#7AA2C5"
          />

          <Text style={styles.noFlightTitle}>
            No active trip
          </Text>

          <Text style={styles.noFlightText}>
            Your approved flight will appear here.
          </Text>
        </View>
      ) : (
        <View style={styles.flightCard}>
          {mapLoading ? (
            <View style={styles.mapLoading}>
              <ActivityIndicator
                color="#1E88E5"
              />
            </View>
          ) : mapUrl && !mapError ? (
            <Image
              source={{ uri: mapUrl }}
              style={styles.mapImage}
              resizeMode="cover"
              onError={event => {
                console.log(
                  'MAP IMAGE ERROR:',
                  event?.nativeEvent?.error,
                );
                setMapError(true);
              }}
            />
          ) : (
            <View style={styles.mapFallback}>
              <Ionicons
                name="map-outline"
                size={32}
                color="#39536B"
              />
            </View>
          )}

          <View
            pointerEvents="none"
            style={styles.mapTint}
          />

          <View style={styles.topRow}>
            <View style={styles.statusBadge}>
              <View
                style={[
                  styles.statusDot,
                  tripStatus !== 'active' &&
                    styles.upcomingDot,
                ]}
              />

              <Text style={styles.statusBadgeText}>
                {statusText}
              </Text>
            </View>

            <View style={styles.airlineBadge}>
              <Ionicons
                name="airplane-outline"
                size={13}
                color="#FFFFFF"
              />

              <Text
                style={styles.airlineText}
                numberOfLines={1}
              >
                {currentFlight?.airline_name ||
                  'Flight'}
              </Text>
            </View>
          </View>

          <View style={styles.routeContainer}>
            <View style={styles.locationBox}>
              <Text
                style={styles.cityName}
                numberOfLines={1}
              >
                {departureCity}
              </Text>

              <Text
                style={styles.countryName}
                numberOfLines={1}
              >
                {departureCountry}
              </Text>

              <Text style={styles.timeText}>
                {currentFlight?.departure_time ||
                  '--'}
              </Text>
            </View>

            <View style={styles.routeMiddle}>
              <View style={styles.planeBadge}>
                <Ionicons
                  name="airplane"
                  size={14}
                  color="#FFFFFF"
                />
              </View>
            </View>

            <View
              style={[
                styles.locationBox,
                styles.destinationBox,
              ]}
            >
              <Text
                style={styles.cityName}
                numberOfLines={1}
              >
                {destinationCity}
              </Text>

              <Text
                style={styles.countryName}
                numberOfLines={1}
              >
                {destinationCountry}
              </Text>

              <Text style={styles.timeText}>
                {currentFlight?.arrival_time ||
                  '--'}
              </Text>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <View style={styles.bottomItem}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color="#D9E6EF"
              />

              <Text style={styles.bottomText}>
                {currentFlight?.travel_date
                  ? moment(
                      currentFlight.travel_date,
                    ).format('DD MMM YYYY')
                  : '--'}
              </Text>
            </View>

            <View style={styles.bottomItem}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color="#5BE0A4"
              />

              <Text style={styles.bottomText}>
                Verified
              </Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D1520',
    padding: 16,
  },

  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#16222F',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#233242',
    marginBottom: 16,
  },

  statusTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  statusSubtitle: {
    color: '#7AA2C5',
    fontSize: 13,
    marginTop: 4,
  },

  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  infoBox: {
    flex: 1,
    backgroundColor: '#16222F',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#233242',
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0D2D4F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  infoValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },

  infoLabel: {
    color: '#7AA2C5',
    fontSize: 12,
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  viewDetails: {
    color: '#1E88E5',
    fontSize: 13,
    fontWeight: '600',
  },

  flightCard: {
    height: 225,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#101B27',
    borderWidth: 1,
    borderColor: '#233242',
    position: 'relative',
  },

  mapImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#101B27',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#101B27',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3,10,18,0.18)',
  },

  topRow: {
    position: 'absolute',
    top: 13,
    left: 13,
    right: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(7,17,27,0.86)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#51D49A',
    marginRight: 6,
  },

  upcomingDot: {
    backgroundColor: '#1E88E5',
  },

  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  airlineBadge: {
    maxWidth: '55%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(7,17,27,0.86)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  airlineText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  routeContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    top: 76,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationBox: {
    width: '32%',
  },

  destinationBox: {
    alignItems: 'flex-end',
  },

  cityName: {
    color: '#1E88E5',
    fontSize: 18,
    fontWeight: '800',
   
  },

  countryName: {
    color: '#1E88E5',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
   
  },

  timeText: {
    color: '#1E88E5',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 6,
    
  },

  routeMiddle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  planeBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(30,136,229,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomRow: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  bottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(7,17,27,0.82)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },

  bottomText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  noFlightCard: {
    height: 145,
    backgroundColor: '#16222F',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#233242',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noFlightTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },

  noFlightText: {
    color: '#7AA2C5',
    fontSize: 11,
    marginTop: 4,
  },
});

export default TravelDashboard;