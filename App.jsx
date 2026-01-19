import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './src/screens/SplashScreen'
import WelcomeScreen from './src/screens/WelcomeScreen'
import RegistrationScreen from './src/screens/RegisterationScreen'
import LoginScreen from './src/screens/LoginScreen'
import RoleScreen from './src/screens/RoleScreen'
import SenderDashboard from './src/modules/Sender/SenderDashboard'
import TravelerDashboard from './src/modules/Traveler/TravelerDashboard'
import ProfileviewScreen from './src/screens/ProfileviewScreen'
import FlightDetailScreen from './src/screens/FlightDetailScreen'
import ChangePassword from './src/screens/ChangePassword'
import PassengerSearch from './src/screens/PassengerSearch'
import CarrierProfile from './src/screens/CarrierProfile'
import NewParcelRequest from './src/screens/NewParcelRequest'
import ReceiverDetails from './src/screens/RecieverDetails'
import Notifications from './src/screens/Notifications'
import ConfirmScreen from './src/screens/ConfirmScreen'
import RequestDetails from './src/screens/RequestDetails'
import RequestAccepted from './src/screens/RequestAccepted'
import RequestRejected from './src/screens/RequestRejected'
import AboutScreen from './src/modules/Profile/AboutScreen'
import HelpCenter from './src/modules/Profile/HelpCenter'
import ParcelStatus from './src/screens/ParcelStatus'
import PaymentMethod from './src/screens/PaymentMethod'
import PaymentSuccess from './src/screens/PaymentSuccess'
import DeliveryConfirmation from './src/screens/DeliveryConfirmation'
import PaymentSlip from './src/screens/PaymentSlip'

const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RoleScreen" component={RoleScreen} />
        <Stack.Screen name="SenderDashboard" component={SenderDashboard} />
        <Stack.Screen name="TravelerDashboard" component={TravelerDashboard} />
        <Stack.Screen name="Notifications" component={Notifications} />

        <Stack.Screen name="ProfileviewScreen" component={ProfileviewScreen} />
        <Stack.Screen name="FlightDetails" component={FlightDetailScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="PassengerSearch" component={PassengerSearch} />
        <Stack.Screen name="CarrierProfile" component={CarrierProfile} />
        <Stack.Screen name="NewParcelRequest" component={NewParcelRequest} />
        <Stack.Screen name="ReceiverDetails" component={ReceiverDetails} />
        <Stack.Screen name="ConfirmScreen" component={ConfirmScreen} />

        <Stack.Screen name="RequestDetails" component={RequestDetails} />
        <Stack.Screen name="RequestAccepted" component={RequestAccepted} />
        <Stack.Screen name="RequestRejected" component={RequestRejected} />
        <Stack.Screen name="ParcelStatus" component={ParcelStatus} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
        <Stack.Screen name="DeliveryConfirmation" component={DeliveryConfirmation} />
        <Stack.Screen name="PaymentSlip" component={PaymentSlip} />

        <Stack.Screen name="AboutScreen" component={AboutScreen} />
        <Stack.Screen name="HelpCenter" component={HelpCenter} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})