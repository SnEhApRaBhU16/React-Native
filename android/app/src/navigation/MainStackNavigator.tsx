import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../constants/styles";
import SignupScreen from "../components/Auth/SignupScreen";
import LoginScreen from "../components/Auth/LoginScreen";
import { DarkTheme, DefaultTheme, NavigationContainer, Theme } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "../store/slices/auth-context";
import OtpScreen from "../screens/OtpScreen";
import TabNavigator from "./TabNavigator";
import IconButton from "../ui/IconButton";
import { useTheme } from "../store/theme-context";


export type AuthStackParamList = {
    Signup: undefined; // No parameters needed
    Login: undefined; // No parameters needed
    OTP: { email: string; password: string }; // OTP needs email & password
};

export type AuthenticatedStackParamList = {
    MainTabs: undefined; // No parameters needed
};

const AuthStackNavigator = createNativeStackNavigator<AuthStackParamList>();
const AuthenticatedStackNavigator = createNativeStackNavigator<AuthenticatedStackParamList>();

const lightTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "#ffffff", // Light mode background
        text: "#000000", // Light mode text
    },
};

const darkTheme: Theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: "#000000", // Dark mode background
        text: "#ffffff", // Dark mode text
    },
};

export function AuthStack() {
    return (
        <AuthStackNavigator.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary500 },
                headerTintColor: "white",
                contentStyle: { backgroundColor: Colors.primary100 },
            }}
        >
            <AuthStackNavigator.Screen name="Signup" component={SignupScreen} />
            <AuthStackNavigator.Screen name="Login" component={LoginScreen} />
            <AuthStackNavigator.Screen name="OTP" component={OtpScreen} /> 
        </AuthStackNavigator.Navigator>
    );
}

export function AuthenticatedStack() {
    const authCtx = useContext(AuthContext);
    return (
        <AuthenticatedStackNavigator.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary500 },
                headerTintColor: "white",
                contentStyle: { backgroundColor: Colors.primary100 },
            }}
        >
            <AuthenticatedStackNavigator.Screen
                name="MainTabs"
                component={TabNavigator} // Use TabNavigator here
                options={{
                    headerRight: ({tintColor}) => 
                        <IconButton icon="logout" 
                            color={tintColor||"white"} 
                            size={24} 
                            onPress={authCtx.logout}/>
                }}
            />
        </AuthenticatedStackNavigator.Navigator>
    );
}

export function Navigation() { 
    const authCtx = useContext(AuthContext);
    const { theme } = useTheme(); 
    return (
        <NavigationContainer  theme={theme === "dark" ? darkTheme : lightTheme}>
            {!authCtx.isAuthenticated &&<AuthStack />}
            {authCtx.isAuthenticated && <AuthenticatedStack/>}
        </NavigationContainer>
    );
}