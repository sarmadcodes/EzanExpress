import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RequestRejected = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
      </View>

      <View style={styles.content}>
        {/* Decline Icon with Dotted Border */}
        <View style={styles.iconContainer}>
          <View style={styles.dottedCircle}>
            <View style={styles.innerCircle}>
              <Ionicons name="ban-outline" size={40} color="#94a3b8" />
            </View>
          </View>
        </View>

        {/* Text Information */}
        <Text style={styles.mainTitle}>Request Declined</Text>
        <Text style={styles.subTitle}>
          This shipment has been removed from your list. We will find another carrier for this package.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        {/* <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={() => navigation?.navigate('ExploreRequests')} // Navigates back to finding carriers
        >
          <Text style={styles.primaryBtnText}>View Other Requests</Text>
        </TouchableOpacity> */}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C', // Matching dark theme
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  dottedCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#1e293b',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#161f31',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subTitle: {
    color: '#94a3b8',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  primaryBtn: {
    backgroundColor: '#1E90FF', // Standard blue action color
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

export default RequestRejected;