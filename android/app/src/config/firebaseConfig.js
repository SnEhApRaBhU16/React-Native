import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth ,getReactNativePersistence} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "react-native-config";
import {  initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAN9G143Zg0FcekZjXmNYaLEVTaDfRmFxA",
    authDomain: "authentication-43730.firebaseapp.com",
    projectId: "authentication-43730",
    storageBucket: "authentication-43730.appspot.com",
    messagingSenderId: "200900970119",
    appId: "1:200900970119:android:a3d3cf9081102178729a22",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// Use AsyncStorage for Firebase Auth persistence
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,

});
export { app, auth,db};
