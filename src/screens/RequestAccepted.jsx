import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';

const RequestAccepted = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a101d" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Success</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successWrapper}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Ionicons name="checkmark" size={60} color="#fff" />
            </View>
          </View>
        </View>

        <Text style={styles.mainTitle}>Request Accepted!</Text>
        <Text style={styles.subTitle}>
          You have successfully offered to carry this package. We've notified the sender.
        </Text>

        {/* Parcel Summary */}
        <View style={styles.parcelSummaryCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200',
            }}
            style={styles.parcelThumb}
          />
          <View style={styles.parcelInfo}>
            <View style={styles.destinationBadge}>
              <Text style={styles.destinationText}>To London</Text>
              <Text style={styles.idText}>#8392</Text>
            </View>
            <Text style={styles.parcelName}>Parcel Box</Text>
            <Text style={styles.parcelDetailsText}>
              Electronics • 0.5kg • Fragile
            </Text>
          </View>
        </View>

        {/* Steps */}
        <Text style={styles.nextStepsTitle}>Next Steps</Text>

        {/* STEP 1 */}
        <View style={styles.stepRow}>
          <View style={styles.timelineCol}>
            <View style={styles.iconCircleActive}>
              <Ionicons name="cash-outline" size={16} color="#fff" />
            </View>
            <View style={styles.timelineLine} />
          </View>

          <View style={styles.stepContent}>
            <Text style={styles.stepTitleActive}>Sender Confirms Payment</Text>
            <Text style={styles.stepStatusActive}>Waiting for action...</Text>
            <Text style={styles.stepDescription}>
              Once the sender pays the deposit, the chat will open.
            </Text>
          </View>
        </View>

        {/* STEP 2 */}
        <View style={styles.stepRow}>
          <View style={styles.timelineCol}>
            <View style={styles.iconCircleInactive}>
              <Ionicons name="chatbubbles-outline" size={16} color="#475569" />
            </View>
            <View style={styles.timelineLine} />
          </View>

          <View style={styles.stepContent}>
            <Text style={styles.stepTitleInactive}>Chat Opens</Text>
            <Text style={styles.stepStatusInactive}>Locked</Text>
          </View>
        </View>

        {/* STEP 3 */}
        <View style={styles.stepRow}>
          <View style={styles.timelineCol}>
            <View style={styles.iconCircleInactive}>
              <Ionicons name="hand-left-outline" size={16} color="#475569" />
            </View>
          </View>

          <View style={styles.stepContent}>
            <Text style={styles.stepTitleInactive}>Meet for Handover</Text>
            <Text style={styles.stepStatusInactive}>Locked</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation?.navigate('DeliveryConfirmation')}
        >
          <Text style={styles.primaryBtnText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation?.navigate('TravelerDashboard')}
        >
          <Text style={styles.secondaryBtnText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RequestAccepted;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a101d' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  successWrapper: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(59,130,246,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },

  mainTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subTitle: {
    color: '#94a3b8',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },

  parcelSummaryCard: {
    width: '100%',
    backgroundColor: '#161f31',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  parcelThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  parcelInfo: { flex: 1, marginLeft: 16 },
  destinationBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  destinationText: {
    color: '#1E90FF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  idText: { color: '#475569', fontSize: 12 },
  parcelName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  parcelDetailsText: { color: '#64748b', fontSize: 13 },

  nextStepsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  stepRow: {
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 20,
  },
  timelineCol: {
    alignItems: 'center',
    width: 40,
  },
  iconCircleActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleInactive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#1e293b',
    marginTop: 6,
  },
  stepContent: {
    flex: 1,
    marginLeft: 16,
  },
  stepTitleActive: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepStatusActive: {
    color: '#1E90FF',
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 4,
  },
  stepDescription: { color: '#64748b', fontSize: 13 },

  stepTitleInactive: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepStatusInactive: {
    color: '#475569',
    fontSize: 14,
    marginTop: 4,
  },

  footer: {
    padding: 24,
    backgroundColor: '#0a101d',
  },
  primaryBtn: {
    backgroundColor: '#1E90FF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
});
