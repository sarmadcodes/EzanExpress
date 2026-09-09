import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import React, {useEffect, useMemo, useState} from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import BackBar from '../components/BackBar';
import Input from '../components/Input/Input';
import Button from '../components/Button/Button';
import {BASE_API_URI} from '../constant/API';

const PARCEL_TYPES = [
  'Medicine',
  'Electronics',
  'Books',
  'Cultural foods',
  'Cultural goods',
  'Clothes',
  'Spareparts',
  'Stationaries',
  'Others',
];

const DEFAULT_MESSAGE =
  'Can you please take this parcel/document for me?';

const NewParcelRequest = ({navigation, route}) => {
  const flight = route?.params?.flight || route?.params?.traveler || {};

  const [itemType, setItemType] = useState('parcel');
  const [selectedParcelTypes, setSelectedParcelTypes] = useState([]);
  const [otherParcelType, setOtherParcelType] = useState('');
  const [weight, setWeight] = useState('');

  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});


  const flightId = flight?._id;

  const travelerId =
    flight?.passenger?._id ||
    flight?.user_id ||
    route?.params?.traveler?.passenger?._id ||
    route?.params?.traveler?.user_id;

  const travelerName =
    flight?.passenger?.name || 'Traveler';

  const departureCity =
    flight?.departure_airport_city ||
    flight?.departure ||
    '--';

  const destinationCity =
    flight?.destination_airport_city ||
    flight?.destination ||
    '--';

  const availableSpace = Math.max(
    0,
    Number(flight?.available_space_in_kg) || 0,
  );

  const allowedItems = String(flight?.allowed_items || 'both')
    .trim()
    .toLowerCase();


  const showError = text => {
    Toast.show({
      type: 'error',
      text1: text || 'Something went wrong. Please try again.',
    });
  };

  const showSuccess = text => {
    Toast.show({
      type: 'success',
      text1: text,
    });
  };

  const getBackendError = error => {
    return (
      error?.response?.data?.error ||
      error?.response?.data?.msg ||
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong. Please try again.'
    );
  };

  const formatDate = value => {
    if (!value) {
      return '--';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '--';
    }

    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const isTypeAllowed = type => {
    if (allowedItems === 'both') {
      return true;
    }

    return allowedItems === type;
  };


  const weightInGrams = useMemo(() => {
    const value = Number(weight);

    if (!Number.isFinite(value) || value <= 0) {
      return 0;
    }

    if (itemType === 'document') {
      return Math.round(value);
    }

    return Math.round(value * 1000);
  }, [weight, itemType]);

  const requestedWeightKg = weightInGrams / 1000;


  const selectItemType = type => {
    if (!isTypeAllowed(type)) {
      return;
    }

    setItemType(type);
    setWeight('');
    setQuote(null);

    setErrors(previous => ({
      ...previous,
      itemType: '',
      weight: '',
    }));

    if (type === 'document') {
      setSelectedParcelTypes([]);
      setOtherParcelType('');
    }
  };

  useEffect(() => {
    if (allowedItems === 'document') {
      setItemType('document');
    } else if (allowedItems === 'parcel') {
      setItemType('parcel');
    }
  }, [allowedItems]);


  const toggleParcelType = type => {
    setQuote(null);

    setSelectedParcelTypes(previous => {
      if (previous.includes(type)) {
        return previous.filter(item => item !== type);
      }

      return [...previous, type];
    });

    setErrors(previous => ({
      ...previous,
      parcelTypes: '',
    }));

    if (type === 'Others' && selectedParcelTypes.includes(type)) {
      setOtherParcelType('');
    }
  };


  const validateQuoteData = () => {
    const nextErrors = {};

    if (!flightId) {
      nextErrors.flight = 'Flight information is unavailable.';
    }

    if (!travelerId) {
      nextErrors.traveler = 'Traveler information is unavailable.';
    }

    if (!isTypeAllowed(itemType)) {
      nextErrors.itemType =
        `This traveler is not accepting ${itemType} items.`;
    }

    if (itemType === 'parcel' && selectedParcelTypes.length === 0) {
      nextErrors.parcelTypes =
        'Select at least one parcel category.';
    }

    if (
      itemType === 'parcel' &&
      selectedParcelTypes.includes('Others') &&
      !otherParcelType.trim()
    ) {
      nextErrors.otherParcelType =
        'Please enter the parcel category.';
    }

    if (!weight.trim()) {
      nextErrors.weight = 'Weight is required.';
    } else if (weightInGrams <= 0) {
      nextErrors.weight = 'Enter a valid weight.';
    } else if (requestedWeightKg > availableSpace) {
      nextErrors.weight =
        `Traveler has only ${availableSpace} kg available.`;
    }

    setErrors(previous => ({
      ...previous,
      ...nextErrors,
    }));

    return Object.keys(nextErrors).length === 0;
  };

  const validateRequest = () => {
    if (!validateQuoteData()) {
      return false;
    }

    const nextErrors = {};

    if (!receiverName.trim()) {
      nextErrors.receiverName = 'Receiver name is required.';
    }

    if (!receiverPhone.trim()) {
      nextErrors.receiverPhone = 'Receiver phone number is required.';
    }

    if (!message.trim()) {
      nextErrors.message = 'Message is required.';
    }

    setErrors(previous => ({
      ...previous,
      ...nextErrors,
    }));

    return Object.keys(nextErrors).length === 0;
  };


  const getBasePayload = () => {
    return {
      flight_id: flightId,
      passenger_id: travelerId,

      item_type: itemType,

      parcel_types:
        itemType === 'parcel'
          ? selectedParcelTypes.map(item => item.toLowerCase())
          : [],

      other_parcel_type:
        itemType === 'parcel' &&
        selectedParcelTypes.includes('Others')
          ? otherParcelType.trim()
          : '',

      weight_in_grams: weightInGrams,
    };
  };


  const getQuote = async () => {
    if (!validateQuoteData()) {
      return;
    }

    try {
      setQuoteLoading(true);
      setQuote(null);

      const token = await AsyncStorage.getItem('usertoken');

      if (!token) {
        showError('Your session has expired. Please login again.');
        return;
      }

      const response = await axios.post(
        `${BASE_API_URI}/request/quote`,
        getBasePayload(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const quoteData =
        response?.data?.quote ||
        response?.data?.data?.quote ||
        response?.data?.data ||
        response?.data;

      setQuote(quoteData);
    } catch (error) {
      console.log(
        'REQUEST QUOTE ERROR:',
        error?.response?.data || error?.message || error,
      );

      showError(getBackendError(error));
    } finally {
      setQuoteLoading(false);
    }
  };


  useEffect(() => {
    setQuote(null);
  }, [
    itemType,
    weight,
    selectedParcelTypes,
    otherParcelType,
  ]);


  const handleSendRequest = async () => {
  if (!validateRequest()) {
    return;
  }

  if (!quote) {
    showError('Please calculate the price first.');
    return;
  }

  try {
    setSubmitting(true);

    const token = await AsyncStorage.getItem('usertoken');

    if (!token) {
      showError('Your session has expired. Please login again.');
      return;
    }

    const payload = {
      ...getBasePayload(),

      receiver: {
        name: receiverName.trim(),
        phone_number: receiverPhone.trim(),
      },

      message: message.trim(),
    };

    const response = await axios.post(
      `${BASE_API_URI}/request`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(
      'CREATE REQUEST RESPONSE:',
      response?.data,
    );

    const createdRequest =
      response?.data?.request ||
      response?.data?.data?.request ||
      response?.data?.data ||
      {};

    showSuccess(
      response?.data?.msg ||
        response?.data?.message ||
        'Request sent successfully.',
    );

    navigation.replace('RequestSuccess', {
      request: createdRequest,
      flight,
    });
  } catch (error) {
    console.log(
      'CREATE REQUEST ERROR:',
      error?.response?.data ||
        error?.message ||
        error,
    );

    showError(getBackendError(error));
  } finally {
    setSubmitting(false);
  }
};


  const quoteAmount =
    quote?.amount ??
    quote?.price ??
    0;

  const platformFee =
    quote?.platform_fee ?? 0;

  const totalAmount =
    quote?.total_amount ??
    quote?.total ??
    quoteAmount + platformFee;

  const currency = String(
    quote?.currency || 'usd',
  ).toUpperCase();


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B121C"
      />

      <View style={styles.header}>
        <BackBar title="Send Request" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.tripCard}>
          <View style={styles.travelerRow}>
            <View style={styles.avatar}>
              <Ionicons
                name="person-outline"
                size={21}
                color="#55A9FF"
              />
            </View>

            <View style={styles.travelerInfo}>
              <Text style={styles.smallLabel}>
                SENDING WITH
              </Text>

              <Text
                numberOfLines={1}
                style={styles.travelerName}
              >
                {travelerName}
              </Text>
            </View>

            <View style={styles.spaceBadge}>
              <Text style={styles.spaceBadgeText}>
                {availableSpace} kg
              </Text>
            </View>
          </View>

          <View style={styles.routeRow}>
            <View style={styles.routeSide}>
              <Text
                numberOfLines={1}
                style={styles.routeCity}
              >
                {departureCity}
              </Text>

              <Text style={styles.routeTime}>
                {flight?.departure_time || '--'}
              </Text>
            </View>

            <View style={styles.routeMiddle}>
              <View style={styles.routeLine} />

              <View style={styles.planeCircle}>
                <Ionicons
                  name="airplane"
                  size={14}
                  color="#55A9FF"
                />
              </View>

              <View style={styles.routeLine} />
            </View>

            <View
              style={[
                styles.routeSide,
                styles.routeRight,
              ]}
            >
              <Text
                numberOfLines={1}
                style={styles.routeCity}
              >
                {destinationCity}
              </Text>

              <Text style={styles.routeTime}>
                {flight?.arrival_time || '--'}
              </Text>
            </View>
          </View>

          <View style={styles.tripFooter}>
            <View style={styles.tripMeta}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color="#72869B"
              />

              <Text style={styles.tripMetaText}>
                {formatDate(flight?.travel_date)}
              </Text>
            </View>

            {flight?.airline_name ? (
              <View style={styles.tripMeta}>
                <Ionicons
                  name="airplane-outline"
                  size={14}
                  color="#72869B"
                />

                <Text
                  numberOfLines={1}
                  style={styles.tripMetaText}
                >
                  {flight.airline_name}
                </Text>
              </View>
            ) : null}
          </View>
        </View>


        <Text style={styles.sectionTitle}>
          What are you sending?
        </Text>

        <View style={styles.typeRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!isTypeAllowed('document')}
            onPress={() => selectItemType('document')}
            style={[
              styles.typeButton,
              itemType === 'document' && styles.typeButtonActive,
              !isTypeAllowed('document') && styles.typeButtonDisabled,
            ]}
          >
            <View
              style={[
                styles.typeIcon,
                itemType === 'document' && styles.typeIconActive,
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color={
                  itemType === 'document'
                    ? '#FFFFFF'
                    : '#7F94AA'
                }
              />
            </View>

            <Text
              style={[
                styles.typeTitle,
                itemType === 'document' && styles.typeTitleActive,
              ]}
            >
              Document
            </Text>

            <Text style={styles.typeSubtitle}>
              Papers & files
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={!isTypeAllowed('parcel')}
            onPress={() => selectItemType('parcel')}
            style={[
              styles.typeButton,
              itemType === 'parcel' && styles.typeButtonActive,
              !isTypeAllowed('parcel') && styles.typeButtonDisabled,
            ]}
          >
            <View
              style={[
                styles.typeIcon,
                itemType === 'parcel' && styles.typeIconActive,
              ]}
            >
              <Ionicons
                name="cube-outline"
                size={22}
                color={
                  itemType === 'parcel'
                    ? '#FFFFFF'
                    : '#7F94AA'
                }
              />
            </View>

            <Text
              style={[
                styles.typeTitle,
                itemType === 'parcel' && styles.typeTitleActive,
              ]}
            >
              Parcel
            </Text>

            <Text style={styles.typeSubtitle}>
              Package & goods
            </Text>
          </TouchableOpacity>
        </View>

        {errors.itemType ? (
          <Text style={styles.errorText}>
            {errors.itemType}
          </Text>
        ) : null}


        {itemType === 'parcel' ? (
          <>
            <Text style={styles.fieldHeading}>
              Parcel Category
              <Text style={styles.required}> *</Text>
            </Text>

            <Text style={styles.helperText}>
              Select all categories that apply.
            </Text>

            <View style={styles.chipContainer}>
              {PARCEL_TYPES.map(type => {
                const selected =
                  selectedParcelTypes.includes(type);

                return (
                  <TouchableOpacity
                    key={type}
                    activeOpacity={0.8}
                    onPress={() => toggleParcelType(type)}
                    style={[
                      styles.chip,
                      selected && styles.chipActive,
                    ]}
                  >
                    {selected ? (
                      <Ionicons
                        name="checkmark"
                        size={13}
                        color="#FFFFFF"
                      />
                    ) : null}

                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {errors.parcelTypes ? (
              <Text style={styles.errorText}>
                {errors.parcelTypes}
              </Text>
            ) : null}

            {selectedParcelTypes.includes('Others') ? (
              <Input
                label="Other Category"
                placeholder="Enter parcel category"
                value={otherParcelType}
                onChangeText={value => {
                  setOtherParcelType(value);

                  setErrors(previous => ({
                    ...previous,
                    otherParcelType: '',
                  }));
                }}
                icon="create-outline"
                required
                error={errors.otherParcelType}
              />
            ) : null}
          </>
        ) : null}


        <Input
          label={
            itemType === 'document'
              ? 'Weight (grams)'
              : 'Weight (kg)'
          }
          placeholder={
            itemType === 'document'
              ? 'e.g. 200'
              : 'e.g. 2.5'
          }
          value={weight}
          onChangeText={value => {
            setWeight(value);

            setErrors(previous => ({
              ...previous,
              weight: '',
            }));
          }}
          keyboardType="decimal-pad"
          icon="scale-outline"
          required
          error={errors.weight}
        />

        <View style={styles.weightHint}>
          <Ionicons
            name="information-circle-outline"
            size={15}
            color="#71869C"
          />

          <Text style={styles.weightHintText}>
            Traveler currently has {availableSpace} kg available.
          </Text>
        </View>


        <View style={styles.quoteSection}>
          {!quote ? (
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={quoteLoading}
              onPress={getQuote}
              style={styles.quoteButton}
            >
              {quoteLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#55A9FF"
                />
              ) : (
                <>
                  <Ionicons
                    name="calculator-outline"
                    size={18}
                    color="#55A9FF"
                  />

                  <Text style={styles.quoteButtonText}>
                    Calculate Price
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.priceCard}>
              <View style={styles.priceHeader}>
                <View>
                  <Text style={styles.priceEyebrow}>
                    PRICE QUOTE
                  </Text>

                  <Text style={styles.priceTitle}>
                    Request Price
                  </Text>
                </View>

                <View style={styles.quoteReady}>
                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color="#22C55E"
                  />

                  <Text style={styles.quoteReadyText}>
                    Calculated
                  </Text>
                </View>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>
                  Parcel price
                </Text>

                <Text style={styles.priceValue}>
                  {currency} {Number(quoteAmount || 0).toFixed(2)}
                </Text>
              </View>

              {Number(platformFee) > 0 ? (
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    Platform fee
                  </Text>

                  <Text style={styles.priceValue}>
                    {currency} {Number(platformFee).toFixed(2)}
                  </Text>
                </View>
              ) : null}

              <View style={styles.priceDivider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Total
                </Text>

                <Text style={styles.totalValue}>
                  {currency} {Number(totalAmount || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          )}
        </View>


        <Text style={styles.sectionTitle}>
          Receiver Details
        </Text>

        <Input
          label="Receiver Full Name"
          placeholder="Enter receiver name"
          value={receiverName}
          onChangeText={value => {
            setReceiverName(value);

            setErrors(previous => ({
              ...previous,
              receiverName: '',
            }));
          }}
          icon="person-outline"
          required
          error={errors.receiverName}
        />

        <Input
          label="Receiver Phone Number"
          placeholder="Enter receiver phone number"
          value={receiverPhone}
          onChangeText={value => {
            setReceiverPhone(value);

            setErrors(previous => ({
              ...previous,
              receiverPhone: '',
            }));
          }}
          keyboardType="phone-pad"
          icon="call-outline"
          required
          error={errors.receiverPhone}
        />


        <Text style={styles.sectionTitle}>
          Message
        </Text>

        <Input
          label="Message to Traveler"
          placeholder="Enter message"
          value={message}
          onChangeText={value => {
            setMessage(value);

            setErrors(previous => ({
              ...previous,
              message: '',
            }));
          }}
          multiline
          numberOfLines={4}
          required
          error={errors.message}
        />

        <View style={styles.messageNote}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#55A9FF"
          />

          <Text style={styles.messageNoteText}>
            For safety, avoid writing specific valuable product names in parcel
            details.
          </Text>
        </View>


        <View style={styles.buttonContainer}>
          <Button
            text="Send Request"
            icon="paper-plane-outline"
            loading={submitting}
            disabled={submitting || quoteLoading}
            onPress={handleSendRequest}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewParcelRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
  },

  header: {
    paddingHorizontal: 15,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 40,
  },


  tripCard: {
    backgroundColor: '#101B2A',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#1D3046',
    padding: 15,
    marginBottom: 25,
  },

  travelerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(39,142,245,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  travelerInfo: {
    flex: 1,
    marginLeft: 10,
  },

  smallLabel: {
    color: '#5D7188',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  travelerName: {
    color: '#F1F6FC',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },

  spaceBadge: {
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderRadius: 9,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  spaceBadgeText: {
    color: '#35C976',
    fontSize: 10,
    fontWeight: '800',
  },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 13,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#1B2C40',
  },

  routeSide: {
    width: '31%',
  },

  routeRight: {
    alignItems: 'flex-end',
  },

  routeCity: {
    color: '#EDF4FB',
    fontSize: 13,
    fontWeight: '800',
  },

  routeTime: {
    color: '#71869C',
    fontSize: 9,
    marginTop: 4,
  },

  routeMiddle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },

  routeLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#29415C',
  },

  planeCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#0C1725',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },

  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 11,
  },

  tripMeta: {
    maxWidth: '48%',
    flexDirection: 'row',
    alignItems: 'center',
  },

  tripMetaText: {
    flexShrink: 1,
    color: '#71869C',
    fontSize: 9,
    marginLeft: 5,
  },


  sectionTitle: {
    color: '#4DA4FA',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 5,
    marginBottom: 14,
  },

  fieldHeading: {
    color: '#E9EFF7',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 5,
  },

  required: {
    color: '#FF6B6B',
  },

  helperText: {
    color: '#667B91',
    fontSize: 10,
    marginBottom: 11,
  },


  typeRow: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 20,
  },

  typeButton: {
    flex: 1,
    minHeight: 112,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#1D3046',
    backgroundColor: '#101B2A',
    padding: 13,
  },

  typeButtonActive: {
    borderColor: '#278EF5',
    backgroundColor: 'rgba(39,142,245,0.08)',
  },

  typeButtonDisabled: {
    opacity: 0.35,
  },

  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#172536',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  typeIconActive: {
    backgroundColor: '#2187ED',
  },

  typeTitle: {
    color: '#A5B5C6',
    fontSize: 13,
    fontWeight: '800',
  },

  typeTitleActive: {
    color: '#F3F8FD',
  },

  typeSubtitle: {
    color: '#63778C',
    fontSize: 9,
    marginTop: 3,
  },


  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 7,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#25384C',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 9,
    marginRight: 7,
    marginBottom: 8,
    gap: 4,
  },

  chipActive: {
    backgroundColor: '#2187ED',
    borderColor: '#2187ED',
  },

  chipText: {
    color: '#8195AA',
    fontSize: 10,
    fontWeight: '600',
  },

  chipTextActive: {
    color: '#FFFFFF',
  },

  errorText: {
    color: '#FF6B6B',
    fontSize: 10,
    marginTop: -2,
    marginBottom: 10,
  },


  weightHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -5,
    marginBottom: 21,
    paddingHorizontal: 2,
  },

  weightHintText: {
    flex: 1,
    color: '#71869C',
    fontSize: 9,
    marginLeft: 5,
  },


  quoteSection: {
    marginBottom: 27,
  },

  quoteButton: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#24415E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  quoteButtonText: {
    color: '#55A9FF',
    fontSize: 12,
    fontWeight: '800',
  },

  priceCard: {
    backgroundColor: '#101B2A',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#1D3046',
    padding: 15,
  },

  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  priceEyebrow: {
    color: '#536A82',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  priceTitle: {
    color: '#EDF4FB',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },

  quoteReady: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quoteReadyText: {
    color: '#22C55E',
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 4,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },

  priceLabel: {
    color: '#70859A',
    fontSize: 10,
  },

  priceValue: {
    color: '#C9D6E3',
    fontSize: 10,
    fontWeight: '700',
  },

  priceDivider: {
    height: 1,
    backgroundColor: '#1E3044',
    marginVertical: 5,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  totalLabel: {
    color: '#E7EFF7',
    fontSize: 12,
    fontWeight: '700',
  },

  totalValue: {
    color: '#55A9FF',
    fontSize: 18,
    fontWeight: '900',
  },


  messageNote: {
    flexDirection: 'row',
    backgroundColor: 'rgba(39,142,245,0.06)',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.13)',
    padding: 11,
    marginTop: -5,
  },

  messageNoteText: {
    flex: 1,
    color: '#71869C',
    fontSize: 9,
    lineHeight: 14,
    marginLeft: 7,
  },

  buttonContainer: {
    marginTop: 27,
  },
});
