import {
  ScrollView,
  StatusBar,
  Text,
} from 'react-native';
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

      // API ka EXACT response:
      // {
      //   flights: [...],
      //   pagination: {...}
      // }

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

export default HomeScreen;