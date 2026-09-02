import {
  AsYouType,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
} from 'libphonenumber-js';
import { Metadata } from 'libphonenumber-js/core';
import mobileMetadata from 'libphonenumber-js/metadata.mobile.json';

const maxMobileNationalDigitsByCountry = new Map();

const getMaxMobileNationalDigits = countryCode => {
  if (maxMobileNationalDigitsByCountry.has(countryCode)) {
    return maxMobileNationalDigitsByCountry.get(countryCode);
  }

  let maximumLength = null;

  try {
    const metadata = new Metadata(mobileMetadata);
    metadata.selectNumberingPlan(countryCode);

    const possibleLengths =
      metadata.type('MOBILE')?.possibleLengths() ||
      metadata.possibleLengths();

    const validLengths = possibleLengths?.filter(
      length => length > 0,
    );

    if (validLengths?.length) {
      maximumLength = Math.max(...validLengths);
    }
  } catch (error) {
    maximumLength = null;
  }

  maxMobileNationalDigitsByCountry.set(
    countryCode,
    maximumLength,
  );

  return maximumLength;
};

const isPhoneTooLong = (digits, countryCode) => {
  if (
    validatePhoneNumberLength(digits, countryCode) === 'TOO_LONG'
  ) {
    return true;
  }

  const maximumLength = getMaxMobileNationalDigits(countryCode);

  if (!maximumLength) {
    return false;
  }

  const parsed = parsePhoneNumberFromString(digits, countryCode);

  return (parsed?.nationalNumber?.length || 0) > maximumLength;
};

export const sanitizePhoneDigits = value =>
  (value || '').replace(/\D/g, '');

export const countryCodeToFlag = countryCode => {
  if (!countryCode || countryCode.length !== 2) {
    return '🌐';
  }

  return countryCode
    .toUpperCase()
    .split('')
    .map(char =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    )
    .join('');
};

export const getCallingCodeSafe = countryCode => {
  try {
    return getCountryCallingCode(countryCode);
  } catch (error) {
    return '';
  }
};

export const formatPhoneAsYouType = (
  rawValue,
  countryCode,
) => {
  const digits = sanitizePhoneDigits(rawValue);

  if (!digits) {
    return '';
  }

  try {
    return new AsYouType(countryCode).input(digits);
  } catch (error) {
    return digits;
  }
};

export const trimPhoneToCountryLength = (
  rawValue,
  countryCode,
) => {
  let digits = sanitizePhoneDigits(rawValue);

  if (!digits) {
    return '';
  }

  try {
    while (
      digits.length > 0 &&
      isPhoneTooLong(digits, countryCode)
    ) {
      digits = digits.slice(0, -1);
    }
  } catch (error) {

  }

  return digits;
};

export const normalizePhoneForCountry = (
  rawValue,
  countryCode,
) => {
  const inputDigits = sanitizePhoneDigits(rawValue);

  if (!inputDigits) {
    return {
      inputDigits: '',
      nationalNumber: '',
      e164: '',
      isPossible: false,
      isValid: false,
      parsed: null,
    };
  }

  try {
    const parsed = parsePhoneNumberFromString(
      inputDigits,
      countryCode,
    );

    if (!parsed) {
      return {
        inputDigits,
        nationalNumber: inputDigits,
        e164: '',
        isPossible: false,
        isValid: false,
        parsed: null,
      };
    }

    const isPossible =
      parsed.isPossible?.() ?? false;

    const isValid =
      parsed.isValid?.() ?? false;

    return {
      inputDigits,

      nationalNumber:
        parsed.nationalNumber || inputDigits,

    
      e164: isPossible
        ? parsed.number || ''
        : '',

      isPossible,
      isValid,
      parsed,
    };
  } catch (error) {
    return {
      inputDigits,
      nationalNumber: inputDigits,
      e164: '',
      isPossible: false,
      isValid: false,
      parsed: null,
    };
  }
};

export const getLocalDigitsFromE164 = (
  value,
  fallbackCountryCode,
) => {
  if (!value) {
    return {
      countryCode: fallbackCountryCode,
      localDigits: '',
      parsed: null,
    };
  }

  try {
    const parsed =
      parsePhoneNumberFromString(value);

    if (!parsed) {
      return {
        countryCode: fallbackCountryCode,
        localDigits:
          sanitizePhoneDigits(value),
        parsed: null,
      };
      }
      
    const localDigits = sanitizePhoneDigits(
      parsed.formatNational(),
    );

    return {
      countryCode:
        parsed.country ||
        fallbackCountryCode,
      localDigits,
      parsed,
    };
  } catch (error) {
    return {
      countryCode: fallbackCountryCode,
      localDigits:
        sanitizePhoneDigits(value),
      parsed: null,
    };
  }
};
