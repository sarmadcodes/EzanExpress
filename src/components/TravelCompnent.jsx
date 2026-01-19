import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

const TravelDashboard = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Travel Status Toggle */}
      <View style={styles.statusCard}>
        <View>
          <Text style={styles.statusTitle}>Travel Status</Text>
          <Text style={styles.statusSubtitle}>You are visible to senders</Text>
        </View>
        <Switch
          trackColor={{ false: '#2D3F50', true: '#1E88E5' }}
          thumbColor={'#FFFFFF'}
          onValueChange={() => setIsEnabled(previousState => !previousState)}
          value={isEnabled}
        />
      </View>

      {/* Info Grid (Weight & Bags) */}
      <View style={styles.infoGrid}>
        <View style={styles.infoBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="bag-outline" size={20} color="#1E88E5" />
          </View>
          <Text style={styles.infoValue}>10kg</Text>
          <Text style={styles.infoLabel}>Allowance Left</Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="briefcase-outline" size={20} color="#1E88E5" />
          </View>
          <Text style={styles.infoValue}>3 Bags</Text>
          <Text style={styles.infoLabel}>Space Open</Text>
        </View>
      </View>
      {/* <View style={{marginVertical:10}}>
        <TouchableOpacity style={{padding:15, backgroundColor:'#1E90FF', borderRadius:10,}}>
          <Text style={{textAlign:'center', color:'#ffffffde', fontSize:16, fontWeight:'600'}}>Update availabe parcel space</Text>
        </TouchableOpacity>
      </View> */}

      {/* My Trip Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Trip</Text>
        <Text style={styles.viewDetails}>View Details</Text>
      </View>

      {/* Flight Ticket Card */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=500' }}
        style={styles.flightCard}
        imageStyle={{ borderRadius: 16, opacity: 0.3 }}
      >
        <View style={styles.cardOverlay}>
          <View style={styles.cardHeader}>
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingText}>UPCOMING</Text>
            </View>
            <Ionicons name="airplane-outline" size={20} color="#7AA2C5" />
          </View>

          <View style={styles.flightRoute}>
            <View>
              <Text style={styles.airportCode}>JFK</Text>
              <Text style={styles.cityText}>New York</Text>
            </View>

            <View style={styles.flightLineContainer}>
              <Text style={styles.flightNumber}>TK1984</Text>
              <View style={styles.dottedLine}>
                <View style={styles.dot} />
                <View style={styles.line} />
                <Ionicons
                  name="airplane-outline"
                  size={14}
                  color="#1E88E5"
                  style={styles.centerPlane}
                />
                <View style={styles.line} />
                <View style={styles.dot} />
              </View>
              <Text style={styles.duration}>10h 40m</Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.airportCode}>IST</Text>
              <Text style={styles.cityText}>Istanbul</Text>
            </View>
          </View>

          <View style={styles.bottomDivider} />

          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#7AA2C5" />
            <Text style={styles.dateText}>Tomorrow, 14:00</Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  viewDetails: {
    color: '#1E88E5',
    fontSize: 14,
  },
  flightCard: {
    height: 200,
    backgroundColor: '#16222F',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upcomingBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  upcomingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  flightRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  airportCode: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  cityText: {
    color: '#7AA2C5',
    fontSize: 12,
  },
  flightLineContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  flightNumber: {
    color: '#7AA2C5',
    fontSize: 10,
    marginBottom: 4,
  },
  dottedLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E88E5',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#2D3F50',
    marginHorizontal: 4,
  },
  duration: {
    color: '#1E88E5',
    fontSize: 11,
    marginTop: 4,
  },
  bottomDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: '#7AA2C5',
    fontSize: 14,
    marginLeft: 8,
  },
});

export default TravelDashboard;
