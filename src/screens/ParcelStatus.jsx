import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../components/BackBar';

const ParcelStatus = ({ navigation }) => {
  const data = {
    requestId: '#1024',
    expiry: { hours: '01', mins: '59', secs: '30' },
    carrier: {
      name: 'Sarah J.',
      rating: '4.9',
      trips: '24',
      image: 'https://i.pravatar.cc/150?u=sarahj',
      flight: 'BA149',
      date: 'Oct 24',
      from: 'LHR',
      fromCity: 'London',
      to: 'JFK',
      toCity: 'New York'
    },
    summary: {
      weight: '2.5 kg',
      dimensions: '15 × 20 × 10 cm',
      type: 'Electronics',
      price: '$45.00'
    }
  };

  const TimerBlock = ({ value, label }) => (
    <View style={styles.timerBlockContainer}>
      <View style={styles.timerBox}>
        <Text style={styles.timerValue}>{value}</Text>
      </View>
      <Text style={styles.timerLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor='#0B121C' />
      <View>
        <BackBar title='Request #0001' />
      </View>
    
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.successSection}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={30} color="#fff" />
          </View>
          <Text style={styles.statusTitle}>Request Accepted!</Text>
          <Text style={styles.statusSub}>Great news, a carrier has accepted your offer.</Text>
        </View>

        <View style={styles.expiryCard}>
          <View style={styles.expiryHeader}>
            <View style={styles.expiryLeft}>
              <Ionicons name="alarm-outline" size={20} color="#f97316" />
              <Text style={styles.expiryTitle}>Payment Expiry</Text>
            </View>
            <Text style={styles.secureSlotText}>Secure your slot</Text>
          </View>
          
          <View style={styles.timerRow}>
            <TimerBlock value={data.expiry.hours} label="HOURS" />
            <Text style={styles.timerDivider}>:</Text>
            <TimerBlock value={data.expiry.mins} label="MINS" />
            <Text style={styles.timerDivider}>:</Text>
            <TimerBlock value={data.expiry.secs} label="SECS" />
          </View>
        </View>

        <View style={styles.carrierCard}>
          <View style={styles.carrierMain}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: data.carrier.image }} style={styles.avatar} />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#1E90FF" />
              </View>
            </View>
            <Text style={styles.carrierName}>{data.carrier.name}</Text>
            <View style={styles.carrierStats}>
              <Ionicons name="star" size={14} color="#eab308" />
              <Text style={styles.statsText}>{data.carrier.rating}  •  {data.carrier.trips} Trips</Text>
            </View>
          </View>

          <View style={styles.routeRow}>
            <View style={styles.routePoint}>
              <Text style={styles.label}>From</Text>
              <Text style={styles.cityCode}>{data.carrier.from}</Text>
              <Text style={styles.cityName}>{data.carrier.fromCity}</Text>
            </View>
            
            <View style={styles.visualFlight}>
              <View style={styles.flightLine} />
              <Ionicons name="airplane" size={16} color="#1E90FF" style={styles.flightIcon} />
              <Text style={styles.flightNo}>{data.carrier.flight}</Text>
              <Text style={styles.flightDate}>{data.carrier.date}</Text>
            </View>

            <View style={[styles.routePoint, { alignItems: 'flex-end' }]}>
              <Text style={styles.label}>To</Text>
              <Text style={styles.cityCode}>{data.carrier.to}</Text>
              <Text style={styles.cityName}>{data.carrier.toCity}</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryHeading}>Request Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Parcel Weight</Text>
            <Text style={styles.summaryValue}>{data.summary.weight}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Dimensions</Text>
            <Text style={styles.summaryValue}>{data.summary.dimensions}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Content Type</Text>
            <Text style={styles.summaryValue}>{data.summary.type}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Agreed Price</Text>
            <Text style={styles.priceValue}>{data.summary.price}</Text>
          </View>
        </View>

        <View style={styles.stepIndicator}>
            <View style={[styles.stepDot, styles.stepDone]}><Ionicons name="checkmark" size={10} color="#fff" /></View>
            <View style={styles.stepLineActive} />
            <View style={[styles.stepDot, styles.stepActive]}><View style={styles.dotInner} /></View>
            <View style={styles.stepLineInactive} />
            <View style={styles.stepDotInactive} />
            <View style={styles.stepLineInactive} />
            <View style={styles.stepDotInactive} />
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation?.navigate('PaymentMethod')}
        >
          <Ionicons name="cash-outline" size={20} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.primaryBtnText}>Proceed to Payment</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B121C' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 16, paddingBottom: 120 },
  
  successSection: { alignItems: 'center', marginVertical: 18 },
  checkCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#064e3b', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  statusTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  statusSub: { color: '#94a3b8', fontSize: 14 },

  expiryCard: { backgroundColor: '#161f31', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#1e293b' },
  expiryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  expiryLeft: { flexDirection: 'row', alignItems: 'center' },
  expiryTitle: { color: '#fff', fontSize: 15, fontWeight: '600', marginLeft: 8 },
  secureSlotText: { color: '#64748b', fontSize: 12 },
  timerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  timerBlockContainer: { alignItems: 'center' },
  timerBox: { width: 50, height: 50, backgroundColor: '#1e293b', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#3b82f6' },
  timerValue: { color: '#1E90FF', fontSize: 20, fontWeight: 'bold' },
  timerLabel: { color: '#475569', fontSize: 10, marginTop: 8, fontWeight: 'bold' },
  timerDivider: { color: '#475569', fontSize: 24, marginHorizontal: 10, paddingBottom: 20 },

  carrierCard: { backgroundColor: '#161f31', borderRadius: 16, padding: 20, marginBottom: 16 },
  carrierMain: { alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#1e293b', paddingBottom: 20, marginBottom: 20 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: 10 },
  carrierName: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  carrierStats: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  statsText: { color: '#94a3b8', fontSize: 14, marginLeft: 6 },
  
  routeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routePoint: { flex: 1 },
  label: { color: '#475569', fontSize: 12, marginBottom: 4 },
  cityCode: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  cityName: { color: '#94a3b8', fontSize: 12 },
  visualFlight: { flex: 1.5, alignItems: 'center' },
  flightLine: { height: 2, backgroundColor: '#1e293b', width: '100%', position: 'absolute', top: 10 },
  flightIcon: { backgroundColor: '#161f31', paddingHorizontal: 8 },
  flightNo: { color: '#1E90FF', fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  flightDate: { color: '#475569', fontSize: 11 },

  summaryCard: { backgroundColor: '#161f31', borderRadius: 16, padding: 16, marginBottom: 24 },
  summaryHeading: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  summaryLabel: { color: '#94a3b8', fontSize: 14 },
  summaryValue: { color: '#fff', fontSize: 14, fontWeight: '600' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#1e293b' },
  priceLabel: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  priceValue: { color: '#1E90FF', fontSize: 22, fontWeight: 'bold' },

  stepIndicator: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  stepDot: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  stepDotInactive: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#1e293b' },
  stepDone: { backgroundColor: '#1E90FF' },
  stepActive: { borderWidth: 2, borderColor: '#3b82f6', backgroundColor: '#0a101d' },
  dotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3b82f6' },
  stepLineActive: { height: 2, width: 60, backgroundColor: '#1E90FF' },
  stepLineInactive: { height: 2, width: 60, backgroundColor: '#1e293b' },

  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#0a101d', padding: 16, borderTopWidth: 1, borderTopColor: '#1e293b' },
  primaryBtn: { backgroundColor: '#1E90FF', height: 56, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: { backgroundColor: '#161f31', height: 56, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  secondaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});

export default ParcelStatus;
