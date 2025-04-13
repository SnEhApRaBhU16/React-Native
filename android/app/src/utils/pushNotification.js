/* eslint-disable @typescript-eslint/no-explicit-any */
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";
import { navigationRef } from "../../../../App";
import notifee, { AndroidImportance } from "@notifee/react-native";

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

export const handleNotificationNavigation = (remoteMessage) => {
    const { screen, subScreen, ...params } = remoteMessage?.data || {};

    // Set default values for main screen and nested screen
    const mainScreen = screen || "Chat";  // Default to "Profile" if no screen is provided
    const nestedScreen = subScreen || null; // If no nested screen is provided, set it to null

    if (navigationRef.isReady()) {
        // First, navigate to the MainTabs navigator (Drawer -> MainTabs)
        navigationRef.navigate("MainTabs", {
            screen: mainScreen, // This will navigate to the main screen like "Profile", "Chat", etc.
            params: params,  // Pass any additional params
        });

        // Now, if a nested screen (like EditProfile) is specified, navigate to it
        if (nestedScreen) {
            // If we're navigating from ProfileMain to EditProfile
            if (mainScreen === "Profile" && nestedScreen === "EditProfile") {
                // Navigate to Profile stack first
                navigationRef.navigate("Profile", {
                    screen: "ProfileMain", // Navigate to ProfileMain first
                });

                // After that, navigate to EditProfile screen
                navigationRef.navigate("Profile", {
                    screen: "EditProfile", // Navigate to EditProfile next
                    params,  // Pass any additional params if needed
                });
            } else {
                // For other cases, just navigate to the nested screen within the main screen
                navigationRef.navigate(mainScreen, {
                    screen: nestedScreen,  // Navigate to nested screen
                    params,  // Pass additional params if any
                });
            }
        }
    }
};



export const handleDeepLink = async (
    url,  // url is a string here
    setDeepLinkUrl // setDeepLinkUrl remains the same
) => {
    setDeepLinkUrl(url); // Set the URL in state
  
    let screen = "Chat"; // Default screen
    let params = undefined; // Default params
  
    // Switch to determine which screen and params to navigate to
    switch (true) {
    case url.includes("profile"):
        screen = "Profile";
        params = { screen: "ProfileMain" };
        break;
    case url.includes("chat"):
        screen = "Chat";
        params = undefined;
        break;
    case url.includes("home"):
        screen = "Home";
        params = undefined;
        break;
    default:
        screen = "Chat"; // Fallback screen
        params = undefined;
        break;
    }
  
    // Ensure navigation is ready before attempting to navigate
    if (navigationRef.current?.isReady()) {
        navigationRef.current.navigate("MainTabs", {
            screen: screen,
            params: params, // Pass the correct params
        });
    }
};


export const createNotificationChannel = async () => {
    const channel = await notifee.createChannel({
        id: "default",
        name: "Default Channel",
        importance: AndroidImportance.HIGH,
    });
    console.log("chamel",channel);
};
export const displayNotification = async (remoteMessage) => {
    await notifee.requestPermission();
  
    await notifee.getNotificationSettings();
    
    await notifee.displayNotification({
        title: remoteMessage.notification?.title || "New Message",
        body: remoteMessage.notification?.body || "You have a new notification",
        data: {
            screen: remoteMessage.data?.screen || "Chat",  // 👈 Make sure this is not undefined
        },
        android: {
            channelId: "default",
            importance: AndroidImportance.HIGH,
            smallIcon: "ic_launcher", // Required!
            pressAction: { id: "default" },
        },
    });
  
};
  