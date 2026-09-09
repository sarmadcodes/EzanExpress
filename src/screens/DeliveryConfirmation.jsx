import Ionicons from '@react-native-vector-icons/ionicons';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import BackBar from '../components/BackBar';
import api from '../services/api';

const formatWeight = grams => {
  const value = Number(grams);
  if (!Number.isFinite(value) || value <= 0) return '—';
  return value >= 1000 ? `${(value / 1000).toFixed(2)} kg` : `${value} g`;
};

const Row = ({label, value}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value || '—'}</Text>
  </View>
);

const DeliveryConfirmation = ({navigation, route}) => {
  const [travelCode, setTravelCode] = useState(
    route?.params?.travel_code || '',
  );
  const [parcelCode, setParcelCode] = useState(
    route?.params?.parcel_code || '',
  );

  const [parcel, setParcel] = useState(null);
  const [looking, setLooking] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  const codesReady =
    travelCode.trim().length > 0 && parcelCode.trim().length > 0;

  const handleLookup = async () => {
    if (!codesReady) {
      setError('Enter both the Travel Code and the Parcel Code.');
      return;
    }

    setLooking(true);
    setError('');

    try {
      const {data} = await api.post('/request/delivery/lookup', {
        travel_code: travelCode.trim(),
        parcel_code: parcelCode.trim(),
      });

      const found = data?.parcel || null;

      if (!found) {
        setError('No parcel found for these codes.');
        return;
      }

      setParcel(found);
    } catch (err) {
      setError(err?.message || 'Unable to find this parcel.');
    } finally {
      setLooking(false);
    }
  };

  const submitDelivery = async () => {
    setConfirming(true);
    setError('');

    try {
      await api.patch('/request/delivery/complete', {
        travel_code: travelCode.trim(),
        parcel_code: parcelCode.trim(),
      });

      Alert.alert(
        'Delivery Confirmed',
        'The parcel has been marked as delivered. Your earnings will be released to your wallet.',
        [
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (err) {
      setError(err?.message || 'Unable to confirm delivery.');
    } finally {
      setConfirming(false);
    }
  };

  const handleConfirm = () => {
    Alert.alert(
      'Confirm Delivery',
      'Only confirm once the parcel is physically handed to the receiver. This cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', style: 'destructive', onPress: submitDelivery},
      ],
    );
  };

  const reset = () => {
    setParcel(null);
    setError('');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />

      <BackBar title="Confirm Delivery" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          {!parcel ? (
            <>
              <View style={styles.iconCircle}>
                <Ionicons name="qr-code-outline" size={30} color="#1363C8" />
              </View>

              <Text style={styles.heading}>Enter delivery codes</Text>

              <Text style={styles.subheading}>
                Enter your Travel Code and the Parcel Code shown by the sender
                to look up the parcel.
              </Text>

              <Text style={styles.label}>Travel Code</Text>
              <TextInput
                value={travelCode}
                onChangeText={setTravelCode}
                placeholder="e.g. TRV-XXXXXXXX"
                placeholderTextColor="#ffffff45"
                autoCapitalize="characters"
                autoCorrect={false}
                style={styles.input}
              />

              <Text style={styles.label}>Parcel Code</Text>
              <TextInput
                value={parcelCode}
                onChangeText={setParcelCode}
                placeholder="e.g. PCL-XXXXXXXX"
                placeholderTextColor="#ffffff45"
                autoCapitalize="characters"
                autoCorrect={false}
                style={styles.input}
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                onPress={handleLookup}
                disabled={!codesReady || looking}
                style={[
                  styles.primaryBtn,
                  (!codesReady || looking) && styles.btnDisabled,
                ]}>
                {looking ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Find Parcel</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View
                style={[
                  styles.iconCircle,
                  parcel.delivered && styles.iconCircleDone,
                ]}>
                <Ionicons
                  name={parcel.delivered ? 'checkmark-done' : 'cube-outline'}
                  size={30}
                  color={parcel.delivered ? '#22C55E' : '#1363C8'}
                />
              </View>

              <Text style={styles.heading}>
                {parcel.delivered ? 'Already delivered' : 'Parcel found'}
              </Text>

              <View style={styles.card}>
                <Row label="Parcel Code" value={parcel.parcel_code} />
                <Row label="Type" value={parcel.item_type} />
                <Row
                  label="Weight"
                  value={formatWeight(parcel.weight_in_grams)}
                />
                <Row label="Receiver" value={parcel?.receiver?.name} />
                <Row label="Phone" value={parcel?.receiver?.phone_number} />
                <Row label="Address" value={parcel?.receiver?.address} />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              {parcel.delivered ? (
                <View style={styles.doneBox}>
                  <Ionicons name="information-circle" size={18} color="#22C55E" />
                  <Text style={styles.doneText}>
                    This parcel was already marked as delivered.
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleConfirm}
                  disabled={confirming}
                  style={[styles.primaryBtn, confirming && styles.btnDisabled]}>
                  {confirming ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>
                      Confirm Handover
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={reset} style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>Use different codes</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default DeliveryConfirmation;

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#0B121C'},
  flex: {flex: 1},
  content: {padding: 18, paddingBottom: 40},
  iconCircle: {
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1363C81A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  iconCircleDone: {backgroundColor: '#22C55E1A'},
  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 14,
  },
  subheading: {
    color: '#ffffffa0',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 19,
  },
  label: {color: '#ffffffc0', fontSize: 13, marginBottom: 6, marginTop: 12},
  input: {
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: '#fff',
    fontSize: 15,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1E293B',
  },
  rowLabel: {color: '#ffffff90', fontSize: 13},
  rowValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  error: {
    color: '#EF4444',
    fontSize: 13,
    marginTop: 14,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: '#1363C8',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 22,
  },
  btnDisabled: {opacity: 0.55},
  primaryBtnText: {color: '#fff', fontSize: 15, fontWeight: '700'},
  secondaryBtn: {paddingVertical: 14, alignItems: 'center'},
  secondaryBtnText: {color: '#1363C8', fontSize: 14, fontWeight: '600'},
  doneBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#22C55E12',
    borderWidth: 1,
    borderColor: '#22C55E33',
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },
  doneText: {color: '#22C55E', fontSize: 13, flex: 1},
});
