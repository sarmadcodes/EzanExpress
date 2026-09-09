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

const LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

const RatePassengerScreen = ({navigation, route}) => {
  const requestId = route?.params?.request_id || route?.params?.requestId;
  const passengerName = route?.params?.passenger_name;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!requestId) {
      setError('Missing request reference. Please reopen from your parcel.');
      return;
    }

    if (rating < 1) {
      setError('Please select a star rating.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/request/rating', {
        request_id: requestId,
        rating,
        comment: comment.trim(),
      });

      Alert.alert(
        'Thank you',
        'Your feedback has been submitted.',
        [{text: 'Done', onPress: () => navigation.goBack()}],
      );
    } catch (err) {
      setError(err?.message || 'Unable to submit your feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />

      <BackBar title="Rate Traveler" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>
            How was your delivery
            {passengerName ? ` with ${passengerName}` : ''}?
          </Text>

          <Text style={styles.subheading}>
            Your rating helps other senders choose reliable travelers.
          </Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(value => (
              <TouchableOpacity
                key={value}
                onPress={() => setRating(value)}
                activeOpacity={0.7}
                style={styles.starBtn}>
                <Ionicons
                  name={value <= rating ? 'star' : 'star-outline'}
                  size={36}
                  color={value <= rating ? '#F5B301' : '#ffffff40'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.ratingLabel}>
            {rating ? LABELS[rating] : 'Tap a star to rate'}
          </Text>

          <Text style={styles.label}>Comment (optional)</Text>

          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Share details about your experience..."
            placeholderTextColor="#ffffff45"
            multiline
            numberOfLines={5}
            maxLength={500}
            textAlignVertical="top"
            style={styles.textarea}
          />

          <Text style={styles.counter}>{comment.length}/500</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting || rating < 1}
            style={[
              styles.primaryBtn,
              (submitting || rating < 1) && styles.btnDisabled,
            ]}>
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryBtnText}>Submit Feedback</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RatePassengerScreen;

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: '#0B121C'},
  flex: {flex: 1},
  content: {padding: 18, paddingBottom: 40},
  heading: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 16,
  },
  subheading: {
    color: '#ffffffa0',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 19,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 26,
  },
  starBtn: {padding: 4},
  ratingLabel: {
    color: '#F5B301',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    minHeight: 20,
  },
  label: {color: '#ffffffc0', fontSize: 13, marginTop: 26, marginBottom: 8},
  textarea: {
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 14,
    minHeight: 120,
  },
  counter: {
    color: '#ffffff60',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 6,
  },
  error: {color: '#EF4444', fontSize: 13, marginTop: 14, textAlign: 'center'},
  primaryBtn: {
    backgroundColor: '#1363C8',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  btnDisabled: {opacity: 0.55},
  primaryBtnText: {color: '#fff', fontSize: 15, fontWeight: '700'},
});
