import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext} from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import {useNavigation} from '@react-navigation/native';
import {USER} from '../context/User';

const DashboardHeader = () => {
  const navigation = useNavigation();
  const {userData} = useContext(USER);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good Morning';
    }

    if (hour < 17) {
      return 'Good Afternoon';
    }

    return 'Good Evening';
  };

  const userName = userData?.name
    ? userData.name.split('/').join(' ')
    : 'User';

  return (
    <View style={styles.header}>
      <View style={styles.userSection}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo1.jpg')}
            style={styles.profileIcon}
          />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.greeting}>
            {getGreeting()}
          </Text>

          <Text
            style={styles.name}
            numberOfLines={1}>
            {userName}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.notificationButton}
        onPress={() =>
          navigation.navigate('Notifications')
        }>
        <Ionicons
          name="notifications-outline"
          size={23}
          color="#FFFFFF"
        />

        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  );
};

export default DashboardHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0B121C',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },

  userSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,

    backgroundColor: '#FFFFFF',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  profileIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    resizeMode: 'cover',
  },

  userInfo: {
    flex: 1,
    marginLeft: 12,
  },

  greeting: {
    fontSize: 13,
    color: '#8E9AAA',
    fontWeight: '500',
    marginBottom: 3,
  },

  name: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.1,
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,

    backgroundColor: 'rgba(255,255,255,0.07)',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',

    position: 'relative',
  },

  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,

    width: 7,
    height: 7,
    borderRadius: 4,

    backgroundColor: '#2F80ED',

    borderWidth: 1.5,
    borderColor: '#0B121C',
  },
});