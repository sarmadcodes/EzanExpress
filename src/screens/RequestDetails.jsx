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

const RequestDetails = ({ navigation }) => {
  // Mock data for the specific parcel request
  const request = {
    reward: '$150.00',
    type: 'PARCEL',
    from: 'NYC',
    fromFull: 'New York',
    to: 'LON',
    toFull: 'London',
    duration: '6h 30m',
    deliverBy: 'Oct 24, 2023 • Before 8:00 PM',
    category: 'Electronics',
    weight: '2.5 kg',
    size: '20x10x5',
    qty: '1 Item',
    senderNote: "This is a new pair of headphones in original packaging. It's fragile, so please keep it in your carry-on luggage.",
    sender: {
      name: 'Sarah Jenkins',
      rating: '4.8',
      reviews: '12',
      image: 'https://i.pravatar.cc/150?u=sarah'
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor='#0B121C' />
      <View style={{paddingHorizontal:15}}>
        <BackBar title='Request Details' />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Reward & Route Card */}
        <View style={styles.topCard}>
          <View style={styles.rewardRow}>
            <View>
              <Text style={styles.rewardLabel}>Guaranteed Reward</Text>
              <Text style={styles.rewardValue}>{request.reward}</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{request.type}</Text>
            </View>
          </View>

          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <Text style={styles.cityCode}>{request.from}</Text>
              <Text style={styles.cityName}>{request.fromFull}</Text>
            </View>
            
            <View style={styles.visualRoute}>
              <View style={styles.line} />
              <View style={styles.planeCircle}>
                <Ionicons name="airplane" size={16} color="#3b82f6" />
              </View>
              <View style={styles.line} />
              <Text style={styles.durationText}>{request.duration}</Text>
            </View>

            <View style={[styles.routePoint, { alignItems: 'flex-end' }]}>
              <Text style={styles.cityCode}>{request.to}</Text>
              <Text style={styles.cityName}>{request.toFull}</Text>
            </View>
          </View>

          <View style={styles.deliveryInfo}>
            <Ionicons name="calendar" size={18} color="#3b82f6" />
            <View style={styles.deliveryTextCol}>
              <Text style={styles.deliveryLabel}>Deliver by</Text>
              <Text style={styles.deliveryDate}>{request.deliverBy}</Text>
            </View>
          </View>
        </View>

        {/* Parcel Information Section */}
        <Text style={styles.sectionHeading}>Parcel Information</Text>
        <View style={styles.parcelCard}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1589939705384-5185138a04b9?q=80&w=500' }} 
              style={styles.parcelImage} 
            />
            <View style={styles.categoryBadge}>
              <Ionicons name="briefcase" size={12} color="#fff" />
              <Text style={styles.categoryText}>{request.category}</Text>
            </View>
          </View>

          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Ionicons name="barbell-outline" size={18} color="#94a3b8" />
              <Text style={styles.specLabel}>Weight</Text>
              <Text style={styles.specValue}>{request.weight}</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Ionicons name="layers-outline" size={18} color="#94a3b8" />
              <Text style={styles.specLabel}>Size</Text>
              <Text style={styles.specValue}>{request.size}</Text>
            </View>
            <View style={styles.specDivider} />
            <View style={styles.specItem}>
              <Ionicons name="cube-outline" size={18} color="#94a3b8" />
              <Text style={styles.specLabel}>Qty</Text>
              <Text style={styles.specValue}>{request.qty}</Text>
            </View>
          </View>

          <View style={styles.noteSection}>
            <Text style={styles.noteLabel}>Note from sender:</Text>
            <Text style={styles.noteText}>"{request.senderNote}"</Text>
          </View>
        </View>

        {/* Route Map Section */}
        <Text style={styles.sectionHeading}>Route Map</Text>
        <View style={styles.mapContainer}>
          <Image 
            source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/pin-s-a+285A98(-74.006,40.7128),pin-s-b+ba3333(-0.1276,51.5072)/-37.0,46.0,2/600x300?access_token=YOUR_TOKEN' }} 
            style={styles.mapImage}
          />
          <View style={styles.mapBadgeRow}>
             <View style={styles.mapLocBadge}>
                <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
                <Text style={styles.mapLocText}>JFK</Text>
             </View>
             <View style={[styles.mapLocBadge, { marginLeft: 8 }]}>
                <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
                <Text style={styles.mapLocText}>LHR</Text>
             </View>
          </View>
        </View>

        {/* Sender Details */}
        <Text style={styles.sectionHeading}>Sender Details</Text>
        <View style={styles.senderCard}>
          <Image source={{ uri: request.sender.image }} style={styles.senderAvatar} />
          <View style={styles.senderInfo}>
            <Text style={styles.senderName}>{request.sender.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#eab308" />
              <Text style={styles.ratingText}>{request.sender.rating} ({request.sender.reviews} Reviews)</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.msgBtn}>
            <Ionicons name="chatbubble" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Warning Box */}
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={24} color="#eab308" />
          <Text style={styles.warningText}>
            Please ensure you verify the contents of the package upon pickup. Do not accept sealed items without inspection.
          </Text>
        </View>

      </ScrollView>

      {/* Sticky Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('RequestRejected')}
        style={styles.rejectBtn}>
          <Text style={styles.rejectBtnText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('RequestAccepted')}
        style={styles.acceptBtn}>
          <Text style={styles.acceptBtnText}>Accept Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B121C' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  topCard: { backgroundColor: '#161f31', borderRadius: 20, padding: 20, marginBottom: 24 },
  rewardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  rewardLabel: { color: '#94a3b8', fontSize: 13 },
  rewardValue: { color: '#1E90FF', fontSize: 32, fontWeight: 'bold', marginTop: 4 },
  typeBadge: { backgroundColor: 'rgba(59, 130, 246, 0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  typeBadgeText: { color: '#1E90FF', fontSize: 12, fontWeight: 'bold' },
  routeContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  routePoint: { flex: 1 },
  cityCode: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  cityName: { color: '#94a3b8', fontSize: 13, marginTop: 4 },
  visualRoute: { flex: 2, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', position: 'relative' },
  line: { flex: 1, height: 1, backgroundColor: '#334155' },
  planeCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', marginHorizontal: 8 },
  durationText: { position: 'absolute', bottom: -18, color: '#64748b', fontSize: 11 },
  deliveryInfo: { backgroundColor: '#0f172a', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center' },
  deliveryTextCol: { marginLeft: 12 },
  deliveryLabel: { color: '#64748b', fontSize: 11 },
  deliveryDate: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  sectionHeading: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  parcelCard: { backgroundColor: '#161f31', borderRadius: 20, overflow: 'hidden', marginBottom: 24 },
  imageContainer: { height: 180, position: 'relative' },
  parcelImage: { width: '100%', height: '100%' },
  categoryBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  categoryText: { color: '#fff', fontSize: 12, marginLeft: 6 },
  specsGrid: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  specItem: { flex: 1, padding: 16, alignItems: 'center' },
  specDivider: { width: 1, backgroundColor: '#1e293b' },
  specLabel: { color: '#64748b', fontSize: 11, marginVertical: 4 },
  specValue: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  noteSection: { padding: 16 },
  noteLabel: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  noteText: { color: '#94a3b8', fontSize: 14, lineHeight: 20 },
  mapContainer: { height: 160, borderRadius: 20, overflow: 'hidden', marginBottom: 24, position: 'relative' },
  mapImage: { width: '100%', height: '100%' },
  mapBadgeRow: { position: 'absolute', bottom: 12, left: 12, flexDirection: 'row' },
  mapLocBadge: { backgroundColor: '#000', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  mapLocText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  senderCard: { backgroundColor: '#161f31', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  senderAvatar: { width: 50, height: 50, borderRadius: 25 },
  senderInfo: { flex: 1, marginLeft: 12 },
  senderName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { color: '#94a3b8', fontSize: 13, marginLeft: 4 },
  msgBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  warningBox: { backgroundColor: 'rgba(234, 163, 8, 0.1)', borderRadius: 12, padding: 16, flexDirection: 'row', borderWidth: 1, borderColor: 'rgba(234, 163, 8, 0.3)', marginBottom: 20 },
  warningText: { color: '#eab308', fontSize: 13, flex: 1, marginLeft: 12, lineHeight: 18 },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#0a101d', padding: 16, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#1e293b' },
  rejectBtn: { flex: 1, height: 52, borderRadius: 12, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rejectBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  acceptBtn: { flex: 2, height: 52, borderRadius: 12, backgroundColor: '#1E90FF', justifyContent: 'center', alignItems: 'center' },
  acceptBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default RequestDetails;