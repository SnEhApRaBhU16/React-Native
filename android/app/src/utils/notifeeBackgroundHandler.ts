import notifee, { EventType } from "@notifee/react-native";

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    if (type === EventType.ACTION_PRESS && pressAction.id === "default") {
        console.log("User pressed the notification in background!", notification?.data);
    // You can handle custom logic here, like navigation
    }
});