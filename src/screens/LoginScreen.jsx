import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LOADING } from '../context/Loading';
import { USER } from '../context/User';
import { BASE_API_URI } from '../constant/API';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
  useEffect(() => {
    console.log('✅ DevTools working — LoginScreen mounted');
    console.warn('DevTools Test Warning');
  }, []);
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'phone'
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { loading, setLoading } = useContext(LOADING);
  const { userData, setUserData } = useContext(USER);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // bankAccount: '',
  });

  const BG_COLOR = '#050B18';

  const onLogin = () => {
    setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   navigation.navigate('RoleScreen');
    // }, 4000);
    const check = Object.values(formData).some(
      e => typeof e === 'string' && e.trim() === '',
    );

    if (check) {
      Toast.show({
        text1: 'All fileds required!',
        type: 'error',
      });
      setLoading(false);
      return;
    }
    console.log(formData, 'formData');
    console.log(`${BASE_API_URI}/login`, '`${BASE_API_URI}/register`');
    axios
      .post(`${BASE_API_URI}/login`, {
        email: formData?.email,
        password: formData?.password,
      })
      .then(async data => {
        console.log(data);
        setLoading(false);
        await AsyncStorage.setItem('usertoken', data?.data.token);
        setUserData(data?.data?.user);
        if (data?.data?.user?.user_type == 'traveler') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'TravelerDashboard' }],
          });
        } else if (data?.data?.user?.user_type == 'sender') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SenderDashboard' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'RoleScreen' }],
          });
        }
      })
      .catch(err => {
        console.log(err);
        Toast.show({
          text1: 'Server error try again!',
          type: 'error',
        });
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ezan Express</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Welcome Text */}
          <Text style={styles.title}>Login to your account</Text>
          <Text style={styles.subtitle}>
            Continue the global delivery network and resume shipping or earning
            today.
          </Text>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'email' && styles.activeTab]}
              onPress={() => setActiveTab('email')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'email' && styles.activeTabText,
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
              onPress={() => setActiveTab('phone')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'phone' && styles.activeTabText,
                ]}
              >
                Phone Number
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Input Field */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>
              {activeTab === 'email' ? 'Email Address' : 'Phone Number'}
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={formData?.email}
                placeholder={
                  activeTab === 'email'
                    ? 'Enter your email address'
                    : 'Enter phone number'
                }
                placeholderTextColor="#5E6A81"
                keyboardType={
                  activeTab === 'email' ? 'email-address' : 'phone-pad'
                }
                autoCapitalize="none"
                onChangeText={e => setFormData({ ...formData, email: e })}
              />
              <Ionicons
                name={activeTab === 'email' ? 'mail-outline' : 'call-outline'}
                size={20}
                color="#5E6A81"
              />
            </View>

            {/* Password */}
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={formData?.password}
                placeholder="Enter password"
                placeholderTextColor="#5E6A81"
                secureTextEntry={!showPassword}
                onChangeText={e => setFormData({ ...formData, password: e })}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#5E6A81"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            {/* <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#5E6A81"
                secureTextEntry={!showPassword}
              />
              <Ionicons name="eye-off-outline" size={20} color="#5E6A81" />
            </View> */}
          </View>

          {/* Agreement Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
              {agreed && <Ionicons name="checkmark" size={14} color="#FFF" />}
            </View>
            <Text style={styles.checkboxText}>
              I agree to the{' '}
              <Text style={styles.linkText}>Terms of Service</Text> and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>.
            </Text>
          </TouchableOpacity>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={() => onLogin()}
            style={styles.button}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          {/* Login Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RegistrationScreen')}
            >
              <Text style={styles.linkText}>Create now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#050B18' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 25, paddingTop: 10 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 10 },
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
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#1E90FF' },
  tabText: { color: '#5E6A81', fontSize: 16, fontWeight: '600' },
  activeTabText: { color: '#1E90FF' },
  inputSection: { marginBottom: 20 },
  inputLabel: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 20,
  },
  input: { flex: 1, color: '#FFF', fontSize: 15 },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1E90FF',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: { backgroundColor: '#1E90FF' },
  checkboxText: { color: '#8E9AAF', fontSize: 13, flex: 1 },
  linkText: { color: '#1E90FF' },
  button: {
    backgroundColor: '#1E90FF',
    height: 55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    elevation: 4,
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 40 },
  footerText: { color: '#8E9AAF', fontSize: 15 },
});

export default LoginScreen;
