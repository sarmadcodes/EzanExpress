import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ConfirmationScreen = ({ navigation }) => {
  const requestData = {
    id: '#839201',
    item: 'Small Electronics Box',
    route: 'London (LHR) → NYC (JFK)',
    destination: 'New York',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor='#0B121C' />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Confirmation</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation?.navigate('SenderDashboard')}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.successCircle}>
          <View style={styles.iconBg}>
            <Ionicons name="checkmark-sharp" size={50} color="#fff" />
          </View>
        </View>

        <Text style={styles.mainTitle}>Request Sent Successfully!</Text>
        <Text style={styles.subTitle}>
          Your parcel request is live! We've broadcast it to verified travelers heading to <Text style={{fontWeight: 'bold', color: '#fff'}}>{requestData.destination}</Text>.
        </Text>

        <View style={styles.summaryCard}>
          <View style={styles.cardInfo}>
            <View style={styles.statusBadge}>
              <Ionicons name="hourglass-outline" size={12} color="#f97316" />
              <Text style={styles.statusText}>Pending Match</Text>
            </View>

            <Text style={styles.requestId}>ID {requestData.id}</Text>
            <Text style={styles.itemTitle}>{requestData.item}</Text>

            <View style={styles.routeRow}>
              <Ionicons name="airplane" size={16} color="#94a3b8" />
              <Text style={styles.routeText}>{requestData.route}</Text>
            </View>
          </View>

          <View style={[styles.mapThumbnail, styles.routeThumb]}>
            <Ionicons name="map-outline" size={26} color="#3b82f6" />
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoIconBg}>
            <Ionicons name="time" size={20} color="#3b82f6" />
          </View>
          <View style={styles.infoTextContent}>
            <Text style={styles.infoTitle}>What happens next?</Text>
            <Text style={styles.infoDesc}>
              Most requests are matched within <Text style={{color: '#fff', fontWeight: 'bold'}}>2-4 hours</Text>. You will be notified instantly when a verified carrier accepts the job.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.7}
          onPress={() => navigation?.navigate('SenderDashboard')}
        >
          <Text style={styles.secondaryBtnText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  routeThumb: {
    backgroundColor: '#13203045',
    borderWidth: 1,
    borderColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E90FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  mainTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subTitle: {
    color: '#94a3b8',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#161f31',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardInfo: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  statusText: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  requestId: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemTitle: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeText: {
    color: '#94a3b8',
    fontSize: 13,
    marginLeft: 8,
  },
  mapThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#1e293b',
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  infoIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
  },
  infoTextContent: {
    flex: 1,
    marginLeft: 4,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoDesc: {
    color: '#64748b',
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  primaryBtn: {
    backgroundColor: '#1E90FF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    backgroundColor: '#161f31',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  secondaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ConfirmationScreen;
