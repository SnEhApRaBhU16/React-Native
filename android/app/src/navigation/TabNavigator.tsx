import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AntDesign  from "react-native-vector-icons/AntDesign";
import ChatStackNavigator from "./ChatStackNavigator";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import ProfileStack from "./ProfileStack";
import HomeStack from "./HomeStack";


const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => {
                    const routeName = getFocusedRouteNameFromRoute(route) ?? "";

                    // Hide tab bar when inside ChatScreen
                    const hideOnScreens = ["ChatScreen","EditProfile"];
                    return{
                        tabBarStyle: {
                            display: hideOnScreens.includes(routeName) ? "none" : "flex",
                        },
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
                    };
                }}
            >
                <Tab.Screen name="Chat"  component={ChatStackNavigator} />
                <Tab.Screen name="Profile" component={ProfileStack} />
                <Tab.Screen name="Home" component={HomeStack} />
            </Tab.Navigator>
           
        </>
    );
}

