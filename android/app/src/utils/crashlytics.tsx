import crashlytics from "@react-native-firebase/crashlytics";
// Screen View Tracking

  
// Error Logging with Crashlytics
export const logError = (error, context = "") => {
    if (context) {
        crashlytics().log(context);
    }
    crashlytics().recordError(error);
    console.log("inhere");
    crashlytics().crash();

};
  
// Setting Custom Keys for Crashlytics
export const setCustomKey = (key, value) => {
    crashlytics().setAttribute(key, value);
};
  
// Force a Crash (Useful for testing)
export const triggerCrash = () => {
    crashlytics().crash();
};
  
