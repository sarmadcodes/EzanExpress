import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';

import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import Button from '../components/Button/Button';

const RequestSuccess = ({navigation, route}) => {
  const request = route?.params?.request || {};
  const flight = route?.params?.flight || {};

  const travelerName =
    flight?.passenger?.name ||
    'Traveler';

  const departure =
    flight?.departure_airport_city ||
    flight?.departure ||
    '--';

  const destination =
    flight?.destination_airport_city ||
    flight?.destination ||
    '--';

  const itemType =
    request?.item_type === 'document'
      ? 'Document'
      : 'Parcel';

  const weightInGrams =
    Number(request?.weight_in_grams) || 0;

  const weightText =
    request?.item_type === 'document'
      ? `${weightInGrams} g`
      : `${Number(weightInGrams / 1000).toFixed(2)} kg`;

  const goHome = () => {
    navigation.popToTop();
  };

  const viewRequests = () => {
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#08111F"
      />

      <View style={styles.container}>
        <View style={styles.content}>


          <View style={styles.successGlow}>
            <View style={styles.successCircle}>
              <Ionicons
                name="checkmark"
                size={40}
                color="#FFFFFF"
              />
            </View>
          </View>

          <Text style={styles.title}>
            Request Sent!
          </Text>

          <Text style={styles.description}>
            Your request has been sent to the traveler.
            You’ll be notified when they respond.
          </Text>


          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />

            <Text style={styles.statusText}>
              Pending Response
            </Text>
          </View>


          <View style={styles.card}>


            <View style={styles.travelerRow}>
              <View style={styles.avatar}>
                <Ionicons
                  name="person-outline"
                  size={21}
                  color="#55A9FF"
                />
              </View>

              <View style={styles.travelerInfo}>
                <Text style={styles.label}>
                  REQUEST SENT TO
                </Text>

                <Text
                  numberOfLines={1}
                  style={styles.travelerName}
                >
                  {travelerName}
                </Text>
              </View>

              <View style={styles.pendingMini}>
                <Text style={styles.pendingMiniText}>
                  PENDING
                </Text>
              </View>
            </View>

            <View style={styles.divider} />


            <View style={styles.routeRow}>
              <View style={styles.routeSide}>
                <Text
                  numberOfLines={1}
                  style={styles.city}
                >
                  {departure}
                </Text>

                <Text style={styles.routeLabel}>
                  From
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
                  style={styles.city}
                >
                  {destination}
                </Text>

                <Text style={styles.routeLabel}>
                  To
                </Text>
              </View>
            </View>

            <View style={styles.divider} />


            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons
                    name={
                      request?.item_type === 'document'
                        ? 'document-text-outline'
                        : 'cube-outline'
                    }
                    size={18}
                    color="#8CA2B8"
                  />
                </View>

                <View>
                  <Text style={styles.detailLabel}>
                    Item
                  </Text>

                  <Text style={styles.detailValue}>
                    {itemType}
                  </Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <View style={styles.detailIcon}>
                  <Ionicons
                    name="scale-outline"
                    size={18}
                    color="#8CA2B8"
                  />
                </View>

                <View>
                  <Text style={styles.detailLabel}>
                    Weight
                  </Text>

                  <Text style={styles.detailValue}>
                    {weightText}
                  </Text>
                </View>
              </View>
            </View>
          </View>


          <View style={styles.nextCard}>
            <View style={styles.nextIcon}>
              <Ionicons
                name="time-outline"
                size={20}
                color="#55A9FF"
              />
            </View>

            <View style={styles.nextContent}>
              <Text style={styles.nextTitle}>
                What happens next?
              </Text>

              <Text style={styles.nextText}>
                Wait for the traveler to accept your request.
                Payment will become available after acceptance.
              </Text>
            </View>
          </View>
        </View>


        <View style={styles.bottom}>
          <Button
            text="View My Requests"
            icon="receipt-outline"
            onPress={viewRequests}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goHome}
            style={styles.homeButton}
          >
            <Ionicons
              name="home-outline"
              size={16}
              color="#7890A7"
            />

            <Text style={styles.homeButtonText}>
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RequestSuccess;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111F',
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },

  successGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(34,197,94,0.07)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#22B967',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 7,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  title: {
    color: '#F4F8FC',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 20,
  },

  description: {
    maxWidth: 310,
    color: '#71859A',
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 8,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.09)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 15,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    marginRight: 6,
  },

  statusText: {
    color: '#E9A936',
    fontSize: 10,
    fontWeight: '800',
  },

  card: {
    width: '100%',
    backgroundColor: '#101B2A',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#1C3046',
    padding: 15,
    marginTop: 27,
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  travelerInfo: {
    flex: 1,
    marginLeft: 11,
  },

  label: {
    color: '#5F7389',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  travelerName: {
    color: '#F0F5FB',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },

  pendingMini: {
    backgroundColor: 'rgba(245,158,11,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },

  pendingMiniText: {
    color: '#E9A936',
    fontSize: 8,
    fontWeight: '900',
  },

  divider: {
    height: 1,
    backgroundColor: '#1C2E42',
    marginVertical: 14,
  },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  routeSide: {
    width: '31%',
  },

  routeRight: {
    alignItems: 'flex-end',
  },

  city: {
    color: '#EDF4FB',
    fontSize: 13,
    fontWeight: '800',
  },

  routeLabel: {
    color: '#63788E',
    fontSize: 9,
    marginTop: 3,
  },

  routeMiddle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
  },

  routeLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2B425A',
  },

  planeCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0B1624',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },

  detailsRow: {
    flexDirection: 'row',
  },

  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#172536',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  detailLabel: {
    color: '#667B90',
    fontSize: 8,
  },

  detailValue: {
    color: '#DDE7F0',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },

  nextCard: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'rgba(39,142,245,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(85,169,255,0.13)',
    borderRadius: 13,
    padding: 13,
    marginTop: 15,
  },

  nextIcon: {
    width: 35,
    height: 35,
    borderRadius: 10,
    backgroundColor: 'rgba(39,142,245,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nextContent: {
    flex: 1,
    marginLeft: 10,
  },

  nextTitle: {
    color: '#DCE8F4',
    fontSize: 11,
    fontWeight: '800',
  },

  nextText: {
    color: '#71869B',
    fontSize: 9,
    lineHeight: 14,
    marginTop: 3,
  },

  bottom: {
    paddingTop: 12,
    paddingBottom: 15,
  },

  homeButton: {
    minHeight: 47,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  homeButtonText: {
    color: '#7890A7',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
});
