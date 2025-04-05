// DeepLinking.js
import { Linking } from "@react-navigation/native";

const prefix = "configDemo://"; // Replace with your app's deep link prefix
 
const config = {
    screens: {
        // Define your screens with deep link paths
        MainTabs: "mainTabs",
    },
};
 
const linking = {
    prefixes: [prefix],
    config,
};
 
export { linking };