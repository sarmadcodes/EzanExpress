import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../components/BackBar';
import Toast from 'react-native-toast-message';
import { USER } from '../context/User';
import { LOADING } from '../context/Loading';
import axios from 'axios';
import { BASE_API_URI } from '../constant/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RoleScreen = ({ navigation }) => {
  const BG_COLOR = '#0B121C'; // Dark navy/black background from image
  const { userData, setUserData } = useContext(USER);
  const { loading, setLoading } = useContext(LOADING);
  const GradientBackground = ({ colors }) => (
    <View style={StyleSheet.absoluteFill}>
      {/* <Svg height="100%" width="100%">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors[0]} stopOpacity="1" />
            <Stop offset="1" stopColor={colors[1]} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg> */}
    </View>
  );

  const SelectRole = async role => {
    setLoading(true);
    if (!role) {
      Toast.show({
        text1: 'Select Role',
        type: 'error',
      });
      setLoading(false);
      return;
    }
    let token = await AsyncStorage.getItem('usertoken');
    axios
      .put(
        `${BASE_API_URI}/update/user`,
        { user_type: role },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(responseData => {
        setUserData(responseData?.data?.user);
        setLoading(false);
         if (responseData?.data?.user?.user_type == 'traveler') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'FlightDetails' }],
          });
        } else if (responseData?.data?.user?.user_type == 'sender') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'SenderDashboard' }],
          });
        }
      })
      .catch(err => {
        console.log(err)
        Toast.show({
          text1: 'Server error try again',
          type: 'error',
        });
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />
      <BackBar title="What`s your plan" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* <Text style={styles.welcomeTitle}>Welcome to Ezan Express</Text> */}
        <Text style={styles.welcomeSubtitle}>
          Select how you would like to get started today.
        </Text>

        {/* Sender Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <GradientBackground colors={['#4A80F0', '#3262D6']} />
            <View style={styles.circleIcon}>
              <Ionicons name="cube-outline" size={50} color="#FFF" />
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>I am sending a parcel/document</Text>
            <Text style={styles.cardDesc}>
              Send packages globally for less. Connect with trusted travelers
              heading to your destination.
            </Text>
            <TouchableOpacity
              onPress={() => SelectRole("sender")}
              style={[styles.actionButton, { backgroundColor: '#1E90FF' }]}
            >
              <Text style={styles.buttonText}>Continue as Sender</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Carrier Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <GradientBackground colors={['#6A5AE0', '#8B5CF6']} />
            <View style={styles.circleIcon}>
              <Ionicons name="airplane" size={50} color="#FFF" />
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>I am travelling.</Text>
            <Text style={styles.cardDesc}>
              Earn money while you travel. Monetize your extra luggage space by
              delivering parcels.
            </Text>
            <TouchableOpacity
            onPress={() => SelectRole("traveler")}
              style={[styles.actionButton, styles.disabledButton]}
            >
              <Text style={styles.buttonText}>Continue as Passenger</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Not sure? <Text style={styles.linkText}>See how it works</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B121C', paddingHorizontal: 15 },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    height: 60,
  },
  navTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  iconBtn: { padding: 8, backgroundColor: '#161F2C', borderRadius: 20 },
  scrollContent: { paddingBottom: 30 },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#161F2C',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  cardHeader: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleIcon: {
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 2,
    marginTop: 10,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardBody: { padding: 20 },
  cardTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  cardDesc: { color: '#94A3B8', fontSize: 14, marginTop: 8, lineHeight: 20 },
  actionButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: { backgroundColor: '#1E293B' },
  buttonText: { color: '#FFF', fontSize: 15, fontWeight: '700' },

  footer: { marginTop: 10, alignItems: 'center' },
  footerText: { color: '#94A3B8', fontSize: 14 },
  linkText: { color: '#FFF', textDecorationLine: 'underline' },
});

export default RoleScreen;
