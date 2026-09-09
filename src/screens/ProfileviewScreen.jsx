import Ionicons from '@react-native-vector-icons/ionicons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_API_URI } from '../constant/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileviewScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('Jonathan Davis');
  const [email, setEmail] = useState('jonathan.davis@example.com');
  const [account, setAccount] = useState('001122334455');
  const [phoneNumber, setPhoneNumber] = useState('(555) 123-4567');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  const getUser = async()=>{
    let token = await AsyncStorage.getItem("usertoken")
    await axios.get(`${BASE_API_URI}/login`,{headers:{Authorization:`Bearer ${token}`}}).then((responseData)=>{
     console.log(responseData,"responseData")
      setFullName(responseData?.data?.user?.name?.split("/")?.join(" "))
      setEmail(responseData?.data?.user?.email)
      setPhoneNumber(responseData?.data?.user?.phone_number)
    })
  }
  useEffect(()=>{
getUser()
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.cameraBadge} disabled={!isEditing}>
                <Ionicons name="camera" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.idContainer}>
            <Text style={styles.idLabel}>CUSTOMER ID</Text>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>EZ-883920</Text>
            </View>
          </View>

          <View style={styles.verifiedRow}>
            <Ionicons name="checkmark-done-circle" size={18} color="#1E90FF" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.editRow}>
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              disabled={isEditing}
            >
              <Ionicons
                name="create-outline"
                size={22}
                color={isEditing ? '#6B7280' : '#1E90FF'}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={22} color="#6B7280" />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                editable={isEditing}
                placeholderTextColor="#6B7280"
              />
            </View>

            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={22} color="#6B7280" />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
                keyboardType="email-address"
                placeholderTextColor="#6B7280"
              />
            </View>

            <Text style={styles.inputLabel}>Bank Account</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={22} color="#6B7280" />
              <TextInput
                style={styles.input}
                value={account}
                onChangeText={setAccount}
                editable={isEditing}
                keyboardType="phone-pad"
                placeholderTextColor="#6B7280"
              />
            </View>

            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View style={styles.phoneRow}>
              <View
                style={[
                  styles.inputWrapper,
                  styles.countryCode,
                  !isEditing && { opacity: 0.6 },
                ]}
              >
                <Text style={styles.flag}>🇺🇸</Text>
                <Text style={styles.codeText}>+1</Text>
                <Ionicons name="chevron-down" size={20} color="#6B7280" />
              </View>

              <View style={[styles.inputWrapper, styles.phoneInput]}>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  editable={isEditing}
                  keyboardType="phone-pad"
                  placeholderTextColor="#6B7280"
                />
              </View>
            </View>

            <View style={styles.warningRow}>
              <Ionicons name="alert-circle-outline" size={16} color="#F59E0B" />
              <Text style={styles.warningText}>
                Changing your number requires re-verification.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              { opacity: isEditing ? 1 : 0.5 },
            ]}
            disabled={!isEditing}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>
            App Version 2.4.0 (Build 892)
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B121C' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  avatarContainer: { alignItems: 'center', marginTop: 20 },
  imageWrapper: { position: 'relative' },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1E90FF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  idContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  idLabel: { color: '#9CA3AF', marginRight: 8 },
  idBadge: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  idText: { color: '#FFF', fontWeight: 'bold' },

  verifiedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  verifiedText: { color: '#1E90FF', marginLeft: 6 },

  divider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginVertical: 25,
  },

  editRow: { alignItems: 'flex-end', marginBottom: 10 },

  form: { width: '100%' },
  inputLabel: { color: '#FFF', marginBottom: 8 },

  inputWrapper: {
    backgroundColor: '#161F28',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 56,
    marginBottom: 20,
  },
  input: { flex: 1, color: '#FFF', fontSize: 16 },

  phoneRow: { flexDirection: 'row', justifyContent: 'space-between' },
  countryCode: { width: '30%', justifyContent: 'space-between' },
  phoneInput: { width: '66%' },

  flag: { fontSize: 18 },
  codeText: { color: '#FFF' },

  warningRow: { flexDirection: 'row', marginBottom: 30 },
  warningText: { color: '#F59E0B', marginLeft: 6 },

  saveButton: {
    backgroundColor: '#1E90FF',
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize:16 },

  signOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signOutText: { color: '#EF4444', marginLeft: 8 },

  versionText: {
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 35,
  },
});

export default ProfileviewScreen;
