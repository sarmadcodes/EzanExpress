import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackBar from '../../../components/BackBar';

const SettingsScreen = ({ navigation }) => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isFaceIdEnabled, setIsFaceIdEnabled] = useState(false);

  // Reusable Component for List Items
  const SettingItem = ({ icon, label, value, onPress, hasSwitch, switchValue, onSwitchChange }) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor='#0B121C' />
      <BackBar title='Profile' />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity 
          style={styles.profileCard} 
          onPress={() => navigation.navigate('ProfileviewScreen')}
        >
          <Image
            source={{ uri: 'https://via.placeholder.com/80' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>John Doe</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-done-circle" size={16} color="#1E90FF" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
            <Text style={styles.viewProfileText}>View Profile</Text>
          </View>
        </TouchableOpacity>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <SettingItem 
          icon="notifications-outline" 
          label="Notifications" 
          hasSwitch 
          switchValue={isNotificationsEnabled}
          onSwitchChange={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
        />
        <SettingItem 
          icon="scan-outline" 
          label="Face ID" 
          hasSwitch 
          switchValue={isFaceIdEnabled}
          onSwitchChange={() => setIsFaceIdEnabled(!isFaceIdEnabled)}
        />
        <SettingItem 
          icon="language-outline" 
          label="Language" 
          value="English" 
          onPress={() => navigation.navigate('Language')} 
        />
        <SettingItem 
          icon="cash-outline" 
          label="Currency" 
          value="USD ($)" 
          onPress={() => navigation.navigate('Currency')} 
        />

        {/* Security Section */}
        {/* <Text style={styles.sectionTitle}>SECURITY & PRIVACY</Text> */}
        <SettingItem 
          icon="lock-closed-outline" 
          label="Change Password" 
          onPress={() => navigation.navigate('ChangePassword')} 
        />
        
        {/* <SettingItem 
          icon="shield-checkmark-outline" 
          label="Privacy Settings" 
          onPress={() => navigation.navigate('Privacy')} 
        /> */}

        {/* Support Section */}
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
        <SettingItem 
          icon="alert-outline" 
          label="Complaints" 
          onPress={() => navigation.navigate('ComplaintScreen')}
        />

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#FF5252" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Ezan Express v2.4.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
    paddingHorizontal:15,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#1A222C',
    marginVertical:10,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
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
