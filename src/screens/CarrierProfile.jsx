import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../components/BackBar';

const CarrierProfile = ({ navigation, route }) => {
  // Mock data for the profile
  const profile = {
    name: 'Alex M.',
    rating: 4.9,
    reviews: 12,
    trips: 24,
    flightNo: 'BA117',
    capacityUsed: 15,
    capacityTotal: 23,
    preferences: [
      { id: 1, label: 'Electronics', allowed: true },
      { id: 2, label: 'Documents', allowed: true },
      { id: 3, label: 'Clothing', allowed: true },
      { id: 4, label: 'Liquids', allowed: false },
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor='#0B121C' />
      <View style={{paddingHorizontal:15}}>
        <BackBar title='Passenger Profile' />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: '' }} 
              style={styles.profileImg} 
            />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-sharp" size={16} color="#fff" />
            </View>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.verifiedText}>
            <Text style={{ color: '#10b981' }}>Verified ID</Text> • Frequent Flyer
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}><Ionicons name="star" color="#eab308" size={16} /> {profile.rating}</Text>
              <Text style={styles.statLabel}>{profile.reviews} Reviews</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}><Ionicons name="airplane" color="#1E90FF" size={16} /> {profile.trips}</Text>
              <Text style={styles.statLabel}>Trips Completed</Text>
            </View>
          </View>
        </View>

        {/* Flight Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Flight Details</Text>
            <View style={styles.flightBadge}><Text style={styles.flightBadgeText}>{profile.flightNo}</Text></View>
          </View>

          <View style={styles.timelineContainer}>
            <View style={styles.timelineLeft}>
              <Ionicons name="airplane" size={20} color="#1E90FF" />
              <View style={styles.verticalLine} />
              <Ionicons name="location" size={20} color="#64748b" />
            </View>
            <View style={styles.timelineRight}>
              <View style={styles.timelinePoint}>
                <Text style={styles.airportCode}>JFK</Text>
                <Text style={styles.locationSub}>New York, USA</Text>
                <Text style={styles.dateTime}>Oct 24, 14:00</Text>
              </View>
              <View style={[styles.timelinePoint, { marginTop: 30 }]}>
                <Text style={styles.airportCode}>LHR</Text>
                <Text style={styles.locationSub}>London, UK</Text>
                <Text style={styles.dateTime}>Oct 25, 06:30</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Capacity */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Capacity & Allowance</Text>
          <View style={styles.capacityRow}>
            <Text style={styles.capacityText}>Available Space</Text>
            <Text style={styles.capacityValue}>
              <Text style={{ color: '#fff' }}>{profile.capacityUsed}kg</Text> / {profile.capacityTotal}kg
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${(profile.capacityUsed/profile.capacityTotal)*100}%` }]} />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.preferencesGrid}>
          {profile.preferences.map(pref => (
            <View key={pref.id} style={[styles.prefItem, { backgroundColor: pref.allowed ? '#1e293b' : '#2d1e23' }]}>
               <Ionicons 
                name={pref.allowed ? "checkmark-circle" : "close-circle"} 
                size={18} 
                color={pref.allowed ? "#10b981" : "#ef4444"} 
              />
              <Text style={styles.prefText}>{pref.label}</Text>
            </View>
          ))}
        </View>

        {/* Reviews Summary */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity><Text style={styles.viewAll}>See all</Text></TouchableOpacity>
          </View>
          <View style={styles.reviewSummaryRow}>
            <View style={styles.ratingBigBox}>
              <Text style={styles.ratingBigText}>{profile.rating}</Text>
              <View style={styles.starsRow}>
                {[1,2,3,4,5].map(s => <Ionicons key={s} name="star" size={10} color="#eab308" />)}
              </View>
              <Text style={styles.reviewCount}>{profile.reviews} reviews</Text>
            </View>
            <View style={styles.ratingBars}>
               {[5,4,3,2,1].map(num => (
                 <View key={num} style={styles.barRow}>
                   <Text style={styles.barNum}>{num}</Text>
                   <View style={styles.barBg}><View style={[styles.barFill, { width: num === 5 ? '80%' : '10%' }]} /></View>
                 </View>
               ))}
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Floating Action Button / Request Bar */}
      <View style={styles.stickyFooter}>
        <View>
          {/* <Text style={styles.estimateLabel}>Total Estimate</Text> */}
          {/* <Text style={styles.priceText}>$36.00</Text> */}
        </View>
        <TouchableOpacity 
          style={styles.requestButton}
          onPress={() => navigation.navigate('NewParcelRequest')}
        >
          <Text style={styles.requestButtonText}>Send Request</Text>
          <Ionicons name="paper-plane" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0B121C',
    // paddingHorizontal:15,
},

  scrollContent: { padding: 16, paddingBottom: 100 },
  profileCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  profileImg: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#334155' },
  verifiedBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: '#10b981',
    borderRadius: 50,
    padding: 4,
    borderWidth: 3,
    borderColor: '#1e293b',
  },
  profileName: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  verifiedText: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    marginTop: 24,
    width: '100%',
    justifyContent: 'space-evenly',
  },
  statBox: { alignItems: 'center' },
  statValue: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#64748b', fontSize: 12, marginTop: 4 },
  divider: { width: 1, height: '100%', backgroundColor: '#334155' },
  sectionCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  flightBadge: { backgroundColor: '#1E90FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  flightBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  timelineContainer: { flexDirection: 'row', paddingLeft: 8 },
  timelineLeft: { alignItems: 'center', marginRight: 16 },
  verticalLine: { width: 2, flex: 1, backgroundColor: '#334155', marginVertical: 4 },
  airportCode: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  locationSub: { color: '#94a3b8', fontSize: 14 },
  dateTime: { color: '#3b82f6', fontSize: 14, marginTop: 4 },
  capacityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  capacityText: { color: '#94a3b8' },
  capacityValue: { color: '#64748b' },
  progressBarBg: { height: 8, backgroundColor: '#334155', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#3b82f6' },
  preferencesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  prefItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  prefText: { color: '#fff', marginLeft: 8, fontSize: 14 },
  viewAll: { color: '#1E90FF', fontSize: 13 },
  reviewSummaryRow: { flexDirection: 'row', alignItems: 'center' },
  ratingBigBox: { backgroundColor: '#0f172a', padding: 16, borderRadius: 12, alignItems: 'center' },
  ratingBigText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  starsRow: { flexDirection: 'row', marginVertical: 4 },
  reviewCount: { color: '#64748b', fontSize: 10 },
  ratingBars: { flex: 1, marginLeft: 20 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  barNum: { color: '#64748b', fontSize: 12, width: 15 },
  barBg: { flex: 1, height: 4, backgroundColor: '#334155', borderRadius: 2, marginLeft: 8 },
  barFill: { height: '100%', backgroundColor: '#eab308', borderRadius: 2 },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  estimateLabel: { color: '#94a3b8', fontSize: 12 },
  priceText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  requestButton: {
    backgroundColor: '#1E90FF',
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center'
  },
  requestButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default CarrierProfile;