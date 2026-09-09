import Ionicons from '@react-native-vector-icons/ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Animated,
  Image,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { BASE_API_URI } from '../constant/API';
import { LOADING } from '../context/Loading';
import { USER } from '../context/User';

import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

const MIN_CAPACITY = 1;
const MAX_CAPACITY = 40;

const FlightDetailScreen = ({ navigation, route }) => {
  const { loading, setLoading } = useContext(LOADING);

  const { setUserData } = useContext(USER);

  const showBackButton = route?.params?.from === 'my-trips';

  const [departure, setDeparture] = useState('');

  const [destination, setDestination] = useState('');

  const [departureAirports, setDepartureAirports] = useState([]);

  const [destinationAirports, setDestinationAirports] = useState([]);

  const [departureLoading, setDepartureLoading] = useState(false);

  const [destinationLoading, setDestinationLoading] = useState(false);

  const [showDepartureSuggestions, setShowDepartureSuggestions] =
    useState(false);

  const [showDestinationSuggestions, setShowDestinationSuggestions] =
    useState(false);

  const [selectedDepartureAirport, setSelectedDepartureAirport] =
    useState(null);

  const [selectedDestinationAirport, setSelectedDestinationAirport] =
    useState(null);

  const [airline, setAirline] = useState('');

  const [travelDate, setTravelDate] = useState(null);

  const [departureTime, setDepartureTime] = useState(null);

  const [arrivalTime, setArrivalTime] = useState(null);

  const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);

  const [showArrivalTimePicker, setShowArrivalTimePicker] = useState(false);

  const [capacity, setCapacity] = useState(15);

  const [sliderWidth, setSliderWidth] = useState(0);

  const sliderWidthRef = useRef(0);
  const capacityRef = useRef(15);
  const panStartPosition = useRef(0);

  const sliderPosition = useRef(new Animated.Value(0)).current;

  const [ticket, setTicket] = useState(null);

  const [createdFlightId, setCreatedFlightId] = useState(null);

  const [errors, setErrors] = useState({});

  const today = useMemo(() => {
    const value = new Date();

    value.setHours(0, 0, 0, 0);

    return value;
  }, []);

  const maximumTravelDate = useMemo(() => {
    const date = new Date();

    date.setFullYear(date.getFullYear() + 5);

    return date;
  }, []);

  const searchAirports = async (query, type) => {
    const value = query.trim();

    if (value.length < 2) {
      if (type === 'departure') {
        setDepartureAirports([]);
        setDepartureLoading(false);
      } else {
        setDestinationAirports([]);
        setDestinationLoading(false);
      }

      return;
    }

    try {
      if (type === 'departure') {
        setDepartureLoading(true);
      } else {
        setDestinationLoading(true);
      }

      const token = await AsyncStorage.getItem('usertoken');

      if (!token) {
        return;
      }

      const response = await axios.get(`${BASE_API_URI}/airports/search`, {
        params: {
          q: value,
        },

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const airports =
        response?.data?.airports || response?.data?.data?.airports || [];

      if (type === 'departure') {
        setDepartureAirports(airports);
      } else {
        setDestinationAirports(airports);
      }
    } catch (error) {
      console.log(
        'AIRPORT SEARCH ERROR:',
        error?.response?.data || error?.message || error,
      );

      if (type === 'departure') {
        setDepartureAirports([]);
      } else {
        setDestinationAirports([]);
      }
    } finally {
      if (type === 'departure') {
        setDepartureLoading(false);
      } else {
        setDestinationLoading(false);
      }
    }
  };

  useEffect(() => {
    if (
      selectedDepartureAirport &&
      departure === selectedDepartureAirport.displayValue
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      if (departure.trim().length >= 2) {
        searchAirports(departure, 'departure');

        setShowDepartureSuggestions(true);
      } else {
        setDepartureAirports([]);
        setShowDepartureSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [departure]);

  useEffect(() => {
    if (
      selectedDestinationAirport &&
      destination === selectedDestinationAirport.displayValue
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      if (destination.trim().length >= 2) {
        searchAirports(destination, 'destination');

        setShowDestinationSuggestions(true);
      } else {
        setDestinationAirports([]);
        setShowDestinationSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [destination]);

  const getAirportCode = airport => {
    return airport?.iata || airport?.code || airport?.icao || '';
  };

  const getAirportDisplayValue = airport => {
    const name = airport?.name || '';
    const city = airport?.city || '';
    const country = airport?.country || '';

    return [name, city, country].filter(Boolean).join(', ');
  };

  const selectDepartureAirport = airport => {
    const displayValue = getAirportDisplayValue(airport);

    setDeparture(displayValue);

    setSelectedDepartureAirport({
      ...airport,
      displayValue,
    });

    setDepartureAirports([]);
    setShowDepartureSuggestions(false);

    setErrors(previous => ({
      ...previous,
      departure: '',
    }));
  };

  const selectDestinationAirport = airport => {
    const displayValue = getAirportDisplayValue(airport);

    setDestination(displayValue);

    setSelectedDestinationAirport({
      ...airport,
      displayValue,
    });

    setDestinationAirports([]);
    setShowDestinationSuggestions(false);

    setErrors(previous => ({
      ...previous,
      destination: '',
    }));
  };

  const getBackendError = error => {
    const data = error?.response?.data;

    return (
      data?.msg ||
      data?.message ||
      data?.error ||
      'Something went wrong. Please try again.'
    );
  };

  const showErrorToast = message => {
    Toast.show({
      type: 'error',
      text1: message,
    });
  };

  const formatTime = value => {
    if (!value) {
      return '';
    }

    return value.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDateForApi = value => {
    if (!value) {
      return '';
    }

    const year = value.getFullYear();

    const month = String(value.getMonth() + 1).padStart(2, '0');

    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };


  const getPositionFromCapacity = value => {
    if (!sliderWidthRef.current) {
      return 0;
    }

    const percentage = (value - MIN_CAPACITY) / (MAX_CAPACITY - MIN_CAPACITY);

    return percentage * sliderWidthRef.current;
  };

  const getCapacityFromPosition = position => {
    if (!sliderWidthRef.current) {
      return MIN_CAPACITY;
    }

    const safePosition = Math.max(
      0,
      Math.min(sliderWidthRef.current, position),
    );

    const percentage = safePosition / sliderWidthRef.current;

    return Math.round(
      MIN_CAPACITY + percentage * (MAX_CAPACITY - MIN_CAPACITY),
    );
  };

  const setCapacityValue = (nextValue, animate = true) => {
    const normalized = Math.max(
      MIN_CAPACITY,
      Math.min(MAX_CAPACITY, Math.round(nextValue)),
    );

    capacityRef.current = normalized;

    setCapacity(normalized);

    if (!sliderWidthRef.current) {
      return;
    }

    const position = getPositionFromCapacity(normalized);

    if (animate) {
      Animated.timing(sliderPosition, {
        toValue: position,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      sliderPosition.setValue(position);
    }
  };

  const handleSliderLayout = event => {
    const width = event.nativeEvent.layout.width;

    sliderWidthRef.current = width;

    setSliderWidth(width);

    const percentage =
      (capacityRef.current - MIN_CAPACITY) / (MAX_CAPACITY - MIN_CAPACITY);

    sliderPosition.setValue(percentage * width);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: event => {
        const x = event.nativeEvent.locationX;

        const safeX = Math.max(0, Math.min(sliderWidthRef.current, x));

        panStartPosition.current = safeX;

        sliderPosition.setValue(safeX);

        const nextCapacity = getCapacityFromPosition(safeX);

        capacityRef.current = nextCapacity;

        setCapacity(nextCapacity);
      },

      onPanResponderMove: (_, gestureState) => {
        const nextPosition = panStartPosition.current + gestureState.dx;

        const safePosition = Math.max(
          0,
          Math.min(sliderWidthRef.current, nextPosition),
        );

        sliderPosition.setValue(safePosition);

        const nextCapacity = getCapacityFromPosition(safePosition);

        if (nextCapacity !== capacityRef.current) {
          capacityRef.current = nextCapacity;

          setCapacity(nextCapacity);
        }
      },

      onPanResponderRelease: () => {
        setCapacityValue(capacityRef.current, true);
      },

      onPanResponderTerminate: () => {
        setCapacityValue(capacityRef.current, true);
      },
    }),
  ).current;


  const selectTicket = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          showErrorToast(
            response.errorMessage || 'Unable to select flight ticket.',
          );

          return;
        }

        const asset = response?.assets?.[0];

        if (!asset?.uri) {
          showErrorToast('Unable to select flight ticket.');

          return;
        }

        if (asset?.fileSize && asset.fileSize > 10 * 1024 * 1024) {
          showErrorToast('Flight ticket image must not exceed 10 MB.');

          return;
        }

        if (
          asset?.type &&
          !['image/jpeg', 'image/jpg', 'image/png'].includes(asset.type)
        ) {
          showErrorToast('Only JPG and PNG flight ticket images are allowed.');

          return;
        }

        setTicket({
          uri: asset.uri,

          type: asset.type || 'image/jpeg',

          fileName: asset.fileName || `flight-ticket-${Date.now()}.jpg`,

          fileSize: asset.fileSize || 0,
        });

        setErrors(previous => ({
          ...previous,
          ticket: '',
        }));
      },
    );
  };


  const validateForm = () => {
    const nextErrors = {};

    if (!departure.trim()) {
      nextErrors.departure = 'Departure is required.';
    } else if (!selectedDepartureAirport) {
      nextErrors.departure =
        'Please select a departure airport from the suggestions.';
    }

    if (!destination.trim()) {
      nextErrors.destination = 'Destination is required.';
    } else if (!selectedDestinationAirport) {
      nextErrors.destination =
        'Please select a destination airport from the suggestions.';
    }

    const departureCode = getAirportCode(selectedDepartureAirport);

    const destinationCode = getAirportCode(selectedDestinationAirport);

    if (
      selectedDepartureAirport &&
      selectedDestinationAirport &&
      departureCode &&
      destinationCode &&
      departureCode === destinationCode
    ) {
      nextErrors.destination = 'Destination must be different from departure.';
    }

    if (!airline.trim()) {
      nextErrors.airline = 'Airline name is required.';
    }

    if (!travelDate) {
      nextErrors.travelDate = 'Travel date is required.';
    }

    if (!departureTime) {
      nextErrors.departureTime = 'Departure time is required.';
    }

    if (!arrivalTime) {
      nextErrors.arrivalTime = 'Arrival time is required.';
    }

    if (capacity < MIN_CAPACITY || capacity > MAX_CAPACITY) {
      nextErrors.capacity = `Capacity must be between ${MIN_CAPACITY} and ${MAX_CAPACITY} kg.`;
    }

    if (!ticket) {
      nextErrors.ticket = 'Flight ticket is required.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };


  const createFlight = async token => {
    const response = await axios.post(
      `${BASE_API_URI}/flight/create`,
      {
        departure: selectedDepartureAirport.name,

        departure_airport_id: selectedDepartureAirport.code,

        departure_airport_code:
          selectedDepartureAirport.iata ||
          selectedDepartureAirport.icao ||
          selectedDepartureAirport.code,

        departure_airport_city: selectedDepartureAirport.city,

        departure_airport_country: selectedDepartureAirport.country,

        destination: selectedDestinationAirport.name,

        destination_airport_id: selectedDestinationAirport.code,

        destination_airport_code:
          selectedDestinationAirport.iata ||
          selectedDestinationAirport.icao ||
          selectedDestinationAirport.code,

        destination_airport_city: selectedDestinationAirport.city,

        destination_airport_country: selectedDestinationAirport.country,

        airline_name: airline.trim(),

        travel_date: formatDateForApi(travelDate),

        departure_time: formatTime(departureTime),

        arrival_time: formatTime(arrivalTime),

        capicity_in_kg: capacity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const flightId =
      response?.data?.flight?._id ||
      response?.data?.data?.flight?._id ||
      response?.data?._id ||
      response?.data?.data?._id;

    if (!flightId) {
      throw new Error('Flight was created but no flight ID was returned.');
    }

    return flightId;
  };

  const uploadTicket = async (token, flightId) => {
    const formData = new FormData();

    formData.append('flight_ticket', {
      uri: ticket.uri,
      type: ticket.type,
      name: ticket.fileName,
    });

    const response = await axios.post(
      `${BASE_API_URI}/flight/${flightId}/ticket`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  };

  const handleContinue = async () => {
    if (loading) {
      return;
    }

    if (!validateForm()) {
      showErrorToast('Please complete all required flight details.');

      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('usertoken');

      if (!token) {
        showErrorToast('Your session has expired. Please login again.');

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'LoginScreen',
            },
          ],
        });

        return;
      }

      let flightId = createdFlightId;

      if (!flightId) {
        flightId = await createFlight(token);

        setCreatedFlightId(flightId);
      }

      const ticketResponse = await uploadTicket(token, flightId);

      const updatedUser = ticketResponse?.data?.user;

      if (updatedUser) {
        setUserData(updatedUser);
      } else {
        try {
          const userResponse = await axios.get(`${BASE_API_URI}/login`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (userResponse?.data?.user) {
            setUserData(userResponse.data.user);
          }
        } catch (refreshError) {
          console.log(
            'USER REFRESH ERROR:',
            refreshError?.response?.data || refreshError,
          );
        }
      }

      Toast.show({
        type: 'success',

        text1:
          ticketResponse?.data?.msg || 'Flight submitted for verification.',
      });

      navigation.reset({
        index: 0,

        routes: [
          {
            name: 'TravelerDashboard',
          },
        ],
      });
    } catch (error) {
      console.log('FLIGHT REGISTRATION ERROR:', error?.response?.data || error);

      showErrorToast(getBackendError(error));
    } finally {
      setLoading(false);
    }
  };


  const handleDepartureTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowDepartureTimePicker(false);
    }

    if (!selectedTime) {
      return;
    }

    setDepartureTime(selectedTime);

    setErrors(previous => ({
      ...previous,
      departureTime: '',
    }));
  };

  const handleArrivalTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowArrivalTimePicker(false);
    }

    if (!selectedTime) {
      return;
    }

    setArrivalTime(selectedTime);

    setErrors(previous => ({
      ...previous,
      arrivalTime: '',
    }));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerSide}>
            {showBackButton ? (
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Register Your Flight</Text>

            <Text style={styles.headerSubtitle}>Add your travel details</Text>
          </View>

          <View style={styles.headerSide} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.introCard}>
            <View style={styles.introIcon}>
              <Ionicons name="airplane-outline" size={22} color="#55A9FF" />
            </View>

            <View style={styles.introTextContainer}>
              <Text style={styles.introTitle}>Flight information</Text>

              <Text style={styles.introDescription}>
                Enter the details of your upcoming journey.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Route</Text>

          <View style={styles.airportFieldContainer}>
            <Input
              label="Departure"
              placeholder="Search departure city or airport"
              value={departure}
              onChangeText={value => {
                setDeparture(value);
                setSelectedDepartureAirport(null);
                setShowDepartureSuggestions(value.trim().length >= 2);

                setErrors(previous => ({
                  ...previous,
                  departure: '',
                }));
              }}
              onBlur={() => {
                if (!selectedDepartureAirport) {
                  setDeparture('');
                  setDepartureAirports([]);
                  setShowDepartureSuggestions(false);
                }
              }}
              icon="airplane-outline"
              required
              error={errors.departure}
            />

            {showDepartureSuggestions ? (
              <View style={styles.airportSuggestions}>
                {departureLoading ? (
                  <View style={styles.airportLoading}>
                    <ActivityIndicator size="small" color="#55A9FF" />

                    <Text style={styles.airportLoadingText}>
                      Searching airports...
                    </Text>
                  </View>
                ) : departureAirports.length > 0 ? (
                  departureAirports.map((airport, index) => {
                    const code = getAirportCode(airport);

                    return (
                      <TouchableOpacity
                        key={
                          airport?.id ||
                          airport?._id ||
                          airport?.icao ||
                          airport?.iata ||
                          `${airport?.name}-${index}`
                        }
                        activeOpacity={0.75}
                        onPress={() => selectDepartureAirport(airport)}
                        style={[
                          styles.airportItem,

                          index !== departureAirports.length - 1 &&
                            styles.airportItemBorder,
                        ]}
                      >
                        <View style={styles.airportIcon}>
                          <Ionicons
                            name="airplane-outline"
                            size={18}
                            color="#55A9FF"
                          />
                        </View>

                        <View style={styles.airportInfo}>
                          <Text numberOfLines={1} style={styles.airportName}>
                            {airport?.name || 'Airport'}
                          </Text>

                          <Text
                            numberOfLines={1}
                            style={styles.airportLocation}
                          >
                            {[airport?.city, airport?.country]
                              .filter(Boolean)
                              .join(', ')}
                          </Text>
                        </View>

                        {code ? (
                          <View style={styles.airportCode}>
                            <Text style={styles.airportCodeText}>{code}</Text>
                          </View>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })
                ) : departure.trim().length >= 2 ? (
                  <View style={styles.airportEmpty}>
                    <Text style={styles.airportEmptyText}>
                      No airports found
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>

          <View style={styles.airportFieldContainer}>
            <Input
              label="Destination"
              placeholder="Search destination city or airport"
              value={destination}
              onChangeText={value => {
                setDestination(value);
                setSelectedDestinationAirport(null);
                setShowDestinationSuggestions(value.trim().length >= 2);

                setErrors(previous => ({
                  ...previous,
                  destination: '',
                }));
              }}
              onBlur={() => {
                if (!selectedDestinationAirport) {
                  setDestination('');
                  setDestinationAirports([]);
                  setShowDestinationSuggestions(false);
                }
              }}
              icon="location-outline"
              required
              error={errors.destination}
            />

            {showDestinationSuggestions ? (
              <View style={styles.airportSuggestions}>
                {destinationLoading ? (
                  <View style={styles.airportLoading}>
                    <ActivityIndicator size="small" color="#55A9FF" />

                    <Text style={styles.airportLoadingText}>
                      Searching airports...
                    </Text>
                  </View>
                ) : destinationAirports.length > 0 ? (
                  destinationAirports.map((airport, index) => {
                    const code = getAirportCode(airport);

                    return (
                      <TouchableOpacity
                        key={
                          airport?.id ||
                          airport?._id ||
                          airport?.icao ||
                          airport?.iata ||
                          `${airport?.name}-${index}`
                        }
                        activeOpacity={0.75}
                        onPress={() => selectDestinationAirport(airport)}
                        style={[
                          styles.airportItem,

                          index !== destinationAirports.length - 1 &&
                            styles.airportItemBorder,
                        ]}
                      >
                        <View style={styles.airportIcon}>
                          <Ionicons
                            name="location-outline"
                            size={18}
                            color="#55A9FF"
                          />
                        </View>

                        <View style={styles.airportInfo}>
                          <Text numberOfLines={1} style={styles.airportName}>
                            {airport?.name || 'Airport'}
                          </Text>

                          <Text
                            numberOfLines={1}
                            style={styles.airportLocation}
                          >
                            {[airport?.city, airport?.country]
                              .filter(Boolean)
                              .join(', ')}
                          </Text>
                        </View>

                        {code ? (
                          <View style={styles.airportCode}>
                            <Text style={styles.airportCodeText}>{code}</Text>
                          </View>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })
                ) : destination.trim().length >= 2 ? (
                  <View style={styles.airportEmpty}>
                    <Text style={styles.airportEmptyText}>
                      No airports found
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>

          <Text style={styles.sectionTitle}>Flight Details</Text>

          <Input
            label="Airline Name"
            placeholder="Enter airline name"
            value={airline}
            onChangeText={value => {
              setAirline(value);

              setErrors(previous => ({
                ...previous,
                airline: '',
              }));
            }}
            icon="business-outline"
            required
            error={errors.airline}
          />

          <Input
            type="date"
            label="Travel Date"
            placeholder="Select travel date"
            dateValue={travelDate}
            minimumDate={today}
            maximumDate={maximumTravelDate}
            onDateChange={value => {
              setTravelDate(value);

              setErrors(previous => ({
                ...previous,
                travelDate: '',
              }));
            }}
            required
            error={errors.travelDate}
          />

          <View style={styles.timeRow}>
            <View style={styles.timeColumn}>
              <Text style={styles.fieldLabel}>
                Departure Time
                <Text style={styles.required}> *</Text>
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowDepartureTimePicker(true)}
                style={[
                  styles.timeInput,

                  errors.departureTime && styles.errorBorder,
                ]}
              >
                <Text
                  style={[
                    styles.timeText,

                    !departureTime && styles.placeholderText,
                  ]}
                >
                  {departureTime ? formatTime(departureTime) : 'Select time'}
                </Text>

                <Ionicons name="time-outline" size={20} color="#6E8096" />
              </TouchableOpacity>

              {errors.departureTime ? (
                <Text style={styles.errorText}>{errors.departureTime}</Text>
              ) : null}
            </View>

            <View style={styles.timeColumn}>
              <Text style={styles.fieldLabel}>
                Arrival Time
                <Text style={styles.required}> *</Text>
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowArrivalTimePicker(true)}
                style={[
                  styles.timeInput,

                  errors.arrivalTime && styles.errorBorder,
                ]}
              >
                <Text
                  style={[
                    styles.timeText,

                    !arrivalTime && styles.placeholderText,
                  ]}
                >
                  {arrivalTime ? formatTime(arrivalTime) : 'Select time'}
                </Text>

                <Ionicons name="time-outline" size={20} color="#6E8096" />
              </TouchableOpacity>

              {errors.arrivalTime ? (
                <Text style={styles.errorText}>{errors.arrivalTime}</Text>
              ) : null}
            </View>
          </View>

          {showDepartureTimePicker ? (
            <View>
              <DateTimePicker
                value={departureTime || new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDepartureTimeChange}
              />

              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  style={styles.pickerDoneButton}
                  onPress={() => setShowDepartureTimePicker(false)}
                >
                  <Text style={styles.pickerDoneText}>Done</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          {showArrivalTimePicker ? (
            <View>
              <DateTimePicker
                value={arrivalTime || new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleArrivalTimeChange}
              />

              {Platform.OS === 'ios' ? (
                <TouchableOpacity
                  style={styles.pickerDoneButton}
                  onPress={() => setShowArrivalTimePicker(false)}
                >
                  <Text style={styles.pickerDoneText}>Done</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Available Capacity</Text>

          <View style={styles.capacityCard}>
            <View style={styles.capacityHeader}>
              <View>
                <Text style={styles.capacityTitle}>
                  Available luggage space
                </Text>

                <Text style={styles.capacityHint}>
                  Select between 1 and 40 kg
                </Text>
              </View>

              <View style={styles.capacityBadge}>
                <Text style={styles.capacityBadgeText}>{capacity} kg</Text>
              </View>
            </View>

            <View style={styles.capacityControls}>
              <TouchableOpacity
                activeOpacity={0.75}
                disabled={capacity <= MIN_CAPACITY}
                onPress={() => setCapacityValue(capacity - 1)}
                style={[
                  styles.capacityButton,

                  capacity <= MIN_CAPACITY && styles.capacityButtonDisabled,
                ]}
              >
                <Ionicons name="remove" size={23} color="#EAF3FE" />
              </TouchableOpacity>

              <View style={styles.sliderArea} onLayout={handleSliderLayout}>
                <View
                  {...panResponder.panHandlers}
                  style={styles.sliderTouchArea}
                >
                  <View style={styles.sliderTrack} />

                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.sliderProgress,

                      {
                        width: sliderPosition,
                      },
                    ]}
                  />

                  <Animated.View
                    pointerEvents="none"
                    style={[
                      styles.sliderThumb,

                      {
                        left: Animated.subtract(sliderPosition, 14),
                      },
                    ]}
                  >
                    <View style={styles.sliderThumbInner} />
                  </Animated.View>
                </View>

                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>{MIN_CAPACITY} kg</Text>

                  <Text style={styles.sliderLabel}>{MAX_CAPACITY} kg</Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.75}
                disabled={capacity >= MAX_CAPACITY}
                onPress={() => setCapacityValue(capacity + 1)}
                style={[
                  styles.capacityButton,

                  capacity >= MAX_CAPACITY && styles.capacityButtonDisabled,
                ]}
              >
                <Ionicons name="add" size={23} color="#EAF3FE" />
              </TouchableOpacity>
            </View>

            {errors.capacity ? (
              <Text style={styles.errorText}>{errors.capacity}</Text>
            ) : null}
          </View>

          <Text style={styles.sectionTitle}>Flight Ticket</Text>

          <Text style={styles.uploadLabel}>
            Flight Ticket
            <Text style={styles.requiredStar}> *</Text>
          </Text>

          <Text style={styles.uploadHelper}>
            Upload a clear image of your flight ticket. JPG or PNG up to 10 MB.
          </Text>

          {ticket ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={selectTicket}
              style={[
                styles.uploadBox,
                styles.uploadBoxSelected,

                errors.ticket && styles.uploadBoxError,
              ]}
            >
              <Image
                source={{
                  uri: ticket.uri,
                }}
                resizeMode="cover"
                style={styles.documentPreview}
              />

              <View style={styles.documentOverlay}>
                <View style={styles.documentInfo}>
                  <View style={styles.successIcon}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>

                  <View style={styles.documentTextContainer}>
                    <Text numberOfLines={1} style={styles.documentName}>
                      {ticket.fileName}
                    </Text>

                    <Text style={styles.documentChange}>
                      Tap to replace ticket
                    </Text>
                  </View>
                </View>

                <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={selectTicket}
              style={[styles.uploadBox, errors.ticket && styles.uploadBoxError]}
            >
              <View style={styles.uploadIcon}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={26}
                  color="#55A9FF"
                />
              </View>

              <Text style={styles.uploadTitle}>Upload flight ticket</Text>

              <Text style={styles.uploadText}>Tap to choose an image</Text>
            </TouchableOpacity>
          )}

          {errors.ticket ? (
            <Text style={styles.ticketError}>{errors.ticket}</Text>
          ) : null}

          <View style={styles.securityNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={19}
              color="#55A9FF"
            />

            <Text style={styles.securityText}>
              Your flight ticket is stored securely and used to verify your
              travel details.
            </Text>
          </View>

          {createdFlightId ? (
            <View style={styles.retryNotice}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#55A9FF"
              />

              <Text style={styles.retryNoticeText}>
                Your flight details are saved. Continue to upload the ticket.
              </Text>
            </View>
          ) : null}

          <View style={styles.buttonContainer}>
            <Button
              text={
                createdFlightId ? 'Upload Ticket & Continue' : 'Register Flight'
              }
              icon="arrow-forward"
              loading={loading}
              disabled={loading}
              onPress={handleContinue}
            />
          </View>

          <Text style={styles.footerText}>
            Make sure your flight information matches your ticket.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FlightDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111F',
  },

  container: {
    flex: 1,
    backgroundColor: '#08111F',
  },

  header: {
    minHeight: 70,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#142238',
  },

  headerSide: {
    width: 34,
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#08111F',
    borderWidth: 1,
    borderColor: '#08111F',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    color: '#F5F8FC',
    fontSize: 18,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#718399',
    fontSize: 11,
    marginTop: 3,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  introCard: {
    width: '100%',
    padding: 16,
    backgroundColor: '#0D1929',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#192B42',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },

  introIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: 'rgba(39,142,245,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  introTextContainer: {
    flex: 1,
    marginLeft: 13,
  },

  introTitle: {
    color: '#F1F6FC',
    fontSize: 15,
    fontWeight: '700',
  },

  introDescription: {
    color: '#718399',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 3,
  },

  sectionTitle: {
    color: '#4DA4FA',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
    marginTop: 6,
  },

  timeRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  timeColumn: {
    width: '48%',
  },

  fieldLabel: {
    color: '#E9EFF7',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  required: {
    color: '#FF6B6B',
    fontWeight: '700',
  },

  timeInput: {
    width: '100%',
    minHeight: 55,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#1E2D40',
    backgroundColor: '#0E1827',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeText: {
    flex: 1,
    color: '#F5F8FC',
    fontSize: 14,
  },

  placeholderText: {
    color: '#56677D',
  },

  errorBorder: {
    borderColor: '#D85F69',
  },

  errorText: {
    color: '#E87982',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
    marginLeft: 2,
  },

  pickerDoneButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 9,
    backgroundColor: '#162439',
    marginBottom: 10,
  },

  pickerDoneText: {
    color: '#55A9FF',
    fontSize: 13,
    fontWeight: '700',
  },

  capacityCard: {
    width: '100%',
    backgroundColor: '#0D1929',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#192B42',
    padding: 17,
    marginBottom: 22,
  },

  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  capacityTitle: {
    color: '#EAF1F9',
    fontSize: 14,
    fontWeight: '700',
  },

  capacityHint: {
    color: '#6D7E93',
    fontSize: 11,
    marginTop: 4,
  },

  capacityBadge: {
    width: 76,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(39,142,245,0.11)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  capacityBadgeText: {
    width: '100%',
    color: '#65B1FF',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    textAlign: 'center',
  },

  capacityControls: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  capacityButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#17273A',
    borderWidth: 1,
    borderColor: '#263A52',
    justifyContent: 'center',
    alignItems: 'center',
  },

  capacityButtonDisabled: {
    opacity: 0.35,
  },

  sliderArea: {
    flex: 1,
    marginHorizontal: 13,
  },

  sliderTouchArea: {
    width: '100%',
    height: 52,
    justifyContent: 'center',
  },

  sliderTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#22344A',
  },

  sliderProgress: {
    position: 'absolute',
    left: 0,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#278EF5',
  },

  sliderThumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DCEEFF',
    borderWidth: 3,
    borderColor: '#278EF5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sliderThumbInner: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#278EF5',
  },

  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -2,
  },

  sliderLabel: {
    color: '#64778F',
    fontSize: 10,
    fontWeight: '600',
  },

  uploadLabel: {
    color: '#E9EFF7',
    fontSize: 13,
    fontWeight: '600',
  },

  requiredStar: {
    color: '#FF6B6B',
  },

  uploadHelper: {
    color: '#718399',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
    marginBottom: 10,
  },

  uploadBox: {
    width: '100%',
    minHeight: 135,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2D6597',
    backgroundColor: 'rgba(30,144,255,0.045)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  uploadBoxSelected: {
    height: 180,
    borderStyle: 'solid',
    borderColor: '#294764',
  },

  uploadBoxError: {
    borderColor: '#D85F69',
  },

  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: 'rgba(30,144,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadTitle: {
    color: '#DDE8F3',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
  },

  uploadText: {
    color: '#718399',
    fontSize: 11,
    marginTop: 4,
  },

  documentPreview: {
    width: '100%',
    height: '100%',
  },

  documentOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 58,
    backgroundColor: 'rgba(4,10,18,0.87)',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  documentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  successIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#1687F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  documentTextContainer: {
    flex: 1,
    marginLeft: 9,
  },

  documentName: {
    color: '#F3F7FC',
    fontSize: 12,
    fontWeight: '700',
  },

  documentChange: {
    color: '#73879F',
    fontSize: 10,
    marginTop: 2,
  },

  ticketError: {
    color: '#E87982',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 2,
  },

  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 13,
    backgroundColor: 'rgba(30,144,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.13)',
    padding: 12,
    marginTop: 13,
  },

  securityText: {
    flex: 1,
    color: '#7F92A9',
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 9,
  },

  retryNotice: {
    marginTop: 13,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(39,142,245,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
  },

  retryNoticeText: {
    flex: 1,
    color: '#93A9C0',
    fontSize: 11,
    lineHeight: 16,
    marginLeft: 8,
  },

  buttonContainer: {
    marginTop: 26,
  },

  footerText: {
    color: '#586B82',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: 25,
    marginTop: 14,
  },

  airportFieldContainer: {
    width: '100%',
    position: 'relative',
  },

  airportSuggestions: {
    width: '100%',
    backgroundColor: '#0D1929',
    borderWidth: 1,
    borderColor: '#1D334D',
    borderRadius: 14,
    marginTop: -7,
    marginBottom: 15,
    overflow: 'hidden',
  },

  airportLoading: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  airportLoadingText: {
    color: '#7D91A8',
    fontSize: 12,
    marginLeft: 9,
  },

  airportItem: {
    minHeight: 68,
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  airportItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#172A40',
  },

  airportIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(39,142,245,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  airportInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 8,
  },

  airportName: {
    color: '#EEF4FB',
    fontSize: 13,
    fontWeight: '700',
  },

  airportLocation: {
    color: '#718399',
    fontSize: 11,
    marginTop: 4,
  },

  airportCode: {
    minWidth: 48,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 9,
    backgroundColor: 'rgba(39,142,245,0.11)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  airportCodeText: {
    color: '#65B1FF',
    fontSize: 11,
    fontWeight: '800',
  },

  airportEmpty: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  airportEmptyText: {
    color: '#718399',
    fontSize: 12,
  },
});
