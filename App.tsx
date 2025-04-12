
import React, { Fragment, useContext, useEffect, useState } from "react";
import SplashScreen from "./android/app/src/screens/SplashScreenView";
import {  Linking, StyleSheet, View } from "react-native";
import Progress from "./android/app/src/screens/Progress";
import { Navigation } from "./android/app/src/navigation/MainStackNavigator";
import axios from "axios";
import AuthContextProvider, { AuthContext } from "./android/app/src/store/slices/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "./android/app/src/config/firebaseConfig";
import { ThemeProvider } from "./android/app/src/store/theme-context";
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { handleNotificationNavigation, setupPushNotificationsPermissions } from "./android/app/src/utils/pushNotification";
import { createNavigationContainerRef } from "@react-navigation/native";
import notifee, { AndroidImportance } from "@notifee/react-native";
import crashlytics from "@react-native-firebase/crashlytics";
import { I18nextProvider } from "react-i18next";
import i18n from "./android/app/src/utils/i18n";

function Root(){
    const [isTryingLogin,setIsTryingLogin] = useState(true);
    const [isShowSplash,setIsShowSplash] = useState(true);
    const authCtx = useContext(AuthContext);
    const [initialNotification, setInitialNotification] = useState<FirebaseMessagingTypes.RemoteMessage|null>(null);
    const navigationRef = createNavigationContainerRef();

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

    useEffect(()=>{
        setupPushNotificationsPermissions();

      
        // Background notification handler
        const unsubscribeOnNotificationOpenedApp =
            messaging().onNotificationOpenedApp((remoteMessage) => {
                handleNotificationNavigation(remoteMessage);
            });
      
        // Killed state handler (app was completely closed)
        messaging()
            .getInitialNotification()
            .then((remoteMessage:FirebaseMessagingTypes.RemoteMessage|null) => {
                if (remoteMessage) {
                    setInitialNotification(remoteMessage);
                    handleNotificationNavigation(remoteMessage);
                }
            });
        // Foreground notification handler
        const unsubscribeOnForeground = messaging().onMessage(
            async (remoteMessage) => {
                await showNotification(remoteMessage);
                handleNotificationNavigation(remoteMessage);
      
            }
        );
      
        async function createNotificationChannel() {
            await notifee.createChannel({
                id: "default",
                name: "Default Channel",
                importance: AndroidImportance.HIGH,
            });
        }
        createNotificationChannel();
      
        const showNotification = async (remoteMessage:FirebaseMessagingTypes.RemoteMessage) => {
            await notifee.requestPermission();
      
            // Display a notification
            await notifee.displayNotification({
                title: remoteMessage.notification?.title || "New Message",
                body: remoteMessage.notification?.body || "You have a new notification",
                android: {
                    channelId: "default",
                    importance: AndroidImportance.HIGH,
                    pressAction: {
                        id: "default",
                    },
                },
            });
        };
      
        
      
        const handleDeepLink = async (event:{url:string}) => {
            const url = event.url;
            console.log("Deep link received:", url);
        };
      
        // Listen for app launch via deep link
        Linking.getInitialURL().then((url) => {
            if (url) handleDeepLink({ url });
        });
      
        // Listen for deep links when the app is running
        const subscription = Linking.addEventListener("url", handleDeepLink);
        return () => {
            subscription.remove();
            unsubscribeOnNotificationOpenedApp();
            unsubscribeOnForeground();
        }; 
    },[]);

    useEffect(() => {
        if (initialNotification && navigationRef.current?.isReady()) {
            handleNotificationNavigation(initialNotification);
            setInitialNotification(null); // Clear after handling
        }
    }, [initialNotification, navigationRef.current?.isReady()]);

    
    if(isTryingLogin || isShowSplash){
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
 

    axios.interceptors.request.use(request => {
        console.log("API Request:", request);
        return request;
    });
      
    axios.interceptors.response.use(response => {
        console.log("API Response:", response.data,response.status);
        return response;
    });
    
   
    return (
        <>
            <I18nextProvider i18n={i18n}>

                <AuthContextProvider>
                    <ThemeProvider>
                        <Root/>
                    </ThemeProvider>

                </AuthContextProvider>
            </I18nextProvider>

        </>
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
