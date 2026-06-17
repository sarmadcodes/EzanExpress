import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DashboardHeader from '../../../components/DashboardHeader';
import IncRequest from '../../../components/IncRequest';
import TravelComponent from '../../../components/TravelCompnent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_API_URI } from '../../../constant/API';
import { USER } from '../../../context/User';

const HomeScreen = () => {
  const [flights, setFlights] = useState([]);
  const { userData, setUserData } = useContext(USER);
  const getFlights = async () => {
    let token = await AsyncStorage.getItem('usertoken');
    axios
      .get(`${BASE_API_URI}/flight/get?user_id=${userData?._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(data => {
        console.log(data.data)
        setFlights(data.data);
      });
  };
  useEffect(() => {
    getFlights();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0B121C' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0B121C" />
      <DashboardHeader />
      <ScrollView>
        <TravelComponent data={flights} />
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

const styles = StyleSheet.create({});
