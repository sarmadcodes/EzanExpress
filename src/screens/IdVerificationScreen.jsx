import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const IdVerificationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity Verification</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={styles.imagePlaceholder}>
             <View style={styles.shieldCircle}>
                <Text style={{fontSize: 50}}>🛡️</Text>
             </View>
          </View>
        </View>

        <View style={styles.textSection}>
          <Text style={styles.mainTitle}>Let's get you verified</Text>
          <Text style={styles.description}>
            To ensure the safety of every package and passenger on Ezan Express, 
            we need to verify who you are. Verified carriers get access to more 
            gigs and higher payouts.
          </Text>
        </View>

        <View style={styles.requirementsContainer}>
          <Text style={styles.listLabel}>WHAT YOU WILL NEED</Text>
          
          <View style={styles.listItem}>
            <View style={styles.iconCircle}>
               <Text style={styles.innerIcon}>🪪</Text>
            </View>
            <View style={styles.listTextContent}>
              <Text style={styles.itemTitle}>Government-issued ID</Text>
              <Text style={styles.itemSub}>Passport or Driver's License</Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <View style={styles.iconCircle}>
               <Text style={styles.innerIcon}>😊</Text>
            </View>
            <View style={styles.listTextContent}>
              <Text style={styles.itemTitle}>Take a Selfie</Text>
              <Text style={styles.itemSub}>For facial matching verification</Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <View style={styles.iconCircle}>
               <Text style={styles.innerIcon}>☀️</Text>
            </View>
            <View style={styles.listTextContent}>
              <Text style={styles.itemTitle}>Good Lighting</Text>
              <Text style={styles.itemSub}>Ensure your face is clearly visible</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.securityNote}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.securityText}>Your data is encrypted and secure</Text>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start Verification</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 60,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  backArrow: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  imagePlaceholder: {
    width: width * 0.6,
    height: width * 0.5,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  requirementsContainer: {
    marginTop: 10,
  },
  listLabel: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  innerIcon: {
    fontSize: 20,
  },
  listTextContent: {
    flex: 1,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  itemSub: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  securityText: {
    color: '#64748B',
    fontSize: 13,
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IdVerificationScreen;
