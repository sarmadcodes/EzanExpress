import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker'; // From your installed packages
import Ionicons from '@react-native-vector-icons/ionicons';

const RegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: new Date(),
    address: '',
    mobile: '',
    email: '',
    password: '',
    bankAccount: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const BG_COLOR = '#050B18';

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dob: selectedDate });
    }
  };

  const renderInput = (label, placeholder, key, icon, isPassword = false, keyboardType = 'default', showVerify = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label} *</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#5E6A81"
          value={formData[key]}
          onChangeText={(val) => setFormData({ ...formData, [key]: val })}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
        />
        {isPassword ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#5E6A81" />
          </TouchableOpacity>
        ) : (
          <Ionicons name={icon} size={20} color="#5E6A81" />
        )}
        {showVerify && (
          <TouchableOpacity style={styles.verifyBadge} onPress={() => Alert.alert("Verification", `Code sent to ${formData[key]}`)}>
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Complete Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              {renderInput("First Name", "", "firstName", "person-outline")}
            </View>
            <View style={{ flex: 1 }}>
              {renderInput("Last Name", "", "lastName", "person-outline")}
            </View>
          </View>

          {/* Date of Birth */}
          <Text style={styles.inputLabel}>Date of Birth *</Text>
          <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowDatePicker(true)}>
            <Text style={{ color: '#FFF', flex: 1 }}>{formData.dob.toDateString()}</Text>
            <Ionicons name="calendar-outline" size={20} color="#5E6A81" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={formData.dob} mode="date" display="default" onChange={handleDateChange} />
          )}

          {renderInput("Full Address", "Street, City, Postcode", "address", "location-outline")}
          
          <Text style={styles.sectionTitle}>Security & Verification</Text>
          {renderInput("Mobile Number", "+1 234...", "mobile", "call-outline", false, "phone-pad", true)}
          {renderInput("Email Address", "email@example.com", "email", "mail-outline", false, "email-address", true)}
          {renderInput("Password", "6+ letters & numbers", "password", "lock-closed-outline", true)}

          <Text style={styles.sectionTitle}>Financial & Identity</Text>
          {renderInput("Bank Account (IBAN/Account #)", "Enter details", "bankAccount", "card-outline")}

          {/* ID Upload Placeholder */}
          <Text style={styles.inputLabel}>Upload ID (Passport/Driving License) *</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={() => Alert.alert("Image Picker", "Launch Gallery")}>
            <Ionicons name="cloud-upload-outline" size={30} color="#1E90FF" />
            <Text style={styles.uploadText}>Tap to upload document</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('RoleScreen')}
           style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Create Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#050B18' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { color: '#1E90FF', fontSize: 16, fontWeight: 'bold', marginTop: 25, marginBottom: 15, textTransform: 'uppercase' },
  inputContainer: { marginBottom: 15 },
  inputLabel: { color: '#FFF', fontSize: 13, marginBottom: 8, fontWeight: '500' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10
  },
  input: { flex: 1, color: '#FFF', fontSize: 14 },
  row: { flexDirection: 'row' },
  verifyBadge: { backgroundColor: 'rgba(30, 144, 255, 0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginLeft: 10 },
  verifyText: { color: '#1E90FF', fontSize: 12, fontWeight: 'bold' },
  uploadBox: {
    height: 100,
    borderWidth: 1,
    borderColor: '#1E90FF',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 144, 255, 0.05)',
    marginTop: 5
  },
  uploadText: { color: '#8E9AAF', marginTop: 8, fontSize: 12 },
  submitButton: { backgroundColor: '#1E90FF', height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 35 },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default RegistrationScreen;