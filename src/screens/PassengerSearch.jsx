import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
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

  const renderPassengerCard = (item) => {
    const isFull = item.status === 'full';

    const getStatusConfig = () => {
      if (item.status === 'full') return { text: 'FULL', color: '#ef4444' };
      if (item.status === 'documents_only')
        return { text: 'DOCS ONLY', color: '#f59e0b' };
      return { text: 'AVAILABLE', color: '#22c55e' };
    };

    const status = getStatusConfig();

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        key={item.id}
        style={styles.card}
        onPress={() =>
          navigation.navigate('CarrierProfile', { userId: item.id })
        }
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardSubText}>
              {item.fromCode}, {item.from}
            </Text>
          </View>

          <View style={[styles.statusBadge, { borderColor: status.color }]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.text}
            </Text>
          </View>
        </View>

        {/* Route */}
        <View style={styles.routeRow}>
          <View>
            <Text style={styles.routeCity}>{item.from}</Text>
            <Text style={styles.routeDate}>{item.date}</Text>
          </View>

          <Ionicons name="arrow-forward" size={18} color="#3b82f6" />

          <View>
            <Text style={styles.routeCity}>{item.to}</Text>
            <Text style={styles.routeDate}>{item.arrivalDate}</Text>
          </View>
        </View>

        {/* Capacity */}
        <View style={styles.infoBox}>
          {isFull ? (
            <Text style={styles.infoTextMuted}>
              I am full. I don’t have space
            </Text>
          ) : (
            <>
              <Text style={styles.infoTextMuted}>
                {item.status === 'documents_only'
                  ? 'Accepts documents only'
                  : 'Accepts parcels & documents'}
              </Text>
              <Text style={styles.infoText}>
                Available space: {item.capacity}
              </Text>
            </>
          )}
        </View>

        {/* Action */}
        {!isFull && (
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

        {TRAVELERS_DATA.map(renderPassengerCard)}
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
