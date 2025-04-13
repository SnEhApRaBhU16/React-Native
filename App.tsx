/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { Fragment, useContext, useEffect, useState } from "react";
import SplashScreen from "./android/app/src/screens/SplashScreenView";
import {  Linking, StyleSheet, View } from "react-native";
import Progress from "./android/app/src/screens/Progress";
import {  Navigation, RootStackParamList } from "./android/app/src/navigation/MainStackNavigator";
import axios from "axios";
import notifee, { EventType } from "@notifee/react-native";
import AuthContextProvider, { AuthContext } from "./android/app/src/store/slices/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./android/app/src/config/firebaseConfig";
import { ThemeProvider } from "./android/app/src/store/theme-context";
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { createNotificationChannel, displayNotification, handleDeepLink, handleNotificationNavigation, setupPushNotificationsPermissions } from "./android/app/src/utils/pushNotification";
import { createNavigationContainerRef } from "@react-navigation/native";
import crashlytics from "@react-native-firebase/crashlytics";
import { I18nextProvider } from "react-i18next";
import i18n from "./android/app/src/utils/i18n";
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export const linking = {
    prefixes: ["myapp://", "https://myapp.com"],
    config: {
        screens: {
            Signup: "signup",
            Login: "login",
            OTP: "otp",

            MainTabs: {
                screens: {
                    Chat: {
                        screens: {
                            ChatScreen: "chatmain",
                            UsersScreen:"chat"
                        },
                    },
                    Profile: {
                        screens: {
                            ProfileMain: "profile",
                        },
                    },
                    Home: {
                        screens: {
                            HomeScreen: "home",
                        },
                    },
                },
            },
        },
    },
};

  
function Root(){

    const [isTryingLogin,setIsTryingLogin] = useState(true);
    const [isShowSplash,setIsShowSplash] = useState(true);
    const authCtx = useContext(AuthContext);
    useEffect(()=>{
        crashlytics().log("App Started");
        setTimeout(()=>{
            setIsShowSplash(false);
        },3800);
        async function fetchToken() {
            const storedToken =  await AsyncStorage.getItem("token");
            if(storedToken){
                authCtx.authenticate(storedToken);
            }
            setIsTryingLogin(false);
            await messaging().requestPermission();
    
        }
        fetchToken();  
    },[]);

    if(isTryingLogin || isShowSplash ){
        return <View style={styles.container}>
            <SplashScreen/>
            <Progress   steps={10} height={10}  />
        </View>;
    }
    return  (<Fragment>
        <Navigation/>
    </Fragment>);
}
function App(): React.JSX.Element {
    const [initialNotification, setInitialNotification] = useState<FirebaseMessagingTypes.RemoteMessage | null>(null);
    const [deepLinkUrl,setDeepLinkUrl] = useState("");
    const {setRedirectionTab} = useContext(AuthContext);
   
 

    // --- Setup push notification + deep linking ---
    useEffect(() => {
        // Request permissions & setup channels
        setupPushNotificationsPermissions();
        createNotificationChannel();

        // Killed state push notification
        messaging().getInitialNotification().then((remoteMessage) => {
            if (remoteMessage) {
                console.log("killedstate",remoteMessage);
                setRedirectionTab(remoteMessage.data?.screen as string);
                setInitialNotification(remoteMessage);
            }
        });

        // Background notification
        const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp((remoteMessage) => {
            setInitialNotification(remoteMessage);
            setRedirectionTab(remoteMessage.data?.screen as string);

        });

        

        //  Foreground push
        const unsubscribeOnForeground = messaging().onMessage(async (remoteMessage) => {
            console.log("foregrund",remoteMessage)  ;
            await displayNotification(remoteMessage);
        });

       


        //  Deep link when app launches from URL (killed state)
        Linking.getInitialURL().then((url) => {
            if (url) {
                let route = "";
                switch (true) {
                case url.includes("profile"):
                    route="Profile";
                    break;
                case url.includes("chat"):
                    route = "Chat";
                    break;
                case url.includes("home"):
                    route = "Home";
                    break;
                default:
                    route = "Chat"; // Fallback screen
                    break;
                }
                setRedirectionTab(route as string);
                setDeepLinkUrl(url); // Store the deep link to handle it later
            }
        });

        //  Deep link when app is running or in background
        const deepLinkSubscription = Linking.addEventListener("url", (url)=>handleDeepLink(url.url,setDeepLinkUrl));

        return () => {
            deepLinkSubscription.remove();
            unsubscribeOnNotificationOpenedApp();
            unsubscribeOnForeground();
        };
    }, []);

    // Delay navigation from initial notification until nav is ready
    useEffect(() => {
        if (initialNotification) {
            const interval = setInterval(() => {
                if (navigationRef.isReady()) {
                    handleNotificationNavigation(initialNotification);
                    setInitialNotification(null);
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [initialNotification]);
    useEffect(() => {
        if (deepLinkUrl!=="") {
            const interval = setInterval(() => {
                if (deepLinkUrl &&navigationRef.isReady()) {
                    handleDeepLink(deepLinkUrl,setDeepLinkUrl);
                    setDeepLinkUrl("");
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, [deepLinkUrl]);

    useEffect(() => {
        const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS) {
                console.log("🔔 Notification pressed in foreground", detail);
                const screen = detail.notification?.data?.screen;
                console.log("sss",screen,navigationRef.isReady());
                if (screen && navigationRef.isReady()) {
                    navigationRef.reset({
                        index: 0,
                        routes: [
                            {
                                name: "MainTabs",
                                state: {
                                    routes: [
                                        { name: screen as string },
                                    ],
                                },
                            },
                        ],
                    });                }
            }
        });

        return () => unsubscribe();
    }, []);
    

   

    // Axios debugging
    useEffect(() => {
        axios.interceptors.request.use(request => {
            console.log("API Request:", request);
            return request;
        });

        axios.interceptors.response.use(response => {
            console.log("API Response:", response.data, response.status);
            return response;
        });
    }, []);

    // ---------------------------
    // Render App
    // ---------------------------
    return (
        <I18nextProvider i18n={i18n}>
            <AuthContextProvider>
                <ThemeProvider>
                    <Root />
                </ThemeProvider>
            </AuthContextProvider>
        </I18nextProvider>
    );
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"#fff",
        justifyContent:"center",
        padding:20
    },
});
export default App;
