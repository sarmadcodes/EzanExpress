import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../components/BackBar';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpCenter = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('General');
  const [expandedId, setExpandedId] = useState(null);

  const articles = [
    { 
        id: 1, 
        title: 'How do I verify a traveler?', 
        icon: 'checkmark-circle', 
        color: '#1E90FF',
        content: 'To verify a traveler, check their profile for the "Verified ID" badge. You can also view their trip history and reviews from previous senders to ensure reliability.' 
    },
    { 
        id: 2, 
        title: 'What items are prohibited?', 
        icon: 'ban', 
        color: '#ef4444',
        content: 'Prohibited items include illegal substances, weapons, flammable materials, and certain perishable goods. Always check local customs regulations for both departure and arrival countries.' 
    },
    { 
        id: 3, 
        title: 'Insurance and liability coverage', 
        icon: 'shield-checkmark', 
        color: '#1E90FF',
        content: 'Ezan Express provides basic coverage for lost or damaged items. For high-value parcels, we recommend purchasing additional premium insurance during the request process.' 
    },
    { 
        id: 4, 
        title: 'When do I get paid?', 
        icon: 'cash', 
        color: '#10b981',
        content: 'Payment is released to the traveler once the receiver confirms the delivery in the app. This ensures a secure transaction for both parties.' 
    },
  ];

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const QuickAction = ({ icon, label }) => (
    <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
      <View style={styles.actionIconBox}>
        <Ionicons name={icon} size={22} color="#3b82f6" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{paddingHorizontal:15}}>
        <BackBar title='Help Center' />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainGreeting}>Hello! How can Ezan Express assist you today?</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={{ marginRight: 10 }} />
          <TextInput 
            placeholder="Search for answers..." 
            placeholderTextColor="#64748b"
            style={styles.searchInput}
          />
        </View>

        <Text style={styles.sectionHeading}>QUICK ACTIONS</Text>
        <View style={styles.actionRow}>
          <QuickAction icon="location" label="Track Order" />
          <QuickAction icon="warning" label="Report Issue" />
          <QuickAction icon="card" label="Payments" />
          <QuickAction icon="shield-checkmark" label="Safety" />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
          {['General', 'Sending', 'Traveling', 'Trust & Safety'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionHeading}>Popular Articles</Text>
        {articles.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.articleCard} 
            activeOpacity={0.9}
            onPress={() => toggleExpand(item.id)}
          >
            <View style={styles.articleHeader}>
              <Ionicons name={item.icon} size={20} color={item.color} />
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Ionicons 
                name={expandedId === item.id ? "chevron-up" : "chevron-forward"} 
                size={18} 
                color="#475569" 
              />
            </View>
            {expandedId === item.id && (
              <View style={styles.articleContent}>
                <Text style={styles.articleBody}>{item.content}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}


        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <Text style={styles.supportSub}>Our support team is available 24/7 to assist you with any issues.</Text>
          
          <TouchableOpacity style={styles.liveChatBtn} activeOpacity={0.8}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.liveChatText}>Start Live Chat</Text>
          </TouchableOpacity>

          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="mail" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.contactBtnText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="call" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.contactBtnText}>Phone</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionHeading}>New to Ezan?</Text>
        <View style={styles.footerCardsRow}>
            <TouchableOpacity style={[styles.guideCard, { backgroundColor: '#1e3a8a' }]}>
                <Text style={styles.guideType}>GUIDE</Text>
                <Text style={styles.guideTitle}>How to pack securely</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.guideCard, { backgroundColor: '#064e3b' }]}>
                <Text style={styles.guideType}>SAFETY</Text>
                <Text style={styles.guideTitle}>Verifying your carrier</Text>
            </TouchableOpacity>
        </View>

        <Text style={styles.appVersion}>App Version 2.4.1</Text>
        <View style={styles.footerLinks}>
            <Text style={styles.footerLinkText}>Terms of Service</Text>
            <Text style={styles.footerLinkText}>Privacy Policy</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a101d' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  historyText: { color: '#1E90FF', fontSize: 14 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  mainGreeting: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 24, lineHeight: 36 },
  searchContainer: { 
    backgroundColor: '#161f31', 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    height: 56,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 32
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 16 },
  sectionHeading: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 16, letterSpacing: 1 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  actionItem: { alignItems: 'center', width: '22%' },
  actionIconBox: { width: 52, height: 52, borderRadius: 12, backgroundColor: '#161f31', justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#1e293b' },
  actionLabel: { color: '#fff', fontSize: 11, textAlign: 'center' },
  tabContainer: { marginBottom: 32 },
  tab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: '#161f31', marginRight: 10, borderWidth: 1, borderColor: '#1e293b' },
  activeTab: { backgroundColor: '#1E90FF', borderColor: '#1E90FF' },
  tabText: { color: '#94a3b8', fontWeight: '600' },
  activeTabText: { color: '#fff' },
  articleCard: { backgroundColor: '#161f31', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 18, marginBottom: 12, borderWidth: 1, borderColor: '#1e293b' },
  articleHeader: { flexDirection: 'row', alignItems: 'center' },
  articleTitle: { flex: 1, color: '#fff', fontSize: 15, marginLeft: 12 },
  articleContent: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#1e293b' },
  articleBody: { color: '#94a3b8', fontSize: 14, lineHeight: 22 },
  viewAllBtn: { alignSelf: 'center', paddingVertical: 16, marginBottom: 32 },
  viewAllText: { color: '#3b82f6', fontWeight: 'bold' },
  supportCard: { backgroundColor: '#161f31', borderRadius: 20, padding: 20, marginBottom: 32, marginTop:18, borderWidth: 1, borderColor: '#1e293b' },
  supportTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  supportSub: { color: '#64748b', fontSize: 14, lineHeight: 20, marginBottom: 20 },
  liveChatBtn: { backgroundColor: '#1E90FF', height: 56, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  liveChatText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between' },
  contactBtn: { flex: 0.48, height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#1e293b', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  contactBtnText: { color: '#fff', fontWeight: '600' },
  footerCardsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  guideCard: { width: '48%', height: 140, borderRadius: 16, padding: 16, justifyContent: 'flex-end' },
  guideType: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  guideTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  appVersion: { textAlign: 'center', color: '#475569', fontSize: 12, marginTop: 40 },
  footerLinks: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  footerLinkText: { color: '#1E90FF', fontSize: 12, marginHorizontal: 10 }
});

export default HelpCenter;
