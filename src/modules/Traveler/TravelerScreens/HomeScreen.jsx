import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import DashboardHeader from '../../../components/DashboardHeader';
import IncRequest from '../../../components/IncRequest';
import TravelComponent from '../../../components/TravelCompnent';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_API_URI } from '../../../constant/API';

const HomeScreen = ({ navigation }) => {
  const [flights, setFlights] = useState([]);

  const getFlights = async () => {
    try {
      const token = await AsyncStorage.getItem('usertoken');

      const response = await axios.get(
        `${BASE_API_URI}/flight/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(
        '===== HOME FLIGHT API RESPONSE =====',
        JSON.stringify(response.data, null, 2),
      );


      setFlights(
        Array.isArray(response.data?.flights)
          ? response.data.flights
          : [],
      );
    } catch (error) {
      console.log(
        '===== HOME FLIGHT ERROR =====',
        error?.response?.data ||
          error?.message ||
          error,
      );

      setFlights([]);
    }
  };

  useEffect(() => {
    getFlights();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#0B121C',
      }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B121C"
      />

      <DashboardHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <TravelComponent
          data={flights}
          navigation={navigation}
        />

        <IncRequest />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('DeliveryConfirmation')
          }
          style={styles.deliveryCard}
        >
          <View style={styles.deliveryIcon}>
            <Ionicons
              name="cube-outline"
              size={22}
              color="#1363C8"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.deliveryTitle}>
              Confirm a Delivery
            </Text>

            <Text style={styles.deliverySubtitle}>
              Handing over a parcel? Enter the codes to complete it.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#ffffff60"
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 16,
            color: '#ffffff3c',
            textAlign: 'center',
            marginVertical: 20,
          }}
        >
          Thats all for now, check back later
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  deliveryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 15,
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#121A26',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  deliveryIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1363C81A',
  },
  deliveryTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  deliverySubtitle: {
    color: '#ffffff9c',
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
});

export default HomeScreen;
