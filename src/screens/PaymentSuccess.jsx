import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';

import {
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import Button from '../components/Button/Button';

const PaymentSuccess = ({
  navigation,
  route,
}) => {
  const request =
    route?.params?.request || {};

  const processing =
    request?.paymentProcessing === true;

  const currency = String(
    request?.currency || 'usd',
  ).toUpperCase();

  const amount = `${currency} ${Number(
    request?.total_amount || 0,
  ).toFixed(2)}`;

  const openDetails = () => {
    navigation.replace(
      'RequestDetails',
      {
        request,
      },
    );
  };

  return (
    <SafeAreaView
      style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B121C"
      />

      <View style={styles.content}>
        <View
          style={[
            styles.iconCircle,
            processing &&
              styles.processingCircle,
          ]}>
          <Ionicons
            name={
              processing
                ? 'time-outline'
                : 'checkmark'
            }
            size={42}
            color={
              processing
                ? '#F3BD58'
                : '#4AD69A'
            }
          />
        </View>

        <Text style={styles.title}>
          {processing
            ? 'Payment Processing'
            : 'Payment Successful'}
        </Text>

        <Text style={styles.subtitle}>
          {processing
            ? 'Stripe accepted the payment. We are waiting for final payment confirmation.'
            : 'Your payment has been confirmed successfully.'}
        </Text>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>
            AMOUNT PAID
          </Text>

          <Text style={styles.amount}>
            {amount}
          </Text>
        </View>

        {!processing &&
        request?.parcel_code ? (
          <View style={styles.codeCard}>
            <View>
              <Text
                style={styles.codeLabel}>
                YOUR PARCEL CODE
              </Text>

              <Text style={styles.code}>
                {request.parcel_code}
              </Text>
            </View>

            <Ionicons
              name="key-outline"
              size={27}
              color="#55A9FF"
            />
          </View>
        ) : null}

        <View style={styles.info}>
          <Ionicons
            name={
              processing
                ? 'sync-outline'
                : 'shield-checkmark-outline'
            }
            size={18}
            color="#55A9FF"
          />

          <Text style={styles.infoText}>
            {processing
              ? 'Payment confirmation may take a few seconds. Open parcel details to refresh the status.'
              : 'Keep your Parcel Code safe. The traveler will use it during delivery.'}
          </Text>
        </View>

        <View style={styles.button}>
          <Button
            text="View Parcel Details"
            icon="arrow-forward"
            onPress={openDetails}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B121C',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  iconCircle: {
    width: 86,
    height: 86,
    borderRadius: 28,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      'rgba(74,214,154,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(74,214,154,0.22)',
  },

  processingCircle: {
    backgroundColor:
      'rgba(243,189,88,0.08)',
    borderColor:
      'rgba(243,189,88,0.22)',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 20,
  },

  subtitle: {
    color: '#718399',
    fontSize: 11,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 15,
  },

  amountCard: {
    alignItems: 'center',
    backgroundColor: '#101B2A',
    borderWidth: 1,
    borderColor: '#1D3046',
    borderRadius: 15,
    padding: 17,
    marginTop: 28,
  },

  amountLabel: {
    color: '#60758E',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  amount: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '900',
    marginTop: 6,
  },

  codeCard: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    backgroundColor: '#0C1725',
    borderWidth: 1,
    borderColor: '#23405F',
    borderRadius: 15,
    padding: 16,
    marginTop: 12,
  },

  codeLabel: {
    color: '#60758E',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  code: {
    color: '#55A9FF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 5,
  },

  info: {
    flexDirection: 'row',
    backgroundColor:
      'rgba(39,142,245,0.06)',
    borderWidth: 1,
    borderColor:
      'rgba(85,169,255,0.15)',
    borderRadius: 13,
    padding: 13,
    marginTop: 12,
  },

  infoText: {
    flex: 1,
    color: '#718399',
    fontSize: 9,
    lineHeight: 15,
    marginLeft: 8,
  },

  button: {
    marginTop: 23,
  },
});