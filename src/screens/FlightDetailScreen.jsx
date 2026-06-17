import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState, useRef, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  PanResponder,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LOADING } from '../context/Loading';
import { USER } from '../context/User';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { BASE_API_URI } from '../constant/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SLIDER_WIDTH = Dimensions.get('window').width - 80;
const MAX_CAPACITY = 40;

const FlightDetailScreen = ({ navigation }) => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [airline, setAirline] = useState('');

  const [date, setDate] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');

  const { loading, setLoading } = useContext(LOADING);
  const { userData, setUserData } = useContext(USER);

  const [capacity, setCapacity] = useState(15);

  // Animated value for slider thumb
  const animatedX = useRef(
    new Animated.Value((capacity / MAX_CAPACITY) * SLIDER_WIDTH),
  ).current;

  // Update capacity and thumb position
  const updateCapacity = x => {
    let newX = Math.max(0, Math.min(SLIDER_WIDTH, x));
    let value = Math.round((newX / SLIDER_WIDTH) * MAX_CAPACITY);
    setCapacity(value);
    Animated.timing(animatedX, {
      toValue: (value / MAX_CAPACITY) * SLIDER_WIDTH,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  // PanResponder for drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        updateCapacity(animatedX._value + gestureState.dx);
      },
    }),
  ).current;

  // Tap anywhere on slider
  const handleSliderPress = evt => {
    const x = evt.nativeEvent.locationX;
    updateCapacity(x);
  };

  const onDateChange = (_, pickedDate) => {
    setShowDatePicker(false);
    if (pickedDate) {
      setSelectedDate(pickedDate);
      setDate(
        pickedDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
      );
    }
  };

  const onCreateFilght = async () => {
    setLoading(true);
    if (
      !(
        departure &&
        destination &&
        airline &&
        date &&
        departureTime &&
        arrivalTime &&
        capacity
      )
    ) {
      Toast.show({
        text1: 'All fileds required!',
        type: 'error',
      });
      setLoading(false);
      return;
    }
    let token = await AsyncStorage.getItem('usertoken');
    axios
      .post(
        `${BASE_API_URI}/flight/create`,
        {
          departure: departure,
          destination: destination,
          airline_name: airline,
          travel_date: date,
          departure_time: departureTime,
          arrival_time: arrivalTime,
          capicity_in_kg: capacity,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(responseData => {
        setLoading(false);
        console.log(responseData.data);
        Toast.show({
          text1: 'Successfully created',
          type: 'success',
        });
        navigation.reset({ index: 0, routes: [{ name: 'TravelerDashboard' }] });
      })
      .catch(err => {
        console.log(err, 'err');
        setLoading(false);
        Toast.show({
          text1: 'Server error try again!',
          type: 'error',
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Register your Flight</Text>
        <Text style={styles.helpText}>Help</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cities */}
        <Text style={styles.sectionTitle}>Where are you flying?</Text>
        <Text style={styles.label}>Departure City</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="e.g. New York, JFK"
            placeholderTextColor="#636E72"
            value={departure}
            onChangeText={setDeparture}
          />
          <Ionicons name="airplane-outline" size={18} color="#BDC3C7" />
        </View>

        <View style={styles.dashedLine} />

        <Text style={styles.label}>Destination City</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="e.g. London, LHR"
            placeholderTextColor="#636E72"
            value={destination}
            onChangeText={setDestination}
          />
          <Ionicons name="airplane-outline" size={18} color="#BDC3C7" />
        </View>

        {/* Airline */}
        <Text style={styles.sectionTitle}>Flight Details</Text>
        <Text style={styles.label}>Airline Name</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="e.g. Emirates"
            placeholderTextColor="#636E72"
            value={airline}
            onChangeText={setAirline}
          />
          <Ionicons name="business-outline" size={18} color="#BDC3C7" />
        </View>

        {/* Date */}
        <Text style={styles.label}>Travel Date</Text>
        <TouchableOpacity
          style={styles.inputWrapper}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={date ? styles.input : styles.placeholderText}>
            {date || 'Select date'}
          </Text>
          <Ionicons name="calendar-outline" size={18} color="#2D9CDB" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={onDateChange}
          />
        )}

        {/* Time Row */}
        <View style={styles.timeRow}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Departure Time</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="10:30 AM"
                placeholderTextColor="#636E72"
                value={departureTime}
                onChangeText={setDepartureTime}
              />
              <Ionicons name="time-outline" size={18} color="#2D9CDB" />
            </View>
          </View>

          <View style={styles.halfInput}>
            <Text style={styles.label}>Arrival Time</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="03:45 PM"
                placeholderTextColor="#636E72"
                value={arrivalTime}
                onChangeText={setArrivalTime}
              />
              <Ionicons name="time-outline" size={18} color="#2D9CDB" />
            </View>
          </View>
        </View>

        {/* Custom Line Slider */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Available Capacity</Text>
            <Text style={styles.capacityValue}>{capacity} kg</Text>
          </View>

          <TouchableOpacity
            style={styles.sliderContainer}
            onPress={handleSliderPress}
            activeOpacity={1}
          >
            {/* Background */}
            <View style={styles.sliderBackground} />
            {/* Active */}
            <Animated.View
              style={[styles.sliderActive, { width: animatedX }]}
            />
            {/* Thumb */}
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.sliderThumb,
                { left: Animated.subtract(animatedX, 8) },
              ]}
            />
          </TouchableOpacity>

          <View style={styles.sliderLabels}>
            <Text style={styles.limitText}>0 kg</Text>
            <Text style={styles.limitText}>40 kg</Text>
          </View>
        </View>

        {/* Upload */}
        <Text style={styles.sectionTitle}>Flight Confirmation</Text>
        <TouchableOpacity style={styles.uploadBox}>
          <Ionicons name="cloud-upload-outline" size={26} color="#2D9CDB" />
          <Text style={styles.uploadText}>Tap to upload ticket</Text>
          <Text style={styles.formatText}>PDF, JPG, PNG</Text>
        </TouchableOpacity>

        {/* Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => onCreateFilght()}
        >
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FlightDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  helpText: { color: '#2D9CDB' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 10,
  },
  label: { color: '#94A3B8', fontSize: 13, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    borderWidth: 1,
    borderColor: '#334155',
  },
  input: { flex: 1, color: '#FFF', fontSize: 15 },
  placeholderText: { color: '#636E72', fontSize: 15 },
  dashedLine: {
    height: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
    borderStyle: 'dashed',
    marginVertical: 6,
    marginLeft: 'auto',
    marginRight: 14,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  halfInput: { width: '48%' },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: { color: '#FFF', fontWeight: '600' },
  capacityValue: { color: '#2D9CDB', fontWeight: '700' },
  sliderContainer: { height: 30, justifyContent: 'center', marginTop: 14 },
  sliderBackground: {
    position: 'absolute',
    height: 4,
    width: '100%',
    backgroundColor: '#334155',
    borderRadius: 2,
  },
  sliderActive: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#2D9CDB',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2D9CDB',
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  limitText: { color: '#64748B', fontSize: 12 },
  uploadBox: {
    height: 140,
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  uploadText: { color: '#FFF', marginTop: 8 },
  formatText: { color: '#94A3B8', fontSize: 12 },
  primaryButton: {
    backgroundColor: '#2185D5',
    height: 54,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
    marginRight: 8,
  },
});
