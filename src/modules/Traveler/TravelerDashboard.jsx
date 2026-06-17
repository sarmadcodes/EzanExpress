import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Homescreen from "./TravelerScreens/HomeScreen";
import WalletScreen from "./TravelerScreens/WalletScreen";
import Messagescreen from "../Sender/SenderScreens/Messagescreen";
import Profilescreen from "../Sender/SenderScreens/Profilescreen";

import Ionicons from "@react-native-vector-icons/ionicons";

const Tab = createBottomTabNavigator();

const TravelerDashboard = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1E90FF",
        tabBarInactiveTintColor: "#a0a6b5ff",
        tabBarStyle: {
          backgroundColor: "#0B121C",
          borderTopWidth: 0.5,
          borderTopColor: "#555",
          
        },
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Wallet") iconName = "wallet-outline";
          else if (route.name === "Messages") iconName = "chatbubble-ellipses";
          else if (route.name === "Profile") iconName = "person-sharp";

          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Homescreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Messages" component={Messagescreen} />
      <Tab.Screen name="Profile" component={Profilescreen} />
    </Tab.Navigator>
  );
};

export default TravelerDashboard;