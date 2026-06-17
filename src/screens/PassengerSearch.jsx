import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../components/BackBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_API_URI } from '../constant/API';

const TRAVELERS_DATA = [
  {
    id: '1',
    name: 'Ms. X',
    from: 'London',
    fromCode: 'Wood Green',
    to: 'New York',
    date: 'Sat. 20 Dec. 2025',
    arrivalDate: 'Sun 21 Dec. 2025',
    capacity: '20kg',
    status: 'available',
  },
  {
    id: '2',
    name: 'Mr. Y',
    from: 'London',
    fromCode: 'Ilford',
    to: 'New York',
    date: 'Sun 21 Dec. 2025',
    arrivalDate: 'Sun 21 Dec. 2025',
    capacity: '1kg',
    status: 'documents_only',
  },
  {
    id: '3',
    name: 'Ms. Z',
    from: 'London',
    fromCode: 'Acton',
    to: 'New York',
    date: 'Sun 21 Dec. 2025',
    arrivalDate: 'Sun 21 Dec. 2025',
    capacity: '0kg',
    status: 'full',
  },
];

const PassengerSearch = ({ navigation }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [flights, setFlights] = useState([]);
  const getFlights = async () => {
    let token = await AsyncStorage.getItem('usertoken');
    axios
      .get(`${BASE_API_URI}/flight/get`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(data => {
        console.log(data.data)
        setFlights(data.data);
      });
  };
  useEffect(() => {
    getFlights();
  }, []);

  const renderPassengerCard = (item) => {
    // const isFull = item.status === 'full';

    let isAv = ((Number(item?.capicity_in_kg)*1000)-Number(item?.already_full_capicity_in_grams)>0)
    const getStatusConfig = () => {
      if (isAv) {
        return { text: 'AVAILABLE', color: '#22c55e' };
      }
      return { text: 'FULL', color: '#120202' };
    };

    const status = getStatusConfig();

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        key={item._id}
        style={styles.card}
        onPress={() =>
          navigation.navigate('CarrierProfile', { userId: item.user_id,data: item})
        }
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          {/* <View>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardSubText}>
              {item.fromCode}, {item.from}
            </Text>
          </View> */}

          <View style={[styles.statusBadge, { borderColor: status.color }]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.routeRow}>
          <View>
            <Text style={styles.routeCity}>{item.departure}</Text>
            <Text style={styles.routeDate}>{item.departure_time}</Text>
          </View>

          <Ionicons name="arrow-forward" size={18} color="#3b82f6" />

          <View>
            <Text style={styles.routeCity}>{item?.destination}</Text>
            <Text style={styles.routeDate}>{item?.arrival_time}</Text>
          </View>
        </View>

        {/* Capacity */}
        <View style={styles.infoBox}>
          {
             <>
              <Text style={styles.infoTextMuted}>
                {item.status === 'documents_only'
                  ? 'Accepts documents only'
                  : 'Accepts parcels & documents'}
              </Text>
              <Text style={styles.infoText}>
                Available space: {((Number(item?.capicity_in_kg)*1000)-Number(item?.already_full_capicity_in_grams))/1000}
              </Text>
             </>
          }
        </View>

        {/* Action */}
        {isAv && (
          <TouchableOpacity
            style={styles.requestButton}
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate('NewParcelRequest', { traveler: item });
            }}
          >
            <Text style={styles.requestButtonText}>Send Request</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />
      <BackBar title="Search Passenger" />

      <ScrollView contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchContainer}>
          <Text style={styles.inputLabel}>Destination</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter City or Airport"
              placeholderTextColor="#64748b"
              value={destination}
              onChangeText={setDestination}
            />
            <Ionicons name="airplane" size={18} color="#3b82f6" />
          </View>

          <View style={styles.dateRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.inputLabel}>From</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Start Date"
                  placeholderTextColor="#64748b"
                  value={startDate}
                  onChangeText={setStartDate}
                />
                <Ionicons name="calendar-outline" size={16} color="#64748b" />
              </View>
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.inputLabel}>To</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="End Date"
                  placeholderTextColor="#64748b"
                  value={endDate}
                  onChangeText={setEndDate}
                />
                <Ionicons name="calendar-outline" size={16} color="#64748b" />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.findButton}>
            <Ionicons name="search" size={18} color="#fff" />
            <Text style={styles.findButtonText}>Find Passengers</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Available Passengers</Text>

        {flights&&flights.map(renderPassengerCard)}
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
    padding: 16,
    paddingBottom: 30,
  },

  /* Search */
  searchContainer: {
    backgroundColor: '#161f31',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 6,
  },
  textInputContainer: {
    backgroundColor: '#1E2936',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  dateRow: {
    flexDirection: 'row',
  },
  findButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  findButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  /* Cards */
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#161f31',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubText: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  routeCity: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  routeDate: {
    color: '#94a3b8',
    fontSize: 11,
  },
  infoBox: {
    marginTop: 12,
  },
  infoText: {
    color: '#e5e7eb',
    fontSize: 12,
  },
  infoTextMuted: {
    color: '#94a3b8',
    fontSize: 12,
  },
  requestButton: {
    marginTop: 14,
    backgroundColor: '#1E90FF',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
