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

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.15)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Run animation on screen load
  useEffect(() => {
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.container}>
        {/* Globe Section */}
        <ImageBackground
          source={require('../assets/globe.jpg')}
          style={styles.imageBackground}
          resizeMode="cover"
        >
          {/* Animated Logo */}
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
        </ImageBackground>

        {/* Bottom Content Card */}
        <View style={styles.contentCard}>
          {/* <View style={styles.handle} /> */}
          <Text style={{color:'#ffffffde', fontWeight:'600', fontSize:16, textAlign:'center', marginTop:5}}>Welcome to</Text>
          <Text style={{color:'#1E90FF', fontWeight:'700', fontSize:16, textAlign:'center'}}>Ezan Express</Text>

          {/* Pagination Dots */}
          <View style={styles.pagination}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.title}>
            Send Globally, {'\n'}
            <Text style={styles.blueText}>Faster & Cheaper</Text>
          </Text>

          <Text style={styles.description}>
            Connect with verified travelers to ship your parcels worldwide or earn money by carrying items on your next flight.
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('RegistrationScreen')}
          >
            <Text style={styles.buttonText}>Create account</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.loginText}>
              I already have an account / Login
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={16} color="#1E90FF" />
              <Text style={styles.featureText}>Verified ID</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.featureItem}>
              <Ionicons name="lock-closed" size={16} color="#1E90FF" />
              <Text style={styles.featureText}>Secure Payment</Text>
            </View>
          </View>
        </View>
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
    flex: 1.2,
    justifyContent: 'flex-start',
  },

  // Animated Logo
  logo: {
    width: width * 0.55,
    height: width * 0.35,
    position: 'absolute',
    top: '33%',
    alignSelf: 'center',
  },

  contentCard: {
    backgroundColor: '#0A1221',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 20,
      },
    }),
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#2A3547',
    borderRadius: 2,
    marginTop: 15,
  },

  pagination: {
    flexDirection: 'row',
    marginVertical: 20,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2A3547',
    marginHorizontal: 4,
  },

  activeDot: {
    width: 24,
    backgroundColor: '#1E90FF',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 12,
  },

  blueText: {
    color: '#1E90FF',
  },

  description: {
    fontSize: 15,
    color: '#8E9AAF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 35,
  },

  button: {
    backgroundColor: '#1E90FF',
    width: '100%',
    flexDirection: 'row',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },

  loginText: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 20,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  featureText: {
    color: '#5E6A81',
    marginLeft: 6,
    fontSize: 12,
  },

  separator: {
    width: 1,
    height: 15,
    backgroundColor: '#2A3547',
    marginHorizontal: 20,
  },
});
