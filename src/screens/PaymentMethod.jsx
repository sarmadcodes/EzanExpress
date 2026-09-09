import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PaymentMethod = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState('card_4242');

  const PaymentItem = ({ id, icon, title, subtitle, type = 'card' }) => {
    const isSelected = selectedMethod === id;

    return (
      <TouchableOpacity
        style={[styles.paymentCard, isSelected && styles.selectedCard]}
        onPress={() => setSelectedMethod(id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardLeft}>
          <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
            {isSelected && <View style={styles.radioInner} />}
          </View>
          <View style={styles.iconContainer}>
            {type === 'card' ? (
              <Ionicons name={icon} size={28} color={id.includes('visa') ? '#1a1f71' : '#eb001b'} />
            ) : (
              <Ionicons name={icon} size={24} color="#fff" />
            )}
          </View>
          <View>
            <Text style={styles.methodTitle}>{title}</Text>
            <Text style={styles.methodSubtitle}>{subtitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryInfo}>
            <Text style={styles.amountLabel}>TOTAL AMOUNT</Text>
            <Text style={styles.amountValue}>$45.00</Text>
            <View style={styles.routeRow}>
              <Ionicons name="airplane" size={14} color="#94a3b8" />
              <Text style={styles.routeText}>NYC → LON</Text>
            </View>
          </View>
          <View style={[styles.mapThumb, styles.routeThumb]}>
            <Ionicons name="map-outline" size={24} color="#3b82f6" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Saved Cards</Text>
        <PaymentItem
          id="card_4242"
          icon="credit-card"
          title="Visa ending in 4242"
          subtitle="Expires 12/25"
        />
        <PaymentItem
          id="card_8899"
          icon="credit-card"
          title="Mastercard ending in 8899"
          subtitle="Expires 09/26"
        />

        <TouchableOpacity style={styles.addCardBtn}>
          <Ionicons name="add-circle" size={20} color="#3b82f6" />
          <Text style={styles.addCardText}>Add New Card</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Digital Wallets</Text>
        <PaymentItem
          id="apple_pay"
          icon="logo-apple"
          type="wallet"
          title="Apple Pay"
          subtitle="Easy & Secure"
        />
        <PaymentItem
          id="google_pay"
          icon="logo-google"
          type="wallet"
          title="Google Pay"
          subtitle="Fast checkout"
        />
        <PaymentItem
          id="paypal"
          icon="logo-paypal"
          type="wallet"
          title="PayPal"
          subtitle="Pay with your balance"
        />

        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={14} color="#64748b" />
          <Text style={styles.securityText}>Transactions are encrypted and secured.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => navigation?.navigate('PaymentSuccess')}
        >
          <Text style={styles.payBtnText}>Proceed to Pay</Text>
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
  container: { flex: 1, backgroundColor: '#0a101d' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20, paddingBottom: 100 },

  summaryCard: { backgroundColor: '#161f31', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  amountLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  amountValue: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginVertical: 4 },
  routeRow: { flexDirection: 'row', alignItems: 'center' },
  routeText: { color: '#94a3b8', fontSize: 14, marginLeft: 6 },
  mapThumb: { width: 80, height: 80, borderRadius: 12 },

  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16, marginTop: 10 },
  paymentCard: {
    backgroundColor: '#161f31',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selectedCard: { borderColor: '#1E90FF', backgroundColor: '#1e293b' },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#475569', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  radioOuterSelected: { borderColor: '#1E90FF' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3b82f6' },
  iconContainer: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#0a101d', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  methodTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
  methodSubtitle: { color: '#64748b', fontSize: 13, marginTop: 2 },

  addCardBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginTop: 4, marginBottom: 24 },
  addCardText: { color: '#1E90FF', fontWeight: 'bold', marginLeft: 8 },

  securityNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  securityText: { color: '#64748b', fontSize: 13, marginLeft: 8 },

  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#0a101d' },
  payBtn: { backgroundColor: '#1E90FF', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default PaymentMethod;
