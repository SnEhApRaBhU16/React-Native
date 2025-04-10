import { useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import PushNotification from "react-native-push-notification";

const checkApplicationPermission = async () => {
    if (Platform.OS === "android") {
        try {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            );
        } catch (error) {
            console.error(error);
        }
    }
};

const RemoteNotification = () => {
    useEffect(() => {
        checkApplicationPermission();
        // Using this function as we are rendering local notification so without this function we will receive multiple notification for same notification
        // We have same channelID for every FCM test server notification.
        PushNotification.getChannels(function (channel_ids) {
            channel_ids.forEach((id) => {
                PushNotification.deleteChannel(id);
            });
        });
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(token) {
                console.log("TOKEN:", token);
            },
            // (required) Called when a remote or local notification is opened or received
            onNotification: function(notification) {
                console.log("NOTIFICATION:", notification);
                // process the notification here
            },
            // Android only
            senderID: "200900970119",
           
            popInitialNotification: true,
            requestPermissions: true
        });
    }, []);
    return null;
};
export default RemoteNotification;