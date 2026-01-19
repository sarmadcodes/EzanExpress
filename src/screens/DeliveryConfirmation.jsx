import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DeliveryConfirmation = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/[^0-9]/g, '');
    setOtp(newOtp);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const code = otp.join('');
    if (code.length < 4) {
      Alert.alert(
        'Invalid Code',
        'Please enter the 4-digit security code provided by the Sender.'
      );
      return;
    }

    Alert.alert(
      'Payment Successful',
      'The handover has been confirmed and funds have been released.',
      [
        {
          text: 'OK',
          onPress: () => navigation.replace('TravelerDashboard'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Handover</Text>
            <Ionicons name="help-circle-outline" size={24} color="#fff" />
          </View>

          <View style={styles.content}>
            <Text style={styles.mainTitle}>Confirm delivery</Text>
            <Text style={styles.subTitle}>
              You are meeting <Text style={styles.highlightText}>Sarah J.</Text> Ask
              for the 4-digit parcel code to complete the job.
            </Text>

            {/* Parcel Card */}
            <View style={styles.parcelCard}>
              <View>
                <View style={styles.tagContainer}>
                  <Text style={styles.parcelTag}>PARCEL</Text>
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
                <Text style={styles.parcelId}>#EZ-9928</Text>
                <Text style={styles.receiverLabel}>
                  Receiver: <Text style={styles.receiverName}>Sarah Jenkins</Text>
                </Text>
              </View>

              <Image
                source={require('../assets/globe.jpg')}
                style={styles.parcelImage}
              />
            </View>

            {/* OTP Section */}
            <View style={styles.otpSection}>
              <View style={styles.securityHeader}>
                <Ionicons name="lock-closed" size={16} color="#94a3b8" />
                <Text style={styles.securityTitle}>Enter Security Code</Text>
              </View>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(el) => (inputs.current[index] = el)}
                    style={[
                      styles.otpInput,
                      digit && styles.otpInputActive,
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(value) =>
                      handleOtpChange(value, index)
                    }
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    placeholder="-"
                    placeholderTextColor="#475569"
                  />
                ))}
              </View>
            </View>

            <View style={styles.releaseNotice}>
              <Ionicons name="cash-outline" size={16} color="#10b981" />
              <Text style={styles.releaseText}>
                Payment released upon confirmation
              </Text>
            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmBtnText}>
                  Confirm & Release Payment
                </Text>
                <View style={styles.checkIconBox}>
                  <Ionicons name="checkmark" size={16} color="#1E90FF" />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.issueBtn}>
                <Text style={styles.issueText}>
                  Receiver not here? Report an issue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DeliveryConfirmation;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a101d' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  content: { paddingHorizontal: 20 },

  mainTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subTitle: {
    color: '#94a3b8',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
  },
  highlightText: { color: '#1E90FF', fontWeight: 'bold' },

  parcelCard: {
    backgroundColor: '#161f31',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 32,
  },
  tagContainer: { flexDirection: 'row', marginBottom: 6 },
  parcelTag: {
    backgroundColor: 'rgba(59,130,246,0.2)',
    color: '#3b82f6',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  verifiedText: { color: '#94a3b8', fontSize: 12 },
  parcelId: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  receiverLabel: { color: '#94a3b8', marginTop: 6 },
  receiverName: { color: '#fff' },
  parcelImage: { width: 90, height: 90, borderRadius: 12 },

  otpSection: { alignItems: 'center', marginBottom: 24 },
  securityHeader: { flexDirection: 'row', marginBottom: 16 },
  securityTitle: { color: '#94a3b8', marginLeft: 8 },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  otpInput: {
    width: 70,
    height: 80,
    backgroundColor: '#161f31',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1e293b',
    color: '#fff',
    fontSize: 28,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  otpInputActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e293b',
  },

  releaseNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(16,185,129,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  releaseText: { color: '#10b981', marginLeft: 8 },

  footer: { marginTop: 20, marginBottom: 20 },

  confirmBtn: {
    backgroundColor: '#1E90FF',
    height: 60,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
  checkIconBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  issueBtn: { marginTop: 16, alignSelf: 'center' },
  issueText: { color: '#94a3b8' },
});
