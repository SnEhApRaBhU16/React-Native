import PushNotification from "react-native-push-notification";

const sendNotification = () => {
    PushNotification.localNotification({
        title: "New Update!",
        message: "Check out the latest content.",
        data: {
            deepLink: "configDemo://mainTabs", // Replace with your deep link
        },
    });
};