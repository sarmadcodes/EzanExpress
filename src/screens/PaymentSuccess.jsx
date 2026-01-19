import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PaymentConfirmation = ({ navigation }) => {
  // Data matching the design
  const paymentData = {
    total: '$145.50',
    breakdown: [
      { label: 'Delivery to London', value: '$120.00', icon: 'package-variant-closed' },
      { label: 'Service Fee', value: '$20.00', icon: 'text-box-check-outline' },
      { label: 'Tax', value: '$5.50', icon: 'bank-outline' },
    ],
    method: {
      type: 'Mastercard ending...',
      expiry: 'Expires 12/25',
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Confirmation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Total Amount Header */}
        <View style={styles.amountSection}>
          <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.totalValue}>{paymentData.total}</Text>
        </View>

        {/* Breakdown Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Breakdown</Text>
          {paymentData.breakdown.map((item, index) => (
            <View 
              key={index} 
              style={[
                styles.breakdownRow, 
                index !== paymentData.breakdown.length - 1 && styles.borderBottom
              ]}
            >
              <View style={styles.rowLeft}>
                <Ionicons name={item.icon} size={20} color="#94a3b8" />
                <Text style={styles.itemLabel}>{item.label}</Text>
              </View>
              <Text style={styles.itemValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Selected Method Card */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.card}>
          <View style={styles.methodRow}>
            <View style={styles.methodLeft}>
              <View style={styles.methodIconBox}>
                <Ionicons name="credit-card" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.methodName}>{paymentData.method.type}</Text>
                <Text style={styles.methodExpiry}>{paymentData.method.expiry}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation?.goBack()}>
              <Text style={styles.changeBtn}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Escrow/Security Notice */}
        <View style={styles.securityCard}>
          <View style={styles.securityHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#3b82f6" />
            <Text style={styles.securityTitle}>Secure Transaction</Text>
          </View>
          <Text style={styles.securityText}>
            Your payment is held in secure escrow until the delivery is successfully verified by the recipient.
          </Text>
          <Text style={styles.encryptionText}>256-bit SSL Encryption</Text>
        </View>
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.confirmBtn}
          onPress={() => navigation?.navigate('PaymentSuccess')}
        >
          <Text style={styles.confirmBtnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelBtn}
          onPress={() => navigation?.navigate('PaymentSlip')}
        >
          <Text style={styles.cancelBtnText}>View Reciept</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a101d' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20, paddingBottom: 150 },
  
  amountSection: { alignItems: 'center', marginVertical: 32 },
  totalLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  totalValue: { color: '#fff', fontSize: 48, fontWeight: 'bold', marginTop: 8 },

  card: { backgroundColor: '#161f31', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#1e293b' },
  cardHeading: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#1e293b' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  itemLabel: { color: '#fff', fontSize: 14, marginLeft: 12 },
  itemValue: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  methodRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  methodLeft: { flexDirection: 'row', alignItems: 'center' },
  methodIconBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#0a101d', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  methodName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  methodExpiry: { color: '#64748b', fontSize: 12, marginTop: 2 },
  changeBtn: { color: '#3b82f6', fontWeight: 'bold', fontSize: 14 },

  securityCard: { backgroundColor: 'rgba(59, 130, 246, 0.05)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.1)' },
  securityHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  securityTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginLeft: 10 },
  securityText: { color: '#94a3b8', fontSize: 13, lineHeight: 20 },
  encryptionText: { color: '#475569', fontSize: 11, marginTop: 8 },

  footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, backgroundColor: '#0a101d' },
  confirmBtn: { backgroundColor: '#2563eb', height: 56, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cancelBtn: { marginTop: 16, alignSelf: 'center' },
  cancelBtnText: { color: '#ef4444', fontSize: 15, fontWeight: '600' }
});

export default PaymentConfirmation;