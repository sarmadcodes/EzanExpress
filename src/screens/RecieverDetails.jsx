import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../components/BackBar';

const ReceiverDetails = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [countryCode, setCountryCode] = useState('+1');

  const handleNextStep = () => {
    console.log('Receiver Info:', { fullName, countryCode, phone, email, address, notes });
    navigation?.navigate('ConfirmScreen'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor='#0B121C' />
      <View style={{paddingHorizontal:15}}>
       <BackBar title="Receiver's Details" />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.progressContainer}>
                    <View style={styles.progressInfo}>
                      <Text style={styles.stepText}>Step 2 of 3</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                      <View style={[styles.progressBarFill, { width: '66%' }]} />
                    </View>
            </View>

          <Text style={styles.mainTitle}>Who are we delivering this parcel to?</Text>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Receiver's Full Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter full name"
                placeholderTextColor="#64748b"
                value={fullName}
                onChangeText={setFullName}
              />
              <Ionicons name="person-circle-outline" size={22} color="#3b82f6" />
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.countryPicker}>
                <Text style={styles.countryText}>{countryCode}</Text>
                <Ionicons name="chevron-down" size={16} color="#94a3b8" />
              </TouchableOpacity>
              <View style={[styles.inputWrapper, { flex: 1, marginLeft: 12 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="(555) 000-0000"
                  placeholderTextColor="#64748b"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="john.doe@example.com"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <Ionicons name="mail-outline" size={20} color="#94a3b8" />
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Delivery Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-sharp" size={20} color="#94a3b8" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Street, City, Zip Code"
                placeholderTextColor="#64748b"
                value={address}
                onChangeText={setAddress}
              />
              <Ionicons name="locate-outline" size={20} color="#94a3b8" />
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={16} color="#64748b" />
              <Text style={styles.infoText}>We'll share this location with your carrier.</Text>
            </View>
          </View>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Notes to Carrier <Text style={{color: '#64748b'}}>(Optional)</Text></Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Gate code, landmark, or specific instructions..."
                placeholderTextColor="#64748b"
                multiline={true}
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNextStep} activeOpacity={0.8}>
          <Text style={styles.nextBtnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B121C' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  progressContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10
  },

  progressContainer: { marginBottom: 30 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  stepText: { color: '#1E90FF', fontSize: 12, fontWeight: 'bold' },
  stepName: { color: '#94a3b8', fontSize: 12 },
  progressBarBg: { height: 4, backgroundColor: '#1e293b', borderRadius: 2 },
  progressBarFill: { height: '100%', backgroundColor: '#1E90FF', borderRadius: 2 },
  mainTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 30, lineHeight: 36 },
  inputSection: { marginBottom: 20 },
  inputLabel: { color: '#94a3b8', fontSize: 14, marginBottom: 10, fontWeight: '500' },
  row: { flexDirection: 'row', alignItems: 'center' },
  inputWrapper: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#334155',
  },
  input: { flex: 1, color: '#fff', fontSize: 15 },
  countryPicker: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#334155',
    width: 90,
    justifyContent: 'space-between'
  },
  countryText: { color: '#fff', fontSize: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  infoText: { color: '#64748b', fontSize: 12, marginLeft: 6 },
  textAreaWrapper: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
    height: 120,
  },
  textArea: { color: '#fff', fontSize: 15, textAlignVertical: 'top' },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#0a101d',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  nextBtn: {
    backgroundColor: '#1E90FF',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default ReceiverDetails;
