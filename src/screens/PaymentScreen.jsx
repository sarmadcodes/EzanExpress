import Ionicons from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useEffect, useState} from 'react';

import {
  ActivityIndicator,
  Alert,
  AppState,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import BackBar from '../components/BackBar';
import Button from '../components/Button/Button';
import {BASE_API_URI} from '../constant/API';

const PaymentScreen = ({navigation, route}) => {
  const request = route?.params?.request || {};

  const [loading, setLoading] = useState(false);

  const currency = String(
    request?.currency || 'usd',
  ).toUpperCase();

  const formatMoney = value => {
    return `${currency} ${Number(
      value || 0,
    ).toFixed(2)}`;
  };

  const formatWeight = grams => {
    const value = Number(grams || 0);

    if (value >= 1000) {
      const kg = value / 1000;

      return `${
        Number.isInteger(kg)
          ? kg
          : kg.toFixed(2)
      } kg`;
    }

    return `${value} g`;
  };

  /*
  |--------------------------------------------------------------------------
  | Get Latest Request
  |--------------------------------------------------------------------------
  */

  const getUpdatedRequest = async token => {
    try {
      const response = await axios.get(
        `${BASE_API_URI}/request`,
        {
          params: {
            type: 'sent',
            limit: 100,
          },

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const requests =
        response?.data?.requests ||
        response?.data?.data?.requests ||
        [];

      const updatedRequest = (
        Array.isArray(requests)
          ? requests
          : []
      ).find(
        item =>
          String(item?._id) ===
          String(request?._id),
      );

      return updatedRequest || null;
    } catch (error) {
      console.log(
        'PAYMENT STATUS CHECK ERROR:',
        error?.response?.data ||
          error?.message ||
          error,
      );

      return null;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Check Payment Status
  |--------------------------------------------------------------------------
  |
  | Stripe webhook is source of truth.
  |
  | Frontend does NOT mark request as paid.
  |
  */

  const checkPaymentStatus = async () => {
    try {
      const token =
        await AsyncStorage.getItem(
          'usertoken',
        );

      if (!token) {
        return;
      }

      const updatedRequest =
        await getUpdatedRequest(token);

      if (
        String(
          updatedRequest?.payment_status,
        ).toLowerCase() === 'paid'
      ) {
        navigation.replace(
          'PaymentSuccess',
          {
            request: updatedRequest,
          },
        );
      }
    } catch (error) {
      console.log(
        'PAYMENT REFRESH ERROR:',
        error?.response?.data ||
          error?.message ||
          error,
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Browser -> App Return
  |--------------------------------------------------------------------------
  |
  | Stripe Checkout opens in browser.
  |
  | When user returns to the app,
  | request is refreshed from backend.
  |
  */

  useEffect(() => {
    let previousState =
      AppState.currentState;

    const subscription =
      AppState.addEventListener(
        'change',
        nextState => {
          const returnedToApp =
            /inactive|background/.test(
              previousState,
            ) &&
            nextState === 'active';

          previousState = nextState;

          if (returnedToApp) {
            checkPaymentStatus();
          }
        },
      );

    return () => {
      subscription.remove();
    };
  }, [request?._id]);

  /*
  |--------------------------------------------------------------------------
  | Start Stripe Hosted Checkout
  |--------------------------------------------------------------------------
  */

  const handlePayment = async () => {
    if (loading) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Request Validation
    |--------------------------------------------------------------------------
    */

    if (!request?._id) {
      Alert.alert(
        'Payment Error',
        'Request information is missing.',
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Traveler Approval Required
    |--------------------------------------------------------------------------
    */

    if (
      String(
        request?.status,
      ).toLowerCase() !== 'approved'
    ) {
      Alert.alert(
        'Payment Not Available',
        'Traveler must accept this request before payment.',
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Already Paid
    |--------------------------------------------------------------------------
    */

    if (
      String(
        request?.payment_status,
      ).toLowerCase() === 'paid'
    ) {
      Alert.alert(
        'Already Paid',
        'This request has already been paid.',
      );

      return;
    }

    try {
      setLoading(true);

      /*
      |--------------------------------------------------------------------------
      | Auth Token
      |--------------------------------------------------------------------------
      */

      const token =
        await AsyncStorage.getItem(
          'usertoken',
        );

      if (!token) {
        Alert.alert(
          'Session Expired',
          'Please login again.',
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Create Checkout Session
      |--------------------------------------------------------------------------
      */

      const response = await axios.post(
        `${BASE_API_URI}/request/checkout-session`,
        {
          request_id: request._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const paymentData =
  response?.data?.data ||
  response?.data ||
  {};

if (
  String(
    paymentData?.payment_status,
  ).toLowerCase() === 'paid'
) {
  const updatedRequest =
    await getUpdatedRequest(token);

  if (
    String(
      updatedRequest?.payment_status,
    ).toLowerCase() === 'paid'
  ) {
    navigation.replace(
      'PaymentSuccess',
      {
        request: updatedRequest,
      },
    );

    return;
  }

  Alert.alert(
    'Payment Processing',
    'Your payment was successful. Please wait a moment while we confirm it.',
  );

  return;
}

const checkoutUrl =
  paymentData?.url;

if (!checkoutUrl) {
  throw new Error(
    'Stripe Checkout URL was not returned.',
  );
}

console.log(
  'STRIPE CHECKOUT URL:',
  checkoutUrl,
);

await Linking.openURL(
  checkoutUrl,
);

      /*
      |--------------------------------------------------------------------------
      | Open Stripe Hosted Checkout
      |--------------------------------------------------------------------------
      */

    //   const supported =
    //     await Linking.canOpenURL(
    //       checkoutUrl,
    //     );

    //   if (!supported) {
    //     throw new Error(
    //       'Unable to open Stripe Checkout.',
    //     );
    //   }

    //   await Linking.openURL(
    //     checkoutUrl,
        //   );
        console.log(
  'STRIPE CHECKOUT URL:',
  checkoutUrl,
);

await Linking.openURL(checkoutUrl);
    } catch (error) {
      console.log(
        'CHECKOUT ERROR:',
        error?.response?.data ||
          error?.message ||
          error,
      );

      const message =
        error?.response?.data?.msg ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Unable to start payment.';

      Alert.alert(
        'Payment Error',
        message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B121C"
      />

      <View style={styles.header}>
        <BackBar title="Complete Payment" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }>
        <View style={styles.iconBox}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="card-outline"
              size={31}
              color="#55A9FF"
            />
          </View>

          <Text style={styles.title}>
            Secure Payment
          </Text>

          <Text style={styles.subtitle}>
            Complete your payment to
            confirm this parcel request.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Request
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>
              Request
            </Text>

            <Text style={styles.value}>
              #
              {String(
                request?._id || '',
              )
                .slice(-8)
                .toUpperCase()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Item
            </Text>

            <Text style={styles.value}>
              {request?.item_type ===
              'document'
                ? 'Document'
                : 'Parcel'}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>
              Weight
            </Text>

            <Text style={styles.value}>
              {formatWeight(
                request?.weight_in_grams,
              )}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Payment Summary
        </Text>

        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text
              style={styles.priceLabel}>
              Parcel Price
            </Text>

            <Text
              style={styles.priceValue}>
              {formatMoney(
                request?.amount,
              )}
            </Text>
          </View>

          {Number(
            request?.platform_fee || 0,
          ) > 0 ? (
            <View style={styles.priceRow}>
              <Text
                style={
                  styles.priceLabel
                }>
                Platform Fee
              </Text>

              <Text
                style={
                  styles.priceValue
                }>
                {formatMoney(
                  request?.platform_fee,
                )}
              </Text>
            </View>
          ) : null}

          <View
            style={styles.priceDivider}
          />

          <View style={styles.totalRow}>
            <Text
              style={styles.totalLabel}>
              Total Payment
            </Text>

            <Text
              style={styles.totalValue}>
              {formatMoney(
                request?.total_amount,
              )}
            </Text>
          </View>
        </View>

        <View style={styles.secureBox}>
          <Ionicons
            name="shield-checkmark-outline"
            size={21}
            color="#4AD69A"
          />

          <View style={styles.secureContent}>
            <Text
              style={styles.secureTitle}>
              Secure Payment
            </Text>

            <Text
              style={styles.secureText}>
              Your payment is processed
              securely through Stripe.
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#55A9FF"
          />

          <Text style={styles.infoText}>
            Your Parcel Code will be
            generated automatically after
            successful payment confirmation.
          </Text>
        </View>

        <View style={styles.buttonBox}>
          <Button
            text={
              loading
                ? 'Processing...'
                : `Pay ${formatMoney(
                    request?.total_amount,
                  )}`
            }
            icon="card-outline"
            loading={loading}
            disabled={loading}
            onPress={handlePayment}
          />
        </View>

        {loading ? (
          <View
            style={styles.processingRow}>
            <ActivityIndicator
              size="small"
              color="#55A9FF"
            />

            <Text
              style={
                styles.processingText
              }>
              Opening secure Stripe
              checkout...
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
  },

  header: {
    paddingHorizontal: 15,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
  },

  iconBox: {
    alignItems: 'center',
    marginBottom: 27,
  },

  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor:
      'rgba(39,142,245,0.10)',
    borderWidth: 1,
    borderColor:
      'rgba(85,169,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '900',
    marginTop: 14,
  },

  subtitle: {
    color: '#718399',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 6,
    maxWidth: 270,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 9,
  },

  card: {
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 15,
    padding: 15,
    marginBottom: 21,
  },

  row: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  label: {
    color: '#718399',
    fontSize: 11,
  },

  value: {
    color: '#E4EDF7',
    fontSize: 12,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#1D3046',
    marginVertical: 12,
  },

  priceCard: {
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  priceLabel: {
    color: '#718399',
    fontSize: 11,
  },

  priceValue: {
    color: '#C7D3E0',
    fontSize: 12,
    fontWeight: '700',
  },

  priceDivider: {
    height: 1,
    backgroundColor: '#213347',
    marginTop: 2,
    marginBottom: 13,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  totalLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  totalValue: {
    color: '#55A9FF',
    fontSize: 19,
    fontWeight: '900',
  },

  secureBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(74,214,154,0.06)',
    borderWidth: 1,
    borderColor:
      'rgba(74,214,154,0.17)',
    borderRadius: 13,
    padding: 13,
    marginBottom: 11,
  },

  secureContent: {
    flex: 1,
    marginLeft: 10,
  },

  secureTitle: {
    color: '#4AD69A',
    fontSize: 11,
    fontWeight: '800',
  },

  secureText: {
    color: '#718D82',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 2,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor:
      'rgba(39,142,245,0.06)',
    borderWidth: 1,
    borderColor:
      'rgba(85,169,255,0.15)',
    borderRadius: 13,
    padding: 12,
  },

  infoText: {
    flex: 1,
    color: '#74879B',
    fontSize: 9,
    lineHeight: 15,
    marginLeft: 8,
  },

  buttonBox: {
    marginTop: 22,
  },

  processingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 13,
  },

  processingText: {
    color: '#718399',
    fontSize: 9,
    marginLeft: 7,
  },
});