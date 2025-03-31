import { Image, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../store/slices/auth-context";


function WelcomeScreen() {
    const [fetchedMessage,setFetchedMessage] = useState("");
    const authCtx = useContext(AuthContext);
    const token = authCtx.token;
    
    useEffect(()=>{
        axios.get(
            "https://authentication-43730-default-rtdb.firebaseio.com/message.json?auth="+token
        ).then((response)=>{
            setFetchedMessage(response.data);
        });
    },[token]);
    return (
        <View style={styles.rootContainer}>
            {authCtx.photoUrl!==""&&
            <Image source={{ uri: authCtx.photoUrl }} style={styles.image} />}
            <Text style={styles.title}>Welcome!</Text>
            <Text>You authenticated successfully!</Text>
            <Text>{fetchedMessage}</Text>
            {authCtx.displayName!==""&&<Text>Name: {authCtx.displayName}</Text> }
            <Text>Email: {authCtx.email}</Text>
        </View>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
    },
    image: {
        width: 100, // Adjust size as needed
        height: 100, // Keep width and height the same for a perfect circle
        borderRadius: 50, // Half of width/height to make it circular
        resizeMode: "cover", // Ensures the image covers the entire area
        borderWidth: 2, // Optional: Adds a border
        borderColor: "#6200ea", // Optional: Change border color if needed
    },
});