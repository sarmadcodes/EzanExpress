import React, {
  useContext,
  useEffect,
  useRef,
} from 'react';

import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  Animated,
  Easing,
  Text,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { BASE_API_URI } from '../constant/API';
import { USER } from '../context/User';

const Splashscreen = () => {
  const navigation = useNavigation();

  const rotateAnim = useRef(
    new Animated.Value(0),
  ).current;

  const { setUserData } =
    useContext(USER);

  const CheckLogin = async () => {
    try {
      const token =
        await AsyncStorage.getItem(
          'usertoken',
        );

      if (!token) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'WelcomeScreen',
            },
          ],
        });

        return;
      }

      const response =
        await axios.get(
          `${BASE_API_URI}/login`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      const user =
        response?.data?.user;

      if (!user) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'WelcomeScreen',
            },
          ],
        });

        return;
      }

      setUserData(user);

      if (
        user.user_type !== 'admin' &&
        user.is_account_approved !== true
      ) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'AccountPending',
              params: {
                rejection_reason:
                  user.account_rejection_reason,
              },
            },
          ],
        });

        return;
      }

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
              name:
                'TravelerDashboard',
            },
          ],
        });

        return;
      }

      if (
        user.user_type === 'sender'
      ) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name:
                'SenderDashboard',
            },
          ],
        });

        return;
      }

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
        'SPLASH LOGIN ERROR:',
        err?.response?.data ||
          err?.message ||
          err,
      );

      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'WelcomeScreen',
          },
        ],
      });
    }
  };

  useEffect(() => {
    const spin = () => {
      rotateAnim.setValue(0);

      Animated.timing(
        rotateAnim,
        {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        },
      ).start(() => spin());
    };

    spin();

    CheckLogin();
  }, []);

  const rotation =
    rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        '0deg',
        '360deg',
      ],
    });

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content"
      />

      <Image
        source={require('../assets/logo1.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Animated.View
        style={[
          styles.loader,
          {
            transform: [
              {
                rotate: rotation,
              },
            ],
          },
        ]}
      />

      <Text
        style={styles.loadingText}
      >
        Loading...
      </Text>
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
