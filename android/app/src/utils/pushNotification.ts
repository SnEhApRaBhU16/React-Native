import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";
import { createNavigationContainerRef } from "@react-navigation/native";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import { AuthenticatedStackParamList, AuthStackParamList } from "../navigation/MainStackNavigator";
// Request FCM token
export const getFCMToken = async () => {
    try {
        // Register the device with FCM
        await messaging().registerDeviceForRemoteMessages();

        // Get the token

        // Here you would typically send this token to your backend
        // sendTokenToBackend(token);
    } catch (error) {
        console.error("Failed to get FCM token:", error);
    }
};

export const setupPushNotificationsPermissions = async () => {
    if (Platform.OS === "ios") {
        try {
            const authStatus = await messaging().requestPermission();
            const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                // await getFCMToken();
            }
        } catch (err) {
            console.warn("iOS permission error:", err);
        }
    } else if (Platform.OS === "android") {
        try {
        // For Android 13+ (API level 33+)
            if (Platform.Version >= 33) {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
            
            }
            // Get token regardless of permission (Android allows some notifications without permission)
            await getFCMToken();
        } catch (err) {
            console.warn("Android permission error:", err);
        }
    }
};

export const handleNotificationNavigation = (remoteMessage:FirebaseMessagingTypes.RemoteMessage) => {
    const navigationRef = createNavigationContainerRef<AuthStackParamList| AuthenticatedStackParamList>();
    if (!remoteMessage || !remoteMessage.data) return;

    // Check if we have navigation data in the notification
    if (remoteMessage.data) {
        // Navigate to MainTabs and then to Chats tab
        if (navigationRef.current) {
        // If we're not at MainTabs already, navigate there first
            if (navigationRef.current.getCurrentRoute()?.name !== "MainTabs") {
                navigationRef.current.navigate("MainTabs" as never);
            }

            // Then navigate to the Chats tab within MainTabs
            navigationRef.current.navigate("MainTabs", {
                screen: "Home",
            } );
        }
    } 

};