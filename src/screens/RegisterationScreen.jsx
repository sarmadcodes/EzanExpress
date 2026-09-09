import React, { useContext, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { OtpInput } from 'react-native-otp-entry';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { LOADING } from '../context/Loading';
import { USER } from '../context/User';
import { BASE_API_URI } from '../constant/API';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';

const RegistrationScreen = ({ navigation }) => {
  const BG_COLOR = '#050B18';

  const { setLoading } = useContext(LOADING);
  const { setUserData } = useContext(USER);


  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: null,
    address: '',
    mobile: '',
    email: '',
    password: '',
  });

  const [phoneData, setPhoneData] = useState(null);


  const [identityDocument, setIdentityDocument] = useState(null);

  const [registeredUser, setRegisteredUser] = useState(null);

  const [registrationToken, setRegistrationToken] = useState('');

  const [authToken, setAuthToken] = useState('');

  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);
  const [uploadingIdentity, setUploadingIdentity] = useState(false);
  const [identityUploaded, setIdentityUploaded] = useState(false);
  const [identityUploadError, setIdentityUploadError] = useState('');

  const [resendSeconds, setResendSeconds] = useState(0);


  const showError = message => {
    Toast.show({
      type: 'error',
      text1: message || 'Something went wrong. Please try again.',
    });
  };

  const showSuccess = message => {
    Toast.show({
      type: 'success',
      text1: message,
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

  const formatDateForBackend = date => {
    if (!date) {
      return '';
    }

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const validateEmail = email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const validateForm = () => {
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.dob ||
      !formData.address.trim() ||
      !formData.mobile.trim() ||
      !formData.email.trim() ||
      !formData.password
    ) {
      showError('Please fill in all required fields.');
      return false;
    }

    const fullName =
      `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

    if (fullName.length < 3) {
      showError('Name must be at least 3 characters long.');
      return false;
    }

    if (!validateEmail(formData.email)) {
      showError('Enter a valid email address.');
      return false;
    }

    if (!phoneData?.isPossible) {
  showError('Enter a valid phone number.');
  return false;
}

    if (formData.password.length < 8) {
      showError('Password must be at least 8 characters long.');
      return false;
    }


    if (!identityDocument) {
      showError('Identity document image is required.');
      return false;
    }

    if (
      ![
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ].includes(identityDocument?.type)
    ) {
      showError(
        'Only JPG, PNG, and WEBP identity document images are allowed.',
      );
      return false;
    }

    if (
      identityDocument?.fileSize &&
      identityDocument.fileSize > 5 * 1024 * 1024
    ) {
      showError('Identity document image must not exceed 5 MB.');
      return false;
    }

    return true;
  };

  const startResendCooldown = () => {
    setResendSeconds(60);

    const timer = setInterval(() => {
      setResendSeconds(previous => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          showError(
            response.errorMessage || 'Unable to select identity document.',
          );
          return;
        }

        const asset = response?.assets?.[0];

        if (!asset?.uri) {
          showError('Unable to select identity document.');
          return;
        }

        if (
          asset?.fileSize &&
          asset.fileSize > 5 * 1024 * 1024
        ) {
          showError('Identity document image must not exceed 5 MB.');
          return;
        }

        if (
          asset?.type &&
          ![
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
          ].includes(asset.type)
        ) {
          showError(
            'Only JPG, PNG, and WEBP identity document images are allowed.',
          );
          return;
        }


        setIdentityDocument({
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          fileName:
            asset.fileName ||
            `identity-document-${Date.now()}.jpg`,
          fileSize: asset.fileSize || 0,
        });
      },
    );
  };

  const uploadIdentityDocument = async token => {
    const multipartData = new FormData();

    multipartData.append('identity_document', {
      uri: identityDocument.uri,
      type: identityDocument.type,
      name: identityDocument.fileName,
    });

    const response = await axios.post(
      `${BASE_API_URI}/upload/identity-document`,
      multipartData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response?.data;
  };









  const sendEmailOtp = async token => {
    const response = await axios.post(
      `${BASE_API_URI}/register/send-email-otp`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response?.data;
  };

  const openEmailVerification = async token => {
    try {
      const otpResponse = await sendEmailOtp(token);

      showSuccess(
        otpResponse?.msg ||
          'Verification code sent successfully.',
      );

      setOtp('');
      setOtpVisible(true);
      setEmailVerified(false);
      setIdentityUploadError('');
      startResendCooldown();

      return true;
    } catch (error) {
      console.log(
        'SEND EMAIL OTP ERROR:',
        error?.response?.data || error,
      );

      showError(getBackendError(error));

      return false;
    }
  };

  const handleIdentityUpload = async (
    token = authToken,
    user = registeredUser,
  ) => {
    if (
      !token ||
      !identityDocument ||
      uploadingIdentity ||
      identityUploaded
    ) {
      return false;
    }

    setUploadingIdentity(true);
    setIdentityUploadError('');

    try {
      await uploadIdentityDocument(token);

      setIdentityUploaded(true);
      setOtpVisible(false);

      showSuccess('Identity document uploaded successfully.');

      await finishRegistration(user);

      return true;
    } catch (error) {
      console.log(
        'IDENTITY UPLOAD ERROR:',
        error?.response?.data || error,
      );

      const message = getBackendError(error);

      setIdentityUploadError(message);
      showError(message);

      return false;
    } finally {
      setUploadingIdentity(false);
    }
  };

  const OnSignUp = async () => {
    if (submitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setLoading(true);

    try {
      if (authToken && emailVerified) {
        await handleIdentityUpload(authToken, registeredUser);
        return;
      }

      if (registrationToken) {
        await openEmailVerification(registrationToken);
        return;
      }

      const fullName =
        `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

      const payload = {
        name: fullName,
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.mobile,
        date_of_birth: formatDateForBackend(formData.dob),
        address: formData.address.trim(),
        password: formData.password,
      };

      console.log('REGISTER PAYLOAD:', payload);

      const response = await axios.post(
        `${BASE_API_URI}/register`,
        payload,
      );

      const tempRegistrationToken =
        response?.data?.registrationToken;

      if (!tempRegistrationToken) {
        throw new Error('Invalid registration response.');
      }

      setRegistrationToken(tempRegistrationToken);

      await openEmailVerification(tempRegistrationToken);
    } catch (error) {
      console.log(
        'REGISTER ERROR:',
        error?.response?.data || error,
      );

      showError(getBackendError(error));
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const resendEmailOtp = async () => {
    if (
      !registrationToken ||
      resendSeconds > 0 ||
      resendingOtp ||
      emailVerified
    ) {
      return;
    }

    setResendingOtp(true);

    try {
      const response = await sendEmailOtp(registrationToken);

      showSuccess(
        response?.msg ||
          'Verification code sent successfully.',
      );

      setOtp('');
      startResendCooldown();
    } catch (error) {
      console.log(
        'RESEND OTP ERROR:',
        error?.response?.data || error,
      );

      showError(getBackendError(error));

      if (error?.response?.status === 429) {
        startResendCooldown();
      }
    } finally {
      setResendingOtp(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (verifyingOtp || uploadingIdentity) {
      return;
    }

    if (otp.trim().length !== 6) {
      showError('Verification code is required.');
      return;
    }

    if (!registrationToken) {
      showError('Registration session is missing. Please start registration again.');
      return;
    }

    setVerifyingOtp(true);
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_API_URI}/register/verify-email-otp`,
        {
          otp: otp.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${registrationToken}`,
          },
        },
      );

      if (response?.data?.verified !== true) {
        showError(
          response?.data?.error ||
            'Unable to verify email address.',
        );
        return;
      }

      const normalAuthToken = response?.data?.token;
      const updatedUser = response?.data?.user;

      if (!normalAuthToken || !updatedUser) {
        throw new Error('Invalid verification response.');
      }

      setAuthToken(normalAuthToken);
      setRegistrationToken('');
      setRegisteredUser(updatedUser);
      setUserData(updatedUser);
      setEmailVerified(true);
      setIdentityUploadError('');

      await AsyncStorage.setItem('usertoken', normalAuthToken);

      showSuccess(
        response?.data?.msg ||
          'Email verified and account created successfully.',
      );

      await handleIdentityUpload(normalAuthToken, updatedUser);
    } catch (error) {
      console.log(
        'VERIFY OTP ERROR:',
        error?.response?.data || error,
      );

      showError(getBackendError(error));
    } finally {
      setVerifyingOtp(false);
      setLoading(false);
    }
  };

  const finishRegistration = async user => {
    const finalUser = user || registeredUser;

    if (finalUser) {
      setUserData(finalUser);
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'RoleScreen' }],
    });
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={BG_COLOR}
        />

        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation?.goBack()}
              style={styles.backButton}
            >
              <Ionicons
                name="arrow-back"
                size={21}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Create Account
            </Text>

            <View style={styles.headerPlaceholder} />
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.hero}>
              <Text style={styles.heroTitle}>
                Create your account
              </Text>

              <Text style={styles.heroDescription}>
                Complete your details to get started with
                Ezan Express.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>
              PERSONAL DETAILS
            </Text>

            <View style={styles.nameRow}>
              <View style={styles.nameLeft}>
                <Input
                  type="text"
                  label="First Name"
                  placeholder="First name"
                  required
                  value={formData.firstName}
                  onChangeText={value =>
                    setFormData(previous => ({
                      ...previous,
                      firstName: value,
                    }))
                  }
                />
              </View>

              <View style={styles.nameRight}>
                <Input
                  type="text"
                  label="Last Name"
                  placeholder="Last name"
                  required
                  value={formData.lastName}
                  onChangeText={value =>
                    setFormData(previous => ({
                      ...previous,
                      lastName: value,
                    }))
                  }
                />
              </View>
            </View>

            <Input
              type="date"
              label="Date of Birth"
              placeholder="Select date of birth"
              icon="calendar-outline"
              required
              dateValue={formData.dob}
              maximumDate={new Date()}
              onDateChange={date =>
                setFormData(previous => ({
                  ...previous,
                  dob: date,
                }))
              }
            />

            <Input
              type="text"
              label="Full Address"
              placeholder="Street, City, Postcode"
              icon="location-outline"
              required
              value={formData.address}
              onChangeText={value =>
                setFormData(previous => ({
                  ...previous,
                  address: value,
                }))
              }
            />

            <Text style={styles.sectionTitle}>
              ACCOUNT DETAILS
            </Text>

            <Input
              type="phone"
              label="Mobile Number"
              required
              defaultCountry="US"
              value={formData.mobile}
              onChangeText={value =>
                setFormData(previous => ({
                  ...previous,
                  mobile: value,
                }))
              }
              onPhoneChange={setPhoneData}
            />

            <Input
              type="email"
              label="Email Address"
              placeholder="name@example.com"
              icon="mail-outline"
              required
              value={formData.email}
              onChangeText={value =>
                setFormData(previous => ({
                  ...previous,
                  email: value,
                }))
              }
            />

            <Input
              type="password"
              label="Password"
              placeholder="Minimum 8 characters"
              required
              value={formData.password}
              onChangeText={value =>
                setFormData(previous => ({
                  ...previous,
                  password: value,
                }))
              }
            />

            <Text style={styles.sectionTitle}>
              IDENTITY VERIFICATION
            </Text>

            <Text style={styles.uploadLabel}>
              Identity Document
              <Text style={styles.requiredStar}> *</Text>
            </Text>

            <Text style={styles.uploadHelper}>
              Upload your Passport or Driving License.
              JPG, PNG or WEBP up to 5 MB.
            </Text>

            {identityDocument ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={pickImage}
                style={[
                  styles.uploadBox,
                  styles.uploadBoxSelected,
                ]}
              >
                <Image
                  source={{
                    uri: identityDocument.uri,
                  }}
                  resizeMode="cover"
                  style={styles.documentPreview}
                />

                <View style={styles.documentOverlay}>
                  <View style={styles.documentInfo}>
                    <View style={styles.successIcon}>
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color="#FFFFFF"
                      />
                    </View>

                    <View style={styles.documentTextContainer}>
                      <Text
                        numberOfLines={1}
                        style={styles.documentName}
                      >
                        {identityDocument.fileName}
                      </Text>

                      <Text style={styles.documentChange}>
                        Tap to replace document
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name="camera-outline"
                    size={20}
                    color="#FFFFFF"
                  />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={pickImage}
                style={styles.uploadBox}
              >
                <View style={styles.uploadIcon}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={26}
                    color="#55A9FF"
                  />
                </View>

                <Text style={styles.uploadTitle}>
                  Upload identity document
                </Text>

                <Text style={styles.uploadText}>
                  Tap to choose an image
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.securityNote}>
              <Ionicons
                name="shield-checkmark-outline"
                size={19}
                color="#55A9FF"
              />

              <Text style={styles.securityText}>
                Your identity document is stored securely
                and used for account verification.
              </Text>
            </View>

            <View style={styles.submitContainer}>
              <Button
                text={
                  authToken && emailVerified
                    ? 'Retry Upload'
                    : registrationToken
                    ? 'Continue verification'
                    : 'Create Account'
                }
                onPress={OnSignUp}
                disabled={submitting}
                loading={submitting}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal
        visible={otpVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.otpModal}>
            {emailVerified ? (
              <>
                <View style={styles.otpIcon}>
                  <Ionicons
                    name={
                      identityUploadError
                        ? 'cloud-offline-outline'
                        : 'cloud-upload-outline'
                    }
                    size={30}
                    color={
                      identityUploadError
                        ? '#FF7B7B'
                        : '#55A9FF'
                    }
                  />
                </View>

                <Text style={styles.otpTitle}>
                  {identityUploadError
                    ? 'Document upload failed'
                    : 'Uploading document'}
                </Text>

                <Text style={styles.otpDescription}>
                  {identityUploadError
                    ? 'Your email is already verified. Retry only the identity document upload.'
                    : 'Email verified successfully. We are uploading your identity document.'}
                </Text>

                {identityUploadError ? (
                  <>
                    <View style={styles.uploadErrorBox}>
                      <Text style={styles.uploadErrorText}>
                        {identityUploadError}
                      </Text>
                    </View>

                    <Button
                      text="Retry Upload"
                      onPress={() =>
                        handleIdentityUpload(
                          authToken,
                          registeredUser,
                        )
                      }
                      disabled={uploadingIdentity || identityUploaded}
                      loading={uploadingIdentity}
                    />
                  </>
                ) : (
                  <View style={styles.uploadingState}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={19}
                      color="#55A9FF"
                    />
                    <Text style={styles.uploadingStateText}>
                      {uploadingIdentity
                        ? 'Uploading document...'
                        : 'Preparing upload...'}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <View style={styles.otpIcon}>
                  <Ionicons
                    name="mail-unread-outline"
                    size={30}
                    color="#55A9FF"
                  />
                </View>

                <Text style={styles.otpTitle}>
                  Verify your email
                </Text>

                <Text style={styles.otpDescription}>
                  We sent a 6-digit verification code to
                </Text>

                <Text
                  numberOfLines={1}
                  style={styles.otpEmail}
                >
                  {formData.email.trim()}
                </Text>

                <View style={styles.otpInputContainer}>
                  <OtpInput
                    numberOfDigits={6}
                    focusColor="#2A98FF"
                    onTextChange={setOtp}
                    theme={{
                      containerStyle:
                        styles.otpInputWrapper,
                      pinCodeContainerStyle:
                        styles.otpPin,
                      pinCodeTextStyle:
                        styles.otpPinText,
                      focusedPinCodeContainerStyle:
                        styles.otpPinFocused,
                    }}
                  />
                </View>

                <Button
                  text={
                    verifyingOtp
                      ? 'Verifying...'
                      : 'Verify Email'
                  }
                  onPress={verifyEmailOtp}
                  disabled={
                    verifyingOtp ||
                    uploadingIdentity ||
                    otp.trim().length !== 6
                  }
                  loading={verifyingOtp}
                />

                <View style={styles.resendRow}>
                  <Text style={styles.resendLabel}>
                    Didn't receive the code?
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={
                      resendSeconds > 0 ||
                      resendingOtp ||
                      verifyingOtp
                    }
                    onPress={resendEmailOtp}
                  >
                    <Text
                      style={[
                        styles.resendButtonText,
                        resendSeconds > 0 &&
                          styles.resendDisabled,
                      ]}
                    >
                      {resendingOtp
                        ? ' Sending...'
                        : resendSeconds > 0
                        ? ` Resend in ${resendSeconds}s`
                        : ' Resend'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.otpInfo}>
                  <Ionicons
                    name="time-outline"
                    size={15}
                    color="#71849A"
                  />

                  <Text style={styles.otpInfoText}>
                    Verification code expires in 10 minutes.
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050B18',
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    minHeight: 58,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#111C2B',
    borderWidth: 1,
    borderColor: '#203147',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: '#F4F7FB',
    fontSize: 17,
    fontWeight: '700',
  },

  headerPlaceholder: {
    width: 38,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 38,
  },

  hero: {
    paddingTop: 13,
    paddingBottom: 11,
  },


  heroTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight:
      Platform.OS === 'ios' ? '800' : '700',
    marginTop: 13,
    letterSpacing: -0.4,
  },

  heroDescription: {
    color: '#8395AA',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },

  sectionTitle: {
    color: '#4DA4FA',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 14,
  },

  nameRow: {
    flexDirection: 'row',
  },

  nameLeft: {
    flex: 1,
    marginRight: 6,
  },

  nameRight: {
    flex: 1,
    marginLeft: 6,
  },

  uploadLabel: {
    color: '#E9EFF7',
    fontSize: 13,
    fontWeight: '600',
  },

  requiredStar: {
    color: '#FF6B6B',
  },

  uploadHelper: {
    color: '#718399',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
    marginBottom: 10,
  },

  uploadBox: {
    width: '100%',
    minHeight: 135,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2D6597',
    backgroundColor: 'rgba(30,144,255,0.045)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  uploadBoxSelected: {
    height: 180,
    borderStyle: 'solid',
    borderColor: '#294764',
  },

  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: 'rgba(30,144,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadTitle: {
    color: '#DDE8F3',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
  },

  uploadText: {
    color: '#718399',
    fontSize: 11,
    marginTop: 4,
  },

  documentPreview: {
    width: '100%',
    height: '100%',
  },

  documentOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 58,
    backgroundColor: 'rgba(4,10,18,0.87)',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  documentInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  successIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: '#1687F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  documentTextContainer: {
    flex: 1,
    marginLeft: 9,
  },

  documentName: {
    color: '#F3F7FC',
    fontSize: 12,
    fontWeight: '700',
  },

  documentChange: {
    color: '#73879F',
    fontSize: 10,
    marginTop: 2,
  },

  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 13,
    backgroundColor: 'rgba(30,144,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.13)',
    padding: 12,
    marginTop: 13,
  },

  securityText: {
    flex: 1,
    color: '#7F92A9',
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 9,
  },

  submitContainer: {
    marginTop: 25,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  otpModal: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    backgroundColor: '#0B1523',
    borderWidth: 1,
    borderColor: '#203147',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 21,

    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.35,
        shadowRadius: 24,
      },

      android: {
        elevation: 18,
      },
    }),
  },

  otpIcon: {
    width: 61,
    height: 61,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,144,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.18)',
  },

  otpTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 15,
  },

  otpDescription: {
    color: '#7F91A7',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 7,
  },

  otpEmail: {
    color: '#58AAFC',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 3,
  },

  otpInputContainer: {
    marginTop: 23,
    marginBottom: 22,
  },

  otpInputWrapper: {
    width: '100%',
  },

  otpPin: {
    width: 43,
    height: 52,
    borderRadius: 11,
    backgroundColor: '#101C2C',
    borderWidth: 1,
    borderColor: '#25374D',
  },

  otpPinFocused: {
    borderColor: '#2A98FF',
    backgroundColor: '#12233A',
  },

  otpPinText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  resendLabel: {
    color: '#7B8DA3',
    fontSize: 12,
  },

  resendButtonText: {
    color: '#55A9FF',
    fontSize: 12,
    fontWeight: '700',
  },

  resendDisabled: {
    color: '#52647A',
  },

  uploadErrorBox: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: 'rgba(255,107,107,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.18)',
    padding: 12,
    marginTop: 18,
    marginBottom: 18,
  },

  uploadErrorText: {
    color: '#FF9A9A',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  uploadingState: {
    marginTop: 20,
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: 'rgba(30,144,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.13)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  uploadingStateText: {
    color: '#8FA2B8',
    fontSize: 12,
    marginLeft: 8,
  },

  otpInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },

  otpInfoText: {
    color: '#687B91',
    fontSize: 10,
    marginLeft: 5,
  },
});

export default RegistrationScreen;
