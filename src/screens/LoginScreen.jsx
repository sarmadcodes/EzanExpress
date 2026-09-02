import Ionicons from '@react-native-vector-icons/ionicons';
import React, {
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { LOADING } from '../context/Loading';
import { USER } from '../context/User';
import { BASE_API_URI } from '../constant/API';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import Input from '../components/Input/Input';

const LoginScreen = ({ navigation }) => {
  useEffect(() => {
    console.log(
      '✅ DevTools working — LoginScreen mounted',
    );
  }, []);

  const [activeTab, setActiveTab] =
    useState('email');

  const [agreed, setAgreed] = useState(false);

  const { loading, setLoading } =
    useContext(LOADING);

  const {
    userData,
    setUserData,
  } = useContext(USER);

  const [formData, setFormData] =
    useState({
      email: '',
      password: '',
    });

  const BG_COLOR = '#050B18';

  const onLogin = async () => {
    if (loading) {
      return;
    }

    if (!formData.email.trim()) {
      Toast.show({
        text1:
          activeTab === 'email'
            ? 'Please enter your email address.'
            : 'Please enter your phone number.',
        type: 'error',
      });

      return;
    }

    if (!formData.password) {
      Toast.show({
        text1: 'Please enter your password.',
        type: 'error',
      });

      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_API_URI}/login`,
        {
          email: formData.email.trim(),
          password: formData.password,
        },
      );

      const token = response?.data?.token;
      const user = response?.data?.user;

      if (!token || !user) {
        throw new Error(
          'Invalid login response.',
        );
      }

      await AsyncStorage.setItem(
        'usertoken',
        token,
      );

      setUserData(user);

      /*
       * ROUTING FLOW
       *
       * No role
       * → RoleScreen
       *
       * Sender
       * → SenderDashboard
       *
       * Traveler + onboarding incomplete
       * → FlightDetails
       *
       * Traveler + onboarding complete
       * → TravelerDashboard
       */

      if (!user?.user_type) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'RoleScreen',
            },
          ],
        });

        return;
      }

      if (
        user.user_type === 'traveler' &&
        user.is_traveler_verify !== true
      ) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'FlightDetails',
            },
          ],
        });

        return;
      }

      if (
        user.user_type === 'traveler' &&
        user.is_traveler_verify === true
      ) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'TravelerDashboard',
            },
          ],
        });

        return;
      }

      if (user.user_type === 'sender') {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'SenderDashboard',
            },
          ],
        });

        return;
      }

      /*
       * Safety fallback:
       * unknown/invalid role ho to RoleScreen.
       */
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'RoleScreen',
          },
        ],
      });
    } catch (err) {
      console.log(
        'LOGIN ERROR STATUS:',
        err?.response?.status,
      );

      console.log(
        'LOGIN ERROR DATA:',
        err?.response?.data,
      );

      console.log(
        'LOGIN ERROR MESSAGE:',
        err?.message,
      );

      Toast.show({
        text1:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          'Unable to login. Please try again.',
        type: 'error',
      });
    } finally {
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
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() =>
              navigation?.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#FFF"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Ezan Express
          </Text>

          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >
          <Text style={styles.title}>
            Login to your account
          </Text>

          <Text style={styles.subtitle}>
            Continue the global delivery network
            and resume shipping or earning today.
          </Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'email' &&
                  styles.activeTab,
              ]}
              onPress={() =>
                setActiveTab('email')
              }
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'email' &&
                    styles.activeTabText,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'phone' &&
                  styles.activeTab,
              ]}
              onPress={() =>
                setActiveTab('phone')
              }
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'phone' &&
                    styles.activeTabText,
                ]}
              >
                Phone Number
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <Input
              type={
                activeTab === 'email'
                  ? 'email'
                  : 'text'
              }
              label={
                activeTab === 'email'
                  ? 'Email Address'
                  : 'Phone Number'
              }
              placeholder={
                activeTab === 'email'
                  ? 'Enter your email address'
                  : 'Enter phone number'
              }
              icon={
                activeTab === 'email'
                  ? 'mail-outline'
                  : 'call-outline'
              }
              value={formData.email}
              onChangeText={value =>
                setFormData(previous => ({
                  ...previous,
                  email: value,
                }))
              }
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter password"
              value={formData.password}
              onChangeText={value =>
                setFormData(previous => ({
                  ...previous,
                  password: value,
                }))
              }
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate(
                  'ForgotPasswordScreen',
                )
              }
              style={
                styles.forgotPasswordButton
              }
            >
              <Text
                style={
                  styles.forgotPasswordText
                }
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={styles.checkboxContainer}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                setAgreed(
                  previous => !previous,
                )
              }
              hitSlop={{
                top: 8,
                bottom: 8,
                left: 8,
                right: 8,
              }}
              accessibilityRole="checkbox"
              accessibilityState={{
                checked: agreed,
              }}
              style={
                styles.checkboxTouchArea
              }
            >
              <View
                style={[
                  styles.checkbox,
                  agreed &&
                    styles.checkboxActive,
                ]}
              >
                {agreed ? (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color="#FFF"
                  />
                ) : null}
              </View>
            </TouchableOpacity>

            <Text
              style={styles.checkboxText}
            >
              I agree to the{' '}
              <Text
                style={styles.linkText}
              >
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text
                style={styles.linkText}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>

          <TouchableOpacity
            onPress={onLogin}
            disabled={loading}
            style={[
              styles.button,
              loading &&
                styles.buttonDisabled,
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {loading
                ? 'Please wait...'
                : 'Continue'}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text
              style={styles.footerText}
            >
              Don't have an account?{' '}
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  'RegistrationScreen',
                )
              }
            >
              <Text
                style={styles.linkText}
              >
                Create now
              </Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#8E9AAF',
    lineHeight: 22,
    marginBottom: 30,
  },

  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1A2233',
    marginBottom: 25,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },

  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E90FF',
  },

  tabText: {
    color: '#5E6A81',
    fontSize: 16,
    fontWeight: '600',
  },

  activeTabText: {
    color: '#1E90FF',
  },

  inputSection: {
    marginBottom: 20,
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  checkboxTouchArea: {
    marginRight: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1E90FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    backgroundColor: '#1E90FF',
  },

  checkboxText: {
    color: '#8E9AAF',
    fontSize: 13,
    flex: 1,
  },

  linkText: {
    color: '#1E90FF',
  },

  button: {
    backgroundColor: '#1E90FF',
    height: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 12,
  },

  forgotPasswordText: {
    color: '#55A9FF',
    fontSize: 12,
    fontWeight: '700',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },

  footerText: {
    color: '#8E9AAF',
    fontSize: 15,
  },
});

export default LoginScreen;