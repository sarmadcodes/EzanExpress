import React, { useContext, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  Animated,
  Easing,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API_URI } from '../constant/API';
import axios from 'axios';
import { USER } from '../context/User';

const Splashscreen = () => {
  const navigation = useNavigation();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const { userData, setUserData } = useContext(USER);

  const CheckLogin = async () => {
    let token = await AsyncStorage.getItem('usertoken');
    console.log(token,"token")
    if (!token) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'WelcomeScreen' }],
      });
      return;
    }
    axios
      .get(`${BASE_API_URI}/login`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(data => {
        setUserData(data.data?.user);
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
        console.log(err)
        navigation.reset({
          index: 0,
          routes: [{ name: 'WelcomeScreen' }],
        });
      });
  };

  useEffect(() => {
    const spin = () => {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 900, // smooth speed
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };

    spin(); // start infinite smooth spin
CheckLogin()
    // const timer = setTimeout(() => {
    //   navigation.reset({
    //     index: 0,
    //     routes: [{ name: 'WelcomeScreen' }],
    //   });
    // }, 2000);

    // return () => clearTimeout(timer);
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Logo */}
      <Image
        source={require('../assets/logo1.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Smooth Loader */}
      <Animated.View
        style={[styles.loader, { transform: [{ rotate: rotation }] }]}
      />

      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

export default Splashscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 240,
    height: 140,
    marginBottom: 40,
  },
  loader: {
    width: 36,
    height: 36,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#16499B',
    borderTopColor: 'transparent',
  },
  loadingText: {
    marginTop: 12,
    color: '#16499B',
    fontSize: 14,
    fontWeight: '500',
  },
});
