import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { OtpInput } from 'react-native-otp-entry';
import axios from 'axios';
import Toast from 'react-native-toast-message';

import { LOADING } from '../context/Loading';
import { BASE_API_URI } from '../constant/API';
import Button from '../components/Button/Button';

const ForgotPasswordOtpScreen = ({ navigation, route }) => {
  const BG_COLOR = '#050B18';

  const { setLoading } = useContext(LOADING);

  const email = route?.params?.email || '';

  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(60);

  const timerRef = useRef(null);

  const getBackendError = error => {
    return (
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.'
    );
  };

  const startResendCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setResendSeconds(60);

    timerRef.current = setInterval(() => {
      setResendSeconds(previous => {
        if (previous <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }

        return previous - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startResendCountdown();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const verifyOtp = async () => {
    if (verifying) {
      return;
    }

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Forgot password session is missing. Please start again.',
      });

      navigation.replace('ForgotPasswordScreen');
      return;
    }

    if (otp.trim().length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Please enter the 6-digit verification code.',
      });
      return;
    }

    setVerifying(true);
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_API_URI}/forgot-password/verify-otp`,
        {
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        },
      );

      const resetToken = response?.data?.resetToken;

      if (!resetToken) {
        throw new Error('Unable to continue password reset.');
      }

      Toast.show({
        type: 'success',
        text1:
          response?.data?.msg ||
          'OTP verified successfully.',
      });

      navigation.replace('ResetPasswordScreen', {
        resetToken,
      });
    } catch (error) {
      console.log(
        'FORGOT PASSWORD VERIFY OTP ERROR:',
        error?.response?.data || error,
      );

      Toast.show({
        type: 'error',
        text1: getBackendError(error),
      });

      // Stay on OTP screen.
      // No navigation on wrong / expired OTP.
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resending || resendSeconds > 0) {
      return;
    }

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Forgot password session is missing. Please start again.',
      });

      navigation.replace('ForgotPasswordScreen');
      return;
    }

    setResending(true);

    try {
      const response = await axios.post(
        `${BASE_API_URI}/forgot-password`,
        {
          email: email.trim().toLowerCase(),
        },
      );

      Toast.show({
        type: 'success',
        text1:
          response?.data?.msg ||
          'If an account exists with this email, an OTP has been sent.',
      });

      // Latest OTP is now the valid OTP.
      setOtp('');
      startResendCountdown();
    } catch (error) {
      console.log(
        'FORGOT PASSWORD RESEND OTP ERROR:',
        error?.response?.data || error,
      );

      Toast.show({
        type: 'error',
        text1: getBackendError(error),
      });

      // Backend cooldown is source of truth.
      if (error?.response?.status === 429) {
        startResendCountdown();
      }
    } finally {
      setResending(false);
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            disabled={verifying}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Verify Email
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name="mail-unread-outline"
              size={32}
              color="#55A9FF"
            />
          </View>

          <Text style={styles.title}>
            Check your email
          </Text>

          <Text style={styles.subtitle}>
            Enter the 6-digit verification code sent to
          </Text>

          <Text
            numberOfLines={1}
            style={styles.email}
          >
            {email}
          </Text>

          {/* OTP */}
          <View style={styles.otpContainer}>
            <OtpInput
              numberOfDigits={6}
              focusColor="#2A98FF"
              onTextChange={setOtp}
              theme={{
                containerStyle: styles.otpInputWrapper,
                pinCodeContainerStyle: styles.otpPin,
                pinCodeTextStyle: styles.otpPinText,
                focusedPinCodeContainerStyle:
                  styles.otpPinFocused,
              }}
            />
          </View>

          <Button
            text="Verify Code"
            onPress={verifyOtp}
            disabled={
              verifying ||
              resending ||
              otp.trim().length !== 6
            }
            loading={verifying}
          />

          {/* Resend */}
          <View style={styles.resendRow}>
            <Text style={styles.resendLabel}>
              Didn't receive the code?
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              disabled={
                resendSeconds > 0 ||
                resending ||
                verifying
              }
              onPress={resendOtp}
            >
              <Text
                style={[
                  styles.resendText,
                  (resendSeconds > 0 || resending) &&
                    styles.resendDisabled,
                ]}
              >
                {resending
                  ? ' Sending...'
                  : resendSeconds > 0
                  ? ` Resend in ${resendSeconds}s`
                  : ' Resend'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Expiry */}
          <View style={styles.expiryNote}>
            <Ionicons
              name="time-outline"
              size={16}
              color="#71849A"
            />

            <Text style={styles.expiryText}>
              Verification code expires in 10 minutes.
            </Text>
          </View>

          <View style={styles.securityNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#55A9FF"
            />

            <Text style={styles.securityText}>
              Never share your verification code with anyone.
            </Text>
          </View>
        </View>
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

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 42,
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
  },

  email: {
    color: '#55A9FF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },

  otpContainer: {
    marginTop: 32,
    marginBottom: 28,
  },

  otpInputWrapper: {
    width: '100%',
  },

  otpPin: {
    width: 43,
    height: 52,
    borderRadius: 11,
    backgroundColor: '#101C2C',
    borderWidth: 1,
    borderColor: '#25374D',
  },

  otpPinFocused: {
    borderColor: '#2A98FF',
    backgroundColor: '#12233A',
  },

  otpPinText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  resendLabel: {
    color: '#7B8DA3',
    fontSize: 12,
  },

  resendText: {
    color: '#55A9FF',
    fontSize: 12,
    fontWeight: '700',
  },

  resendDisabled: {
    color: '#52647A',
  },

  expiryNote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },

  expiryText: {
    color: '#687B91',
    fontSize: 10,
    marginLeft: 5,
  },

  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    backgroundColor: 'rgba(30,144,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.13)',
    padding: 12,
    marginTop: 26,
  },

  securityText: {
    flex: 1,
    color: '#7F92A9',
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 9,
  },
});

export default ForgotPasswordOtpScreen;