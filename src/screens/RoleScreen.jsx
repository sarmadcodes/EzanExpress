import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useContext, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../components/BackBar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { LOADING } from '../context/Loading';
import { USER } from '../context/User';
import { BASE_API_URI } from '../constant/API';

const RoleCard = ({
  icon,
  title,
  description,
  buttonText,
  onPress,
  variant = 'sender',
  compact = false,
  disabled = false,
}) => {
  const buttonScale = useRef(new Animated.Value(1)).current;

  const isSender = variant === 'sender';

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 2,
    }).start();
  };

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.cardVisual,
          compact && styles.cardVisualCompact,
          isSender ? styles.senderVisual : styles.travelerVisual,
        ]}
      >
        <View
          style={[
            styles.iconGlow,
            compact && styles.iconGlowCompact,
            isSender ? styles.senderIconGlow : styles.travelerIconGlow,
          ]}
        >
          <Ionicons
            name={icon}
            size={compact ? 39 : 45}
            color={isSender ? '#DCEBFF' : '#EEE7FF'}
          />
        </View>

        <View style={styles.visualDecorationOne} />
        <View style={styles.visualDecorationTwo} />
      </View>

      <View
        style={[
          styles.cardBody,
          compact && styles.cardBodyCompact,
        ]}
      >
        <View style={styles.roleHeadingRow}>
          <View
            style={[
              styles.roleDot,
              isSender ? styles.senderDot : styles.travelerDot,
            ]}
          />

          <Text
            style={[
              styles.cardTitle,
              compact && styles.cardTitleCompact,
            ]}
          >
            {title}
          </Text>
        </View>

        <Text
          style={[
            styles.cardDescription,
            compact && styles.cardDescriptionCompact,
          ]}
        >
          {description}
        </Text>

        <Animated.View
          style={{
            transform: [{ scale: buttonScale }],
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={disabled}
            onPress={onPress}
            onPressIn={disabled ? undefined : handleButtonPressIn}
            onPressOut={disabled ? undefined : handleButtonPressOut}
            style={[
              styles.actionButton,
              compact && styles.actionButtonCompact,
              isSender ? styles.senderButton : styles.travelerButton,
              disabled && styles.actionButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.actionButtonText,
                compact && styles.actionButtonTextCompact,
              ]}
            >
              {buttonText}
            </Text>

            {/* <Ionicons
              name="arrow-forward"
              size={compact ? 17 : 18}
              color="#FFFFFF"
              style={styles.buttonArrow}
            /> */}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const RoleScreen = ({ navigation }) => {
  const BG_COLOR = '#0B121C';

  const { height } = useWindowDimensions();
  const { setLoading } = useContext(LOADING);
  const { setUserData } = useContext(USER);

  const [selectingRole, setSelectingRole] = useState('');

  const compact = height < 760;

  const showError = message => {
    Toast.show({
      type: 'error',
      text1: message || 'Something went wrong. Please try again.',
    });
  };

  const getBackendError = error => {
    return (
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.'
    );
  };

  const SelectRole = async role => {
    console.log('SELECTED ROLE:', role);
    if (selectingRole) {
      return;
    }

    if (!['sender', 'traveler'].includes(role)) {
      showError('Please select a valid role.');
      return;
    }

    setSelectingRole(role);
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('usertoken');

      if (!token) {
        showError('Your session has expired. Please login again.');

        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' }],
        });

        return;
      }

      const response = await axios.patch(
        `${BASE_API_URI}/user/role`,
        {
          user_type: role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedUser = response?.data?.user;

      if (!updatedUser) {
        throw new Error('Invalid role selection response.');
      }

      setUserData(updatedUser);

      Toast.show({
        type: 'success',
        text1:
          response?.data?.msg ||
          'Role selected successfully.',
      });

      if (role === 'sender') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SenderDashboard' }],
        });

        return;
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'FlightDetails' }],
      });
    } catch (error) {
      console.log(
        'SELECT ROLE ERROR:',
        error?.response?.data || error,
      );

      showError(getBackendError(error));
    } finally {
      setSelectingRole('');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={BG_COLOR}
        translucent={false}
      />

      <View style={styles.backBarWrapper}>
        <BackBar
            title="Choose Your Role"
            showBackButton={false}
          />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          compact && styles.scrollContentCompact,
        ]}
        showsVerticalScrollIndicator={false}
        bounces={Platform.OS === 'ios'}
      >
        <View
          style={[
            styles.introSection,
            compact && styles.introSectionCompact,
          ]}
        >
          <Text
            style={[
              styles.welcomeTitle,
              compact && styles.welcomeTitleCompact,
            ]}
          >
            Welcome to Ezan Express
          </Text>

          <Text
            style={[
              styles.welcomeSubtitle,
              compact && styles.welcomeSubtitleCompact,
            ]}
          >
            Select how you would like to get started today.
          </Text>
        </View>

        <RoleCard
          icon="cube-outline"
          title="I am a Sender"
          description="Send packages globally for less. Connect with trusted travelers heading to your destination."
          buttonText="Continue as Sender"
          variant="sender"
          compact={compact}
          onPress={() => SelectRole('sender')}
          disabled={Boolean(selectingRole)}
        />

        <RoleCard
          icon="airplane-outline"
          title="I am a Traveler"
          description="Earn money while you travel. Monetize your extra luggage space by delivering parcels."
          buttonText="Continue as Traveler"
          variant="traveler"
          compact={compact}
          onPress={() => SelectRole('traveler')}
          disabled={Boolean(selectingRole)}
        />

        <View
          style={[
            styles.footer,
            compact && styles.footerCompact,
          ]}
        >
          <Text style={styles.footerText}>Not sure? </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('HowItWorksScreen')}
          >
            <Text style={styles.footerLink}>See how it works</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B121C',
  },

  backBarWrapper: {
    paddingHorizontal: 20,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 22,
  },

  scrollContentCompact: {
    paddingTop: 4,
    paddingBottom: 14,
  },

  introSection: {
    marginBottom: 18,
  },

  introSectionCompact: {
    marginBottom: 12,
  },

  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 35,
    fontWeight: Platform.OS === 'ios' ? '800' : '700',
    letterSpacing: -0.5,
  },

  welcomeTitleCompact: {
    fontSize: 24,
    lineHeight: 30,
  },

  welcomeSubtitle: {
    color: '#91A4BD',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 7,
  },

  welcomeSubtitleCompact: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },

  card: {
    backgroundColor: '#151F2C',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1F3042',

    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  cardVisual: {
    height: 125,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },

  cardVisualCompact: {
    height: 100,
  },

  senderVisual: {
    backgroundColor: '#317CEB',
  },

  travelerVisual: {
    backgroundColor: '#7540E8',
  },

  iconGlow: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 5,
  },

  iconGlowCompact: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },

  senderIconGlow: {
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderColor: 'rgba(255,255,255,0.22)',
  },

  travelerIconGlow: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderColor: 'rgba(255,255,255,0.20)',
  },

  visualDecorationOne: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.035)',
    top: -85,
    right: -45,
  },

  visualDecorationTwo: {
    position: 'absolute',
    width: 125,
    height: 125,
    borderRadius: 63,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: -75,
    left: -35,
  },

  cardBody: {
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 16,
  },

  cardBodyCompact: {
    paddingTop: 12,
    paddingBottom: 12,
  },

  roleHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  roleDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 9,
  },

  senderDot: {
    backgroundColor: '#3F94FF',
  },

  travelerDot: {
    backgroundColor: '#9162FF',
  },

  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  cardTitleCompact: {
    fontSize: 18,
  },

  cardDescription: {
    color: '#91A4BD',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
  },

  cardDescriptionCompact: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },

  actionButton: {
    height: 48,
    marginTop: 14,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.14,
        shadowRadius: 7,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  actionButtonCompact: {
    height: 43,
    marginTop: 10,
  },

  actionButtonDisabled: {
    opacity: 0.65,
  },

  senderButton: {
    backgroundColor: '#1687F8',
  },

  travelerButton: {
    backgroundColor: '#7043E8',
  },

  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  actionButtonTextCompact: {
    fontSize: 14,
  },

  buttonArrow: {
    marginLeft: 8,
  },

  footer: {
    marginTop: 4,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerCompact: {
    marginTop: 0,
    marginBottom: 0,
  },

  footerText: {
    color: '#91A4BD',
    fontSize: 14,
  },

  footerLink: {
    color: '#C7D6E8',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
    textDecorationColor: '#60748B',
  },
});

export default RoleScreen;