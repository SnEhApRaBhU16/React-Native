import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign  from "react-native-vector-icons/AntDesign";
import WelcomeScreen from "../screens/WelcomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChatStackNavigator from "./ChatStackNavigator";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName:"wechat"|
                    "profile"|
                    "home"="wechat";
                    if (route.name === "Chat") {
                        iconName = "wechat";
                    } else if (route.name === "Profile") {
                        iconName = "profile";
                    } else if (route.name === "Home") {
                        iconName = "home";  // Home icon for WelcomeScreen
                    }
                    return <AntDesign name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#6200ea",
                tabBarInactiveTintColor: "gray",
                headerShown: false,
            })}
        >
            <Tab.Screen name="Chat" component={ChatStackNavigator} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Home" component={WelcomeScreen} />
        </Tab.Navigator>
    );
}
