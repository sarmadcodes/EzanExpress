import Ionicons from '@react-native-vector-icons/ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CountryPicker from './CountryPicker';
import {
  countryCodeToFlag,
  formatPhoneAsYouType,
  getCallingCodeSafe,
  getLocalDigitsFromE164,
  normalizePhoneForCountry,
  sanitizePhoneDigits,
  trimPhoneToCountryLength,
} from './PhoneUtils';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,

  type = 'text',
  multiline = false,
  numberOfLines = 1,

  icon,
  iconSize = 20,

  required = false,
  error,

  disabled = false,

  showVerify = false,
  verifyText = 'Verify',
  onVerify,

  dateValue,
  onDateChange,
  maximumDate = new Date(),
  minimumDate,

  defaultCountry = 'US',
  selectedCountryCode,
  onPhoneChange,

  containerStyle,
  inputWrapperStyle,
  inputStyle,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  const initialCountryCode = selectedCountryCode || defaultCountry;

  const [country, setCountry] = useState(() => ({
    cca2: initialCountryCode,
    callingCode: getCallingCodeSafe(initialCountryCode),
    flag: countryCodeToFlag(initialCountryCode),
    name: '',
  }));

  const [nationalNumber, setNationalNumber] = useState('');
  const lastEmittedPhoneValue = useRef(null);

  const isPassword = type === 'password';
  const isDate = type === 'date';
  const isPhone = type === 'phone';
  const isEmail = type === 'email';
  const isNumber = type === 'number';

  const keyboardType = useMemo(() => {
    if (isEmail) {
      return 'email-address';
    }

    if (isNumber) {
      return 'numeric';
    }

    return 'default';
  }, [isEmail, isNumber]);

  useEffect(() => {
    if (!isPhone) {
      return;
    }

    if (value === lastEmittedPhoneValue.current) {
      return;
    }

    if (!value) {
      setNationalNumber('');
      return;
    }

    const restored = getLocalDigitsFromE164(value, initialCountryCode);
    const parsedCountry = restored.countryCode || initialCountryCode;

    setCountry(previous => ({
      ...previous,
      cca2: parsedCountry,
      callingCode: getCallingCodeSafe(parsedCountry),
      flag: countryCodeToFlag(parsedCountry),
    }));

    setNationalNumber(restored.localDigits);
  }, [isPhone, value, initialCountryCode]);

  const renderLabel = () => {
    if (!label) {
      return null;
    }

    return (
      <Text style={styles.label}>
        {label}

        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
    );
  };

  const emitPhoneValue = (
    rawNationalNumber,
    selectedCountry = country,
  ) => {
    const normalized = normalizePhoneForCountry(
      rawNationalNumber,
      selectedCountry.cca2,
    );

    const phoneData = {
      countryCode: selectedCountry.cca2,
      countryName: selectedCountry.name || '',
      flag:
        selectedCountry.flag ||
        countryCodeToFlag(selectedCountry.cca2),
      callingCode:
        selectedCountry.callingCode ||
        getCallingCodeSafe(selectedCountry.cca2),
      nationalNumber: normalized.nationalNumber,
      e164: normalized.e164,
      isPossible: normalized.isPossible,
      isValid: normalized.isValid,
    };

    lastEmittedPhoneValue.current = normalized.e164;
    onPhoneChange?.(phoneData);
    onChangeText?.(normalized.e164);
  };

  const handlePhoneChange = text => {
    const cleanNumber = trimPhoneToCountryLength(
      sanitizePhoneDigits(text),
      country.cca2,
    );

    setNationalNumber(cleanNumber);
    emitPhoneValue(cleanNumber, country);
  };

  const handleCountrySelect = selectedCountry => {
    const nextCountry = {
      cca2: selectedCountry.cca2,
      callingCode:
        selectedCountry.callingCode ||
        getCallingCodeSafe(selectedCountry.cca2),
      flag:
        selectedCountry.flag ||
        countryCodeToFlag(selectedCountry.cca2),
      name: selectedCountry.name || '',
    };

    setCountry(nextCountry);

    const nextDigits = trimPhoneToCountryLength(
      nationalNumber,
      nextCountry.cca2,
    );

    setNationalNumber(nextDigits);
    emitPhoneValue(nextDigits, nextCountry);
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (!selectedDate) {
      return;
    }

    onDateChange?.(selectedDate);
  };

  const formatDate = date => {
    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const renderVerifyButton = () => {
    if (!showVerify) {
      return null;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.75}
        disabled={!onVerify}
        onPress={onVerify}
        style={styles.verifyButton}
      >
        <Ionicons
          name="shield-checkmark-outline"
          size={14}
          color="#55A9FF"
        />

        <Text style={styles.verifyText}>{verifyText}</Text>
      </TouchableOpacity>
    );
  };

  if (isDate) {
    return (
      <View style={[styles.container, containerStyle]}>
        {renderLabel()}

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={disabled}
          onPress={() => setShowDatePicker(true)}
          style={[
            styles.inputWrapper,
            error && styles.inputWrapperError,
            disabled && styles.disabled,
            inputWrapperStyle,
          ]}
        >
          <Text
            style={[
              styles.dateText,
              !dateValue && styles.placeholderText,
            ]}
          >
            {dateValue
              ? formatDate(dateValue)
              : placeholder || 'Select date'}
          </Text>

          <Ionicons
            name={icon || 'calendar-outline'}
            size={20}
            color="#6E8096"
          />
        </TouchableOpacity>

        {showDatePicker ? (
          <DateTimePicker
            value={dateValue || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            onChange={handleDateChange}
          />
        ) : null}

        {Platform.OS === 'ios' && showDatePicker ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDatePicker(false)}
            style={styles.dateDoneButton}
          >
            <Text style={styles.dateDoneText}>Done</Text>
          </TouchableOpacity>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
  }

  if (isPhone) {
    return (
      <View style={[styles.container, containerStyle]}>
        {renderLabel()}

        <View
          style={[
            styles.inputWrapper,
            focused && styles.inputWrapperFocused,
            error && styles.inputWrapperError,
            disabled && styles.disabled,
            inputWrapperStyle,
          ]}
        >
          <Pressable
            disabled={disabled}
            onPress={() => setCountryPickerVisible(true)}
            style={({ pressed }) => [
              styles.countryButton,
              pressed && styles.countryButtonPressed,
            ]}
          >
            <Text style={styles.flag}>{country.flag}</Text>

            <Text style={styles.dialCode}>
              +{country.callingCode}
            </Text>

            <Ionicons
              name="chevron-down"
              size={14}
              color="#718399"
            />
          </Pressable>

          <View style={styles.phoneDivider} />

          <TextInput
            value={formatPhoneAsYouType(nationalNumber, country.cca2)}
            placeholder={placeholder || 'Phone number'}
            placeholderTextColor="#56677D"
            keyboardType="phone-pad"
            editable={!disabled}
            autoCorrect={false}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChangeText={handlePhoneChange}
            style={[
              styles.input,
              styles.phoneInput,
              inputStyle,
            ]}
          />

          {renderVerifyButton()}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {countryPickerVisible ? (
          <CountryPicker
            visible
            selectedCountryCode={country.cca2}
            onClose={() => setCountryPickerVisible(false)}
            onSelect={handleCountrySelect}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {renderLabel()}

      <View
        style={[
          styles.inputWrapper,
          multiline && styles.inputWrapperMultiline,
          focused && styles.inputWrapperFocused,
          error && styles.inputWrapperError,
          disabled && styles.disabled,
          inputWrapperStyle,
        ]}
      >
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#56677D"
          keyboardType={keyboardType}
          editable={!disabled}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={isEmail ? 'none' : 'sentences'}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
        />

        {isPassword ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPassword(previous => !previous)}
            style={styles.rightAction}
          >
            <Ionicons
              name={
                showPassword
                  ? 'eye-outline'
                  : 'eye-off-outline'
              }
              size={20}
              color={focused ? '#55A9FF' : '#718399'}
            />
          </TouchableOpacity>
        ) : showVerify ? (
          renderVerifyButton()
        ) : icon ? (
          <Ionicons
            name={icon}
            size={iconSize}
            color={focused ? '#55A9FF' : '#64778F'}
          />
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },

  label: {
    color: '#E9EFF7',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    marginBottom: 8,
  },

  required: {
    color: '#FF6B6B',
    fontWeight: '700',
  },

  inputWrapper: {
    width: '100%',
    minHeight: 55,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#1E2D40',
    backgroundColor: '#0E1827',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputWrapperFocused: {
    borderColor: '#278EF5',
    backgroundColor: '#101C2D',
  },

  inputWrapperMultiline: {
    minHeight: 110,
    alignItems: 'flex-start',
  },

  inputWrapperError: {
    borderColor: '#D85F69',
  },

  input: {
    flex: 1,
    color: '#F5F8FC',
    fontSize: 15,
    paddingVertical: Platform.OS === 'ios' ? 16 : 11,
  },

  multilineInput: {
    textAlignVertical: 'top',
  },

  disabled: {
    opacity: 0.55,
  },

  rightAction: {
    width: 36,
    height: 42,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  placeholderText: {
    color: '#56677D',
  },

  dateText: {
    flex: 1,
    color: '#F5F8FC',
    fontSize: 15,
  },

  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: 9,
    borderRadius: 9,
  },

  countryButtonPressed: {
    backgroundColor: '#1A2A3D',
    opacity: 0.9,
  },

  flag: {
    fontSize: 22,
    marginRight: 7,
  },

  dialCode: {
    color: '#E6EDF6',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },

  phoneDivider: {
    width: 1,
    height: 26,
    backgroundColor: '#293A4F',
    marginLeft: 10,
    marginRight: 2,
  },

  phoneInput: {
    paddingLeft: 11,
  },

  verifyButton: {
    minHeight: 32,
    paddingHorizontal: 10,
    borderRadius: 9,
    backgroundColor: 'rgba(30,144,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  verifyText: {
    color: '#55A9FF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },

  errorText: {
    color: '#E87982',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
    marginLeft: 2,
  },

  dateDoneButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 9,
    backgroundColor: '#162439',
  },

  dateDoneText: {
    color: '#55A9FF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default Input;
