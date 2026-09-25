import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../../components/BackBar';
import { USER } from '../../../context/User';
import { LOADING } from '../../../context/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialsOf = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);

  if (!parts.length) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

const SettingsScreen = ({ navigation }) => {

  const SettingItem = ({
    icon,
    label,
    value,
    onPress,
    hasSwitch,
    switchValue,
    onSwitchChange,
  }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      disabled={hasSwitch}
    >
      <View style={styles.iconBackground}>
        <Ionicons name={icon} size={22} color="#1E90FF" />
      </View>
      <Text style={styles.itemLabel}>{label}</Text>

      <View style={styles.rightSection}>
        {value && <Text style={styles.itemValue}>{value}</Text>}
        {hasSwitch ? (
          <Switch
            trackColor={{ false: '#3e3e3e', true: '#FFFFFF' }}
            thumbColor={switchValue ? '#1E90FF' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onSwitchChange}
            value={switchValue}
          />
        ) : (
          <Ionicons name="chevron-forward" size={22} color="#666" />
        )}
      </View>
    </TouchableOpacity>
  );
  const { userData, setUserData } = useContext(USER);
  const { loading, setLoading } = useContext(LOADING);

  const OnLogout = async () => {
    setLoading(true);
    await AsyncStorage.removeItem('usertoken');
    setUserData({});
    navigation.reset({
      index: 0,
      routes: [{ name: 'WelcomeScreen' }],
    });
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />
      <BackBar title="Profile" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('ProfileviewScreen')}
        >
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarInitials}>
              {initialsOf(userData?.name)}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userData?.name?userData?.name?.split("/")?.join(" "):"...."}</Text>
            {userData?.is_account_approved === true ? (
              <View style={styles.verifiedBadge}>
                <Ionicons
                  name="checkmark-done-circle"
                  size={16}
                  color="#1E90FF"
                />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            ) : null}
            <Text style={styles.viewProfileText}>View Profile</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>ACCOUNT</Text>

        <SettingItem
          icon="lock-closed-outline"
          label="Change Password"
          onPress={() => navigation.navigate('ChangePassword')}
        />


        <SettingItem
          icon="trash-outline"
          label="Delete Account"
          onPress={() => navigation.navigate('DeleteAccount')}
        />

        <Text style={styles.sectionTitle}>SUPPORT</Text>
        <SettingItem
          icon="headset-outline"
          label="Help & Support"
          onPress={() => navigation.navigate('HelpCenter')}
        />
        <SettingItem
          icon="information-circle-outline"
          label="About Ezan Express"
          onPress={() => navigation.navigate('AboutScreen')}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={OnLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF5252" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Ezan Express v1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
    paddingHorizontal: 15,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#1A222C',
    marginVertical: 10,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  avatarFallback: {
    backgroundColor: '#132840',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitials: {
    color: '#55A9FF',
    fontSize: 22,
    fontWeight: '700',
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF',
  },
  profileInfo: {
    marginLeft: 15,
  },
  userName: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedText: {
    color: '#1E90FF',
    marginLeft: 5,
    fontSize: 14,
  },
  viewProfileText: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconBackground: {
    width: 40,
    height: 40,
    backgroundColor: '#16202A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLabel: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginLeft: 15,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    color: '#666',
    marginRight: 10,
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#23191D',
    marginHorizontal: 20,
    marginTop: 30,
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#FF5252',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  versionText: {
    color: '#444',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    fontSize: 12,
  },
});

export default SettingsScreen;
