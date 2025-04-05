import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth ,getReactNativePersistence} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "react-native-config";
const firebaseConfig = {
    apiKey: Config.API_KEY,
    authDomain: Config.API_AUTH_DOMAIN,
    projectId: Config.API_AUTH_PROJECT_ID,
    storageBucket: Config.API_AUTH_STORAGE_BUCKET,
    messagingSenderId: Config.API_AUTH_MESSAGE_SENDER_ID,
    appId: Config.API_AUTH_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// Use AsyncStorage for Firebase Auth persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
export { app, auth };
