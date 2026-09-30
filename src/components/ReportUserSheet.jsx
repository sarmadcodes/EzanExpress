import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import api from '../services/api';

export const REPORT_REASONS = [
  { value: 'inappropriate_messages', label: 'Inappropriate messages' },
  { value: 'prohibited_items', label: 'Asked me to carry prohibited items' },
  { value: 'did_not_deliver', label: 'Did not deliver the parcel' },
  { value: 'suspected_fraud', label: 'Suspected fraud or scam' },
  { value: 'abusive_behaviour', label: 'Abusive or threatening behaviour' },
  { value: 'fake_profile', label: 'Fake profile' },
  { value: 'other', label: 'Something else' },
];

const ReportUserSheet = ({
  visible,
  onClose,
  onDone,
  userId,
  userName,
  requestId,
}) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      setReason('');
      setDetails('');
      setAlsoBlock(true);
      setSubmitting(false);
      setError('');
    }
  }, [visible]);

  const submit = async () => {
    if (!reason) {
      setError('Please choose a reason.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { data } = await api.post(
        `/moderation/users/${userId}/report`,
        {
          reason,
          details,
          block: alsoBlock,
          request_id: requestId || null,
        },
      );

      onDone?.({
        message: data?.msg || 'Report submitted.',
        blocked: data?.blocked === true,
      });
    } catch (err) {
      setError(err?.message || 'Unable to submit your report right now.');
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetWrap}
        >
          <View style={styles.sheet}>
            <View style={styles.handleRow}>
              <Text style={styles.title}>
                Report {userName || 'this user'}
              </Text>

              <TouchableOpacity onPress={onClose} disabled={submitting}>
                <Ionicons name="close" size={24} color="#93A6BD" />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              Our team reviews every report. Nothing is shared with the person
              you are reporting.
            </Text>

            <ScrollView
              style={styles.reasons}
              keyboardShouldPersistTaps="handled"
            >
              {REPORT_REASONS.map(item => {
                const selected = reason === item.value;

                return (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => setReason(item.value)}
                    style={[
                      styles.reasonRow,
                      selected && styles.reasonRowActive,
                    ]}
                  >
                    <Ionicons
                      name={
                        selected ? 'radio-button-on' : 'radio-button-off'
                      }
                      size={19}
                      color={selected ? '#55A9FF' : '#48596E'}
                    />

                    <Text style={styles.reasonText}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}

              <Text style={styles.label}>Details (optional)</Text>

              <TextInput
                value={details}
                onChangeText={setDetails}
                placeholder="Tell us what happened"
                placeholderTextColor="#5C6E84"
                multiline
                maxLength={1000}
                style={styles.input}
              />

              <TouchableOpacity
                onPress={() => setAlsoBlock(value => !value)}
                style={styles.blockRow}
              >
                <Ionicons
                  name={alsoBlock ? 'checkbox' : 'square-outline'}
                  size={20}
                  color={alsoBlock ? '#55A9FF' : '#48596E'}
                />

                <Text style={styles.blockText}>
                  Also block this user so you no longer see each other
                </Text>
              </TouchableOpacity>

              {error ? <Text style={styles.error}>{error}</Text> : null}
            </ScrollView>

            <TouchableOpacity
              onPress={submit}
              disabled={submitting || !reason}
              style={[
                styles.submitBtn,
                (submitting || !reason) && styles.submitBtnDisabled,
              ]}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>Submit report</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ReportUserSheet;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 8, 14, 0.72)',
    justifyContent: 'flex-end',
  },
  sheetWrap: { width: '100%' },
  sheet: {
    backgroundColor: '#0B121C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
    maxHeight: '88%',
  },

  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: '#F5F8FC', fontSize: 18, fontWeight: '700', flex: 1 },
  subtitle: {
    color: '#93A6BD',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },

  reasons: { marginTop: 16 },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 10,
  },
  reasonRowActive: { borderColor: '#55A9FF' },
  reasonText: { flex: 1, color: '#DCE6F2', fontSize: 14 },

  label: {
    color: '#B7C4D4',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    minHeight: 96,
    color: '#F5F8FC',
    fontSize: 14,
    textAlignVertical: 'top',
  },

  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  blockText: { flex: 1, color: '#B7C4D4', fontSize: 13, lineHeight: 19 },

  error: { color: '#FF9B9B', fontSize: 13, marginTop: 14 },

  submitBtn: {
    backgroundColor: '#C0392B',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 18,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
