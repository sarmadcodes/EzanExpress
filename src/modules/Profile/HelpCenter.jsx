import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../components/BackBar';
import {
  TERMS_URL,
  PRIVACY_URL,
  SUPPORT_EMAIL,
  SUPPORT_URL,
} from '../../constant/API';

const openLink = async url => {
  try {
    await Linking.openURL(url);
  } catch (err) {
    Alert.alert(
      'Unable to open link',
      'Please check your internet connection and try again.',
    );
  }
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HelpCenter = ({ navigation }) => {
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
        content: "Any liability for loss or damage is subject to Ezan Express's Terms & Conditions. Please view our ",
        linkLabel: 'Terms & Conditions',
        linkUrl: TERMS_URL,
        contentAfterLink: '.' 
    },
    { 
        id: 4, 
        title: 'When do I get paid?', 
        icon: 'cash', 
        color: '#10b981',
        content: 'Payment is released to the traveler once the receiver confirms the delivery in the app. This ensures a secure transaction for both parties.' 
    },
    {
        id: 5,
        title: 'How do I report or block someone?',
        icon: 'flag',
        color: '#ef4444',
        content: 'Open the profile or the request, tap the menu in the top right, then choose Report or Block. Our team reviews every report, and blocking means neither of you can see or contact the other. You can manage your blocked list in Profile, under Blocked Users.'
    },
  ];

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{paddingHorizontal:15}}>
        <BackBar title='Help Center' />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainGreeting}>Hello! How can Ezan Express assist you today?</Text>

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
                <Text style={styles.articleBody}>
                  {item.content}
                  {item.linkLabel ? (
                    <Text
                      style={styles.inlineLink}
                      accessibilityRole="link"
                      onPress={() => openLink(item.linkUrl)}>
                      {item.linkLabel}
                    </Text>
                  ) : null}
                  {item.contentAfterLink || ''}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}


        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <Text style={styles.supportSub}>
            Email our support team and we will get back to you.
          </Text>

          <TouchableOpacity
            style={styles.liveChatBtn}
            activeOpacity={0.8}
            accessibilityRole="button"
            onPress={() => openLink(`mailto:${SUPPORT_EMAIL}`)}
          >
            <Ionicons name="mail" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.liveChatText}>Email Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactBtn}
            activeOpacity={0.8}
            accessibilityRole="link"
            onPress={() => openLink(SUPPORT_URL)}
          >
            <Ionicons name="help-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.contactBtnText}>Visit Help Centre</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.appVersion}>App Version 1.0</Text>
        <View style={styles.footerLinks}>
            <TouchableOpacity
              accessibilityRole="link"
              onPress={() => openLink(TERMS_URL)}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Text style={styles.footerLinkText}>Terms & Conditions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="link"
              onPress={() => openLink(PRIVACY_URL)}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Text style={styles.footerLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
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
  footerLinkText: { color: '#1E90FF', fontSize: 12, marginHorizontal: 10 },
  inlineLink: { color: '#1E90FF', textDecorationLine: 'underline' }
});

export default HelpCenter;
