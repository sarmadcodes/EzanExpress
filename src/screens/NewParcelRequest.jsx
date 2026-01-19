import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../components/BackBar';

const PARCEL_TYPES = [
  'Medicine', 'Electronics', 'Books', 'Cultural foods', 
  'Cultural goods', 'Clothes', 'Spareparts', 'Stationaries', 'Others'
];

const POPULAR_DESTINATIONS = [
  { id: '1', name: 'New York', icon: 'business' },
  { id: '2', name: 'Dubai', icon: 'sunny' },
  { id: '3', name: 'Paris', icon: 'rose' },
  { id: '4', name: 'London', icon: 'boat' },
];

const NewParcelRequest = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [itemType, setItemType] = useState('Parcel'); // 'Document' or 'Parcel'
  const [selectedParcelTypes, setSelectedParcelTypes] = useState([]);
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState(0);
  const [destination, setDestination] = useState('');

  // Logic: Automatic Price Determination based on Weight
  useEffect(() => {
    const w = parseFloat(weight);
    if (!w) {
      setPrice(0);
      return;
    }
    if (itemType === 'Document') {
      // Example logic: £13 for docs up to 500g
      setPrice(13);
    } else {
      // Example logic: £38 for 8kg, or £4.75 per kg
      setPrice(Math.round(w * 4.75));
    }
  }, [weight, itemType]);

  const toggleParcelType = (type) => {
    if (selectedParcelTypes.includes(type)) {
      setSelectedParcelTypes(selectedParcelTypes.filter(t => t !== type));
    } else {
      setSelectedParcelTypes([...selectedParcelTypes, type]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor='#0B121C' />
      <View style={{paddingHorizontal:15}}>
      <BackBar title='New Parcel request' />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.stepText}>Step {step} of 3</Text>
            {/* <Text style={styles.stepName}>Details & Destination</Text> */}
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '33%' }]} />
          </View>
        </View>

        {/* <Text style={styles.mainTitle}>Where is this package going?</Text>
        <Text style={styles.subTitle}>
          We connect you with verified travelers heading to your destination.
        </Text> */}

        {/* <View style={styles.badgeRow}>
          <View style={styles.secureBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#10b981" />
            <Text style={styles.secureText}>Secure & Verified Carriers</Text>
          </View>
        </View> */}

        {/* --- CUSTOM PARCEL DETAILS SECTION --- */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>The item you're sending</Text>
          <View style={styles.typeSelectorRow}>
            {['Document', 'Parcel'].map((t) => (
              <TouchableOpacity 
                key={t}
                style={[styles.typeBtn, itemType === t && styles.typeBtnActive]}
                onPress={() => { setItemType(t); setWeight(''); }}
              >
                <Text style={[styles.typeBtnText, itemType === t && styles.typeBtnTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {itemType === 'Parcel' && (
            <View style={styles.parcelTypeGrid}>
              {PARCEL_TYPES.map((p) => (
                <TouchableOpacity 
                  key={p} 
                  style={[styles.chip, selectedParcelTypes.includes(p) && styles.chipActive]}
                  onPress={() => toggleParcelType(p)}
                >
                  <Text style={[styles.chipText, selectedParcelTypes.includes(p) && styles.chipTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.inputLabel}>Weight ({itemType === 'Document' ? 'g' : 'kg'})</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={itemType === 'Document' ? "e.g. 200" : "e.g. 8"}
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <Text style={styles.priceTag}>£{price}</Text>
          </View>
        </View>

        {/* Destination Field */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>Destination City</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="airplane" size={20} color="#64748b" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              placeholder="Enter city or airport code (e.g., London)"
              placeholderTextColor="#64748b"
              value={destination}
              onChangeText={setDestination}
            />
            <Ionicons name="locate" size={20} color="#1E90FF" />
          </View>
        </View>

        <Text style={styles.sectionHeading}>POPULAR DESTINATIONS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularList}>
          {POPULAR_DESTINATIONS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.popCard}>
              <View style={styles.popIconCircle}>
                <Ionicons name={item.icon} size={24} color="#1E90FF" />
              </View>
              <Text style={styles.popName}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionHeading}>RECENT SEARCHES</Text>
        <TouchableOpacity style={styles.recentItem}>
           <View style={styles.recentCircle}><Ionicons name="time-outline" size={18} color="#94a3b8" /></View>
           <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.recentTitle}>Toronto, Canada</Text>
              <Text style={styles.recentSub}>YYZ • Pearson Intl</Text>
           </View>
           <Ionicons name="chevron-forward" size={18} color="#475569" />
        </TouchableOpacity>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('ReceiverDetails')}
        style={styles.continueBtn} activeOpacity={0.8}>
          <Text style={styles.continueText}>Send Request</Text>
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
  progressContainer: { marginBottom: 30 },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  stepText: { color: '#1E90FF', fontSize: 12, fontWeight: 'bold' },
  stepName: { color: '#94a3b8', fontSize: 12 },
  progressBarBg: { height: 4, backgroundColor: '#1e293b', borderRadius: 2 },
  progressBarFill: { height: '100%', backgroundColor: '#1E90FF', borderRadius: 2 },
  mainTitle: { color: '#fff', fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
  subTitle: { color: '#94a3b8', fontSize: 16, marginTop: 12, lineHeight: 24 },
  badgeRow: { marginTop: 20, marginBottom: 30 },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  secureText: { color: '#10b981', fontSize: 13, marginLeft: 6, fontWeight: '600' },
  section: { marginBottom: 24 },
  inputLabel: { color: '#ffffffde', fontSize: 14, marginBottom: 10, fontWeight: '500' },
  typeSelectorRow: { flexDirection: 'row', marginBottom: 15 },
  typeBtn: {
    flex: 1,
    height: 45,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  typeBtnActive: { backgroundColor: '#1E90FF' },
  typeBtnText: { color: '#94a3b8', fontWeight: '600' },
  typeBtnTextActive: { color: '#fff' },
  parcelTypeGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  chip: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipActive: { borderColor: '#1E90FF', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
  chipText: { color: '#94a3b8', fontSize: 12 },
  chipTextActive: { color: '#1E90FF', fontWeight: 'bold' },
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
  priceTag: { color: '#10b981', fontWeight: 'bold', fontSize: 16 },
  sectionHeading: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginBottom: 15, marginTop: 10 },
  popularList: { flexDirection: 'row', marginBottom: 30 },
  popCard: {
    backgroundColor: '#1e293b',
    width: 100,
    height: 110,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  popIconCircle: { width: 44, height: 44, backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  popName: { color: '#fff', fontSize: 13, fontWeight: '600' },
  recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  recentCircle: { width: 40, height: 40, backgroundColor: '#1e293b', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  recentTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  recentSub: { color: '#64748b', fontSize: 12, marginTop: 2 },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#0a101d',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  continueBtn: {
    backgroundColor: '#1E90FF',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default NewParcelRequest;