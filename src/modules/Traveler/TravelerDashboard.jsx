import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, View } from 'react-native';

import Ionicons from '@react-native-vector-icons/ionicons';

import Homescreen from './TravelerScreens/HomeScreen';
import MyTripsScreen from './TravelerScreens/MyTripsScreen';
import WalletScreen from './TravelerScreens/WalletScreen';
import Messagescreen from '../Sender/SenderScreens/Messagescreen';
import Profilescreen from '../Sender/SenderScreens/Profilescreen';
import TravelerFlightDetailsScreen from './TravelerScreens/TravelerFlightDetailsScreen';


const Tab = createBottomTabNavigator();

const TravelerDashboard = () => {
  const getTabIcon = routeName => {
    switch (routeName) {
      case 'Home':
        return 'home';

      case 'My Trips':
        return 'airplane';

      case 'Wallet':
        return 'wallet';

      case 'Messages':
        return 'chatbubble-ellipses';

      case 'Profile':
        return 'person';

      default:
        return 'ellipse';
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#55A9FF',
        tabBarInactiveTintColor: '#697B91',

        tabBarHideOnKeyboard: true,

        tabBarLabelStyle: styles.tabLabel,

        tabBarItemStyle: styles.tabItem,

        tabBarStyle: styles.tabBar,

        tabBarIcon: ({ color, focused }) => {
          const iconName = getTabIcon(route.name);

          return (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <Ionicons
                name={iconName}
                size={focused ? 23 : 22}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Homescreen}
      />

      <Tab.Screen
        name="My Trips"
        component={MyTripsScreen}
        options={{
          tabBarLabel: 'Trips',
        }}
      />

      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
      />

      <Tab.Screen
        name="Messages"
        component={Messagescreen}
      />

      <Tab.Screen
        name="Profile"
        component={Profilescreen}
      />
    </Tab.Navigator>
  );
};

export default TravelerDashboard;

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 82 : 70,

    paddingTop: 7,
    paddingBottom: Platform.OS === 'ios' ? 20 : 7,
    paddingHorizontal: 5,

    backgroundColor: '#0D1622',

    borderTopWidth: 1,
    borderTopColor: '#182638',

    elevation: 14,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },

  tabItem: {
    paddingTop: 1,
  },

  iconContainer: {
    width: 42,
    height: 31,

    borderRadius: 11,

    alignItems: 'center',
    justifyContent: 'center',
  },

  activeIconContainer: {
    backgroundColor: 'rgba(30, 144, 255, 0.13)',

    borderWidth: 1,
    borderColor: 'rgba(85, 169, 255, 0.16)',
  },

  tabLabel: {
    fontSize: 10,
    fontWeight: '600',

    marginTop: 1,
  },
});