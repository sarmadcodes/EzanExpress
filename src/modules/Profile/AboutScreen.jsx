import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../components/BackBar';

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor='#0B121C' />
      <View style={{paddingHorizontal:15}}>
        <BackBar title='About Ezan' />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* App Logo & Version Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logo1.jpg')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>Ezan Express</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#3b82f6" />
            <Text style={styles.verifiedText}>VERIFIED SECURE PLATFORM</Text>
          </View>
          <Text style={styles.versionText}>Version 1.2.0 (Build 452)</Text>
        </View>

        {/* Our Purpose Section */}
        <Text style={styles.sectionHeading}>Our Purpose</Text>
        <View style={styles.purposeCard}>
          <View style={styles.purposeItem}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Ionicons name="rocket" size={20} color="#3b82f6" />
            </View>
            <View style={styles.purposeTextContent}>
              <Text style={styles.itemTitle}>Mission</Text>
              <Text style={styles.itemDesc}>
                To democratize global logistics by seamlessly connecting international travelers with local senders.
              </Text>
            </View>
          </View>

          <View style={[styles.purposeItem, { marginTop: 20 }]}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
              <Ionicons name="globe" size={20} color="#a855f7" />
            </View>
            <View style={styles.purposeTextContent}>
              <Text style={styles.itemTitle}>Vision</Text>
              <Text style={styles.itemDesc}>
                A connected world where shipping a package globally is as easy and affordable as booking a flight.
              </Text>
            </View>
          </View>
        </View>

        {/* Core Values Section */}
        <Text style={styles.sectionHeading}>Core Values</Text>
        <View style={styles.valuesGrid}>
          <View style={styles.valueCard}>
            <View style={styles.valueIconBox}>
              <Ionicons name="checkmark-done-circle" size={24} color="#10b981" />
            </View>
            <Text style={styles.valueTitle}>Trust First</Text>
            <Text style={styles.valueDesc}>Verified carriers and 100% secure transactions.</Text>
          </View>

          <View style={styles.valueCard}>
            <View style={styles.valueIconBox}>
              <Ionicons name="airplane" size={24} color="#f97316" />
            </View>
            <Text style={styles.valueTitle}>Speed</Text>
            <Text style={styles.valueDesc}>Utilizing existing flight networks for rapid delivery.</Text>
          </View>
        </View>

        {/* Legal & Support Section */}
        {/* <Text style={styles.sectionHeading}>Legal & Support</Text>
        <View style={styles.legalList}>
          {['Terms of Service', 'Privacy Policy', 'Community Guidelines', 'Open Source Licenses'].map((item, index) => (
            <TouchableOpacity key={index} style={styles.legalItem}>
              <View style={styles.legalLeft}>
                <Ionicons 
                  name={
                    index === 0 ? "document-text-outline" : 
                    index === 1 ? "lock-closed-outline" : 
                    index === 2 ? "people-outline" : "code-slash-outline"
                  } 
                  size={20} 
                  color="#94a3b8" 
                />
                <Text style={styles.legalText}>{item}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#475569" />
            </TouchableOpacity>
          ))}
        </View> */}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.socialRow}>
            <Text style={styles.socialLink}>TWITTER</Text>
            <Text style={styles.socialLink}>LINKEDIN</Text>
            <Text style={styles.socialLink}>INSTAGRAM</Text>
          </View>
          <Text style={styles.copyright}>© 2023 Ezan Express Inc.</Text>
          <Text style={styles.rightsText}>All rights reserved.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B121C' },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: '#161f31',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    // Soft glow effect
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  logo: { width: 80, height: 80 },
  appName: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  verifiedText: { color: '#3b82f6', fontSize: 10, fontWeight: 'bold', marginLeft: 6 },
  versionText: { color: '#64748b', fontSize: 13, marginTop: 8 },
  sectionHeading: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16, marginTop: 10 },
  purposeCard: { backgroundColor: '#161f31', borderRadius: 20, padding: 20, marginBottom: 24 },
  purposeItem: { flexDirection: 'row' },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  purposeTextContent: { flex: 1, marginLeft: 16 },
  itemTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  itemDesc: { color: '#94a3b8', fontSize: 13, lineHeight: 20, marginTop: 4 },
  valuesGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  valueCard: { backgroundColor: '#161f31', width: '48%', borderRadius: 20, padding: 16 },
  valueIconBox: { marginBottom: 12 },
  valueTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  valueDesc: { color: '#64748b', fontSize: 11, marginTop: 6, lineHeight: 16 },
  legalList: { backgroundColor: '#161f31', borderRadius: 20, paddingVertical: 8, marginBottom: 40 },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  legalLeft: { flexDirection: 'row', alignItems: 'center' },
  legalText: { color: '#fff', fontSize: 14, marginLeft: 16 },
  footer: { alignItems: 'center' },
  socialRow: { flexDirection: 'row', marginBottom: 20 },
  socialLink: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginHorizontal: 12 },
  copyright: { color: '#475569', fontSize: 11 },
  rightsText: { color: '#475569', fontSize: 11, marginTop: 2 },
});

export default AboutScreen;