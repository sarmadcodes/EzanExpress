import React, { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import Toast from 'react-native-toast-message';

import { LOADING } from '../context/Loading';
import { BASE_API_URI } from '../constant/API';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

const ResetPasswordScreen = ({ navigation, route }) => {
  const BG_COLOR = '#050B18';

  const { setLoading } = useContext(LOADING);

  const resetToken = route?.params?.resetToken || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getBackendError = error => {
    return (
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      'Unable to reset password. Please try again.'
    );
  };

  const resetPassword = async () => {
    if (submitting) {
      return;
    }

    if (!resetToken) {
      Toast.show({
        type: 'error',
        text1: 'Password reset session is missing. Please start again.',
      });

      navigation.replace('ForgotPasswordScreen');
      return;
    }

    if (!newPassword) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your new password.',
      });
      return;
    }

    if (newPassword.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Password must be at least 8 characters long.',
      });
      return;
    }

    if (!confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Please confirm your new password.',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match.',
      });
      return;
    }

    setSubmitting(true);
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_API_URI}/reset-password`,
        {
          resetToken,
          newPassword,
        },
      );

      Toast.show({
        type: 'success',
        text1:
          response?.data?.msg ||
          'Password reset successfully.',
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
    } catch (error) {
      console.log(
        'RESET PASSWORD ERROR:',
        error?.response?.data || error,
      );

      Toast.show({
        type: 'error',
        text1: getBackendError(error),
      });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={BG_COLOR}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            disabled={submitting}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            New Password
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name="key-outline"
              size={32}
              color="#55A9FF"
            />
          </View>

          <Text style={styles.title}>
            Create new password
          </Text>

          <Text style={styles.subtitle}>
            Choose a new password for your Ezan Express account.
            Your password must contain at least 8 characters.
          </Text>

          <View style={styles.formContainer}>
            <Input
              type="password"
              label="New Password"
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="Enter password again"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <Button
              text="Reset Password"
              onPress={resetPassword}
              disabled={submitting}
              loading={submitting}
            />
          </View>

          <View style={styles.securityNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#55A9FF"
            />

            <Text style={styles.securityText}>
              After resetting your password, you'll need to sign
              in again using your new password.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050B18',
  },

  container: {
    flex: 1,
  },

  header: {
    minHeight: 58,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#111C2B',
    borderWidth: 1,
    borderColor: '#203147',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#F4F7FB',
    fontSize: 17,
    fontWeight: '700',
  },

  headerPlaceholder: {
    width: 38,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 40,
  },

  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: 'rgba(30,144,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: Platform.OS === 'ios' ? '800' : '700',
    letterSpacing: -0.4,
  },

  subtitle: {
    color: '#8395AA',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 30,
  },

  formContainer: {
    marginTop: 4,
  },

  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 13,
    backgroundColor: 'rgba(30,144,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.13)',
    padding: 12,
    marginTop: 20,
  },

  securityText: {
    flex: 1,
    color: '#7F92A9',
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 9,
  },
});

export default ResetPasswordScreen;
