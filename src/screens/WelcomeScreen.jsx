import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button/Button';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  // OLD
  // const scaleAnim = useRef(new Animated.Value(0.15)).current;
  // const opacityAnim = useRef(new Animated.Value(0)).current;

  // NEW
  const scaleAnim = useRef(new Animated.Value(0.15)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(18)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // OLD
  // useEffect(() => {
  //   Animated.sequence([
  //     Animated.delay(500),
  //     Animated.parallel([
  //       Animated.timing(scaleAnim, {
  //         toValue: 1,
  //         duration: 1300,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(opacityAnim, {
  //         toValue: 1,
  //         duration: 600,
  //         useNativeDriver: true,
  //       }),
  //     ]),
  //   ]).start();
  // }, []);

  // NEW
  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(contentTranslateY, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    scaleAnim,
    opacityAnim,
    contentOpacity,
    contentTranslateY,
  ]);

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#050B18"
        translucent={false}
      />

      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/globe.jpg')}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          <View style={styles.imageOverlay} />

          <Animated.Image
            source={require('../assets/logo1bg.png')}
            resizeMode="contain"
            style={[
              styles.logo,
              {
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          />

          {/* <View style={styles.topBadge}>
            <Ionicons
              name="earth-outline"
              size={15}
              color="#7DBBFF"
            />

            <Text style={styles.topBadgeText}>
              Global Delivery Network
            </Text>
          </View> */}
        </ImageBackground>

        <Animated.View
          style={[
            styles.contentCard,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <View style={styles.handle} />

          <Text style={styles.welcomeSmall}>Welcome to</Text>

          <Text style={styles.brandName}>Ezan Express</Text>

          <View style={styles.pagination}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>
            Send Globally,{'\n'}
            <Text style={styles.blueText}>Faster & Cheaper</Text>
          </Text>

          <Text style={styles.description}>
            Connect with verified travelers to ship your parcels worldwide or
            earn money by carrying items on your next flight.
          </Text>

          <Button
            text="Create account"
            icon="arrow-forward"
            onPress={() => navigation.navigate('RegistrationScreen')}
          />

          <TouchableOpacity
            activeOpacity={0.65}
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.loginButton}
          >
            <Ionicons
              name="person-circle-outline"
              size={19}
              color="#B5C5D9"
            />

            <Text style={styles.loginText}>
              I already have an account
            </Text>

            <Text style={styles.loginHighlight}>Login</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name="shield-checkmark"
                  size={15}
                  color="#42A0FF"
                />
              </View>

              <Text style={styles.featureText}>Verified ID</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons
                  name="lock-closed"
                  size={14}
                  color="#42A0FF"
                />
              </View>

              <Text style={styles.featureText}>Secure Payment</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050B18',
  },

  container: {
    flex: 1,
    backgroundColor: '#050B18',
  },

  imageBackground: {
    flex: 1.15,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },

  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(3, 9, 20, 0.15)',
  },

  logo: {
    width: width * 0.54,
    height: width * 0.34,
    position: 'absolute',
    top: '31%',
    alignSelf: 'center',
  },

  topBadge: {
    position: 'absolute',
    top: 18,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 18, 35, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(111, 174, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  topBadgeText: {
    color: '#AFC4DB',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: 0.2,
  },

  contentCard: {
    backgroundColor: '#0A1322',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 26,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',

    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: -8,
        },
        shadowOpacity: 0.32,
        shadowRadius: 18,
      },
      android: {
        elevation: 16,
      },
    }),
  },

  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#253248',
    marginTop: 10,
    marginBottom: 8,
  },

  welcomeSmall: {
    color: '#C7D2E0',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 1,
  },

  brandName: {
    color: '#2A98FF',
    fontWeight: '800',
    fontSize: 17,
    textAlign: 'center',
    marginTop: 2,
  },

  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#29374B',
    marginHorizontal: 4,
  },

  activeDot: {
    width: 23,
    backgroundColor: '#1687F8',
  },

  title: {
    fontSize: 27,
    lineHeight: 35,
    fontWeight: Platform.OS === 'ios' ? '800' : '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.4,
  },

  blueText: {
    color: '#2A98FF',
  },

  description: {
    fontSize: 14,
    color: '#8FA1B8',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 25,
    paddingHorizontal: 3,
  },

  buttonWrapper: {
    width: '100%',
  },

  button: {
    backgroundColor: '#1687F8',
    width: '100%',
    flexDirection: 'row',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',

    ...Platform.select({
      ios: {
        shadowColor: '#1687F8',
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.28,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 9,
  },

  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 10,
  },

  loginText: {
    color: '#A9B8CA',
    fontSize: 14,
    marginLeft: 7,
  },

  loginHighlight: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 5,
  },

  footer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 3,
    paddingBottom: 18,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  featureIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(30,144,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(30,144,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureText: {
    color: '#71839A',
    marginLeft: 7,
    fontSize: 11,
    fontWeight: '500',
  },

  separator: {
    width: 1,
    height: 20,
    backgroundColor: '#27364A',
    marginHorizontal: 20,
  },
});