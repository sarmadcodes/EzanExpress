import React, { useContext, useState } from 'react';
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
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker'; // From your installed packages
import Ionicons from '@react-native-vector-icons/ionicons';
import { LOADING } from '../context/Loading';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { DIMENSIONS } from '../constant/Dimmission';
import { OtpInput } from 'react-native-otp-entry';
import axios from 'axios';
import { BASE_API_URI } from '../constant/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { USER } from '../context/User';

const RegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: new Date(),
    address: '',
    mobile: '',
    email: '',
    password: '',
    // bankAccount: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { userData, setUserData } = useContext(USER);

  const BG_COLOR = '#050B18';

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dob: selectedDate });
    }
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const renderInput = (
    label,
    placeholder,
    key,
    icon,
    isPassword = false,
    keyboardType = 'default',
    showVerify = false,
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label} *</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#5E6A81"
          value={formData[key]}
          onChangeText={val => setFormData({ ...formData, [key]: val })}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
        />
        {isPassword ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#5E6A81"
            />
          </TouchableOpacity>
        ) : (
          <Ionicons name={icon} size={20} color="#5E6A81" />
        )}
        {showVerify && (
          <TouchableOpacity
            style={styles.verifyBadge}
            // onPress={() =>
            //   Alert.alert('Verification', `Code sent to ${formData[key]}`)
            // }
            onPress={() => setIsModalVisible(true)}
          >
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const { loading, setLoading } = useContext(LOADING);
  // const navigation = useNavigation()
  const [image, setImage] = useState('');

  const OnSignUp = () => {
    setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   navigation.navigate('RoleScreen');
    // }, 4000);
    const check = Object.values(formData).some(
      e => typeof e === 'string' && e.trim() === '',
    );

    if (check) {
      Toast.show({
        text1: 'All fileds required!',
        type: 'error',
      });
      setLoading(false);
      return;
    }
    console.log(formData, 'formData');
    console.log(`${BASE_API_URI}/register`, '`${BASE_API_URI}/register`');
    axios
      .post(`${BASE_API_URI}/register`, {
        name: `${formData?.firstName}/${formData?.lastName}`,
        email: formData?.email,
        phone_number: formData?.mobile,
        date_of_birth: formData?.dob,
        address: formData?.address,
        password: formData?.password,
      })
      .then(async data => {
        console.log(data);
        setLoading(false);
        await AsyncStorage.setItem('usertoken', data?.data.token);
        setUserData(data?.data?.user);
         navigation.reset({
        index: 0,
        routes: [{ name: 'RoleScreen' }],
      });
      })
      .catch(err => {
        console.log(err.response.data);
        
        Toast.show({
        text1: 'Server error try again!',
        type: 'error',
      });
        setLoading(false);
      });
  };
  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.log(response.errorMessage);
          return;
        }

        const image = response.assets[0];
        console.log(image.uri.replace('file://', ''));
        setImage(image?.uri.replace('file://', ''));
      },
    );
  };

  // const verifyEmail = (to) =>{
  //   axios.post(`${BASE_API_URI}`)
  // }

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={BG_COLOR} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
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
                {renderInput('First Name', '', 'firstName', 'person-outline')}
              </View>
              <View style={{ flex: 1 }}>
                {renderInput('Last Name', '', 'lastName', 'person-outline')}
              </View>
            </View>

            {/* Date of Birth */}
            <Text style={styles.inputLabel}>Date of Birth *</Text>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: '#FFF', flex: 1 }}>
                {formData.dob.toDateString()}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#5E6A81" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.dob}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {renderInput(
              'Full Address',
              'Street, City, Postcode',
              'address',
              'location-outline',
            )}

            <Text style={styles.sectionTitle}>Security & Verification</Text>
            {renderInput(
              'Mobile Number',
              '+1 234...',
              'mobile',
              'call-outline',
              false,
              'phone-pad',
              true,
            )}
            {renderInput(
              'Email Address',
              'email@example.com',
              'email',
              'mail-outline',
              false,
              'email-address',
              true,
            )}
            {renderInput(
              'Password',
              '6+ letters & numbers',
              'password',
              'lock-closed-outline',
              true,
            )}

            {/* <Text style={styles.sectionTitle}>Financial & Identity</Text>
          {renderInput("Bank Account (IBAN/Account #)", "Enter details", "bankAccount", "card-outline")} */}

            {/* ID Upload Placeholder */}
            <Text style={styles.inputLabel}>
              Upload ID (Passport/Driving License) *
            </Text>
            {image ? (
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => pickImage()}
              >
                <Image
                  source={{ uri: image }}
                  resizeMode="contain"
                  style={{ width: 200, height: 200 }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={() => pickImage()}
              >
                <Ionicons
                  name="cloud-upload-outline"
                  size={30}
                  color="#1E90FF"
                />
                <Text style={styles.uploadText}>Tap to upload document</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => OnSignUp()}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Create Account</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Modal visible={isModalVisible} transparent>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setIsModalVisible(false)}
          style={{
            width: DIMENSIONS.WIDTH,
            height: DIMENSIONS.HEIGHT,
            backgroundColor: 'rgba(110, 153, 240, 0.1)',
          }}
        ></TouchableOpacity>

        <View
          style={{
            width: '90%',
            backgroundColor: BG_COLOR,
            position: 'absolute',
            borderRadius: 20,
            marginTop: DIMENSIONS.HEIGHT / 2.8,
            alignSelf: 'center',
            zIndex: 100,
            padding: 20,
          }}
        >
          <Text style={[styles.sectionTitle2, { textAlign: 'center' }]}>
            Verify
          </Text>
          <View style={{ marginTop: 20 }}>
            <OtpInput
              textProps={{ style: { color: 'white' } }}
              placeholder="******"
              numberOfDigits={6}
              onTextChange={text => console.log(text)}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              // onPress={() => OnSignUp()}
              onPress={() => setIsModalVisible(false)}
              style={styles.submitButton2}
            >
              <Text style={styles.submitButtonText}>Continue</Text>
            </TouchableOpacity>{' '}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#050B18' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  sectionTitle2: {
    color: '#1E90FF',
    fontSize: 16,
    fontWeight: 'bold',
    // marginTop: 25,
    // marginBottom: 15,
    textTransform: 'uppercase',
  },
  inputContainer: { marginBottom: 15 },
  inputLabel: {
    color: '#FFF',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
  },
  input: { flex: 1, color: '#FFF', fontSize: 14 },
  row: { flexDirection: 'row' },
  verifyBadge: {
    backgroundColor: 'rgba(30, 144, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginLeft: 10,
  },
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
    marginTop: 5,
  },
  uploadText: { color: '#8E9AAF', marginTop: 8, fontSize: 12 },
  submitButton: {
    backgroundColor: '#1E90FF',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  submitButton2: {
    backgroundColor: '#1E90FF',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 35,
  },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});

export default RegistrationScreen;
